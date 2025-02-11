import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { STAR_COLORS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { taskId, color, rotationDegrees, xOffset, yOffset } =
      await request.json();

    if (
      !taskId ||
      !color ||
      rotationDegrees == null ||
      xOffset == null ||
      yOffset == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!STAR_COLORS.some((c) => c.id === color)) {
      return NextResponse.json({ error: "Invalid color" }, { status: 400 });
    }

    const star = await prisma.star.create({
      data: {
        color,
        rotationDegrees,
        xOffset,
        yOffset,
        task: { connect: { id: taskId } },
      },
    });

    return NextResponse.json(star);
  } catch (error) {
    console.error("Error creating star:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
