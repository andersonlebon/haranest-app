import { ProfileRepository } from "@/db/repositories/profile.repository";
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, getStringParam } from "@/lib/api/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = getStringParam(searchParams, "userId");

    if (userId) {
      // Fetch single profile
      const profile = await ProfileRepository.findByUserId(userId);
      return NextResponse.json({ profile });
    } else {
      // Fetch all profiles
      const profiles = await ProfileRepository.findAll();
      return NextResponse.json({ profiles });
    }
  } catch (error) {
    return createErrorResponse(error, 500, "Error fetching profiles");
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const profile = await ProfileRepository.create(data);
    return NextResponse.json({ profile });
  } catch (error) {
    return createErrorResponse(error, 500, "Error creating profile");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, data } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const profile = await ProfileRepository.update(userId, data);
    return NextResponse.json({ profile });
  } catch (error) {
    return createErrorResponse(error, 500, "Error updating profile");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const profile = await ProfileRepository.delete(userId);
    return NextResponse.json({ profile });
  } catch (error) {
    return createErrorResponse(error, 500, "Error deleting profile");
  }
}
