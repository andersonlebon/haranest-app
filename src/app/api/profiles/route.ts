import { ProfileRepository } from "@/db/repositories/profile.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Optional: get query param ?userId=... to fetch a single profile
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  try {
    if (userId) {
      // Fetch single profile
      const profile = await ProfileRepository.findByUserId(userId);
      return NextResponse.json({ profile });
    } else {
      // Fetch all profiles
      const profiles = await ProfileRepository.findAll();
      return NextResponse.json({ profiles });
    }
  }  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const profile = await ProfileRepository.create(data);
    return NextResponse.json({ profile });
  }  catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      return NextResponse.json({ error: message }, { status: 500 });
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
  }  catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      return NextResponse.json({ error: message }, { status: 500 });
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
  }  catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
}
