import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { STAR_COLORS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { houseId, name, color } = await request.json();

    if (!houseId || !name || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!STAR_COLORS.some((c) => c.id === color)) {
      return NextResponse.json({ error: "Invalid color" }, { status: 400 });
    }

    const existingUser = await prisma.houseUser.findFirst({
      where: { houseId, color },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Color already taken" },
        { status: 400 }
      );
    }

    const user = await prisma.houseUser.create({
      data: {
        name,
        color,
        house: { connect: { id: houseId } },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
