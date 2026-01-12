import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { SUPABASE_STORAGE_BUCKET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@/config";

export async function POST(req: NextRequest) {
  try {
    // First verify user is authenticated using the regular client
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to upload files." },
        { status: 401 }
      );
    }

    // Use service role client for uploads (bypasses RLS)
    // This is safe because we've already verified the user is authenticated
    const serviceClient = SUPABASE_SERVICE_ROLE_KEY && SUPABASE_URL
      ? createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })
      : null;

    // Fallback to regular client if service role key is not available
    const uploadClient = serviceClient || supabase;

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = formData.get("folder") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const bucket = SUPABASE_STORAGE_BUCKET || "properties";
    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate file type - accept both images and videos
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      
      if (!isImage && !isVideo) {
        errors.push(`${file.name}: Not an image or video file`);
        continue; // Skip non-image/video files
      }

      // Generate unique filename
      const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const dir = folder || (isVideo ? "properties/videos" : "properties");
      const path = `${dir}/${filename}`;

      try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage using service client (bypasses RLS)
        const { data: uploadData, error: uploadError } = await uploadClient.storage
          .from(bucket)
          .upload(path, buffer, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          errors.push(`${file.name}: ${uploadError.message || "Upload failed"}`);
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = uploadClient.storage.from(bucket).getPublicUrl(path);

        if (publicUrl) {
          urls.push(publicUrl);
        } else {
          errors.push(`${file.name}: Failed to get public URL`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error processing ${file.name}:`, error);
        errors.push(`${file.name}: ${errorMessage}`);
      }
    }

    // If no files were uploaded successfully, return error
    if (urls.length === 0) {
      return NextResponse.json(
        { 
          error: "Failed to upload any files",
          details: errors.length > 0 ? errors : ["Unknown error occurred"],
        },
        { status: 500 }
      );
    }

    // Return success with any partial errors
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          urls,
          warnings: `Some files failed to upload: ${errors.join(", ")}`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

