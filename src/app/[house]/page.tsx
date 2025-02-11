import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { HouseView } from "@/app/[house]/house-view";

export default async function HousePage({
  params,
}: {
  params: Promise<{ house: string }>;
}) {
  const { house: houseSlug } = await params;
  const house = await prisma.house.findUnique({
    where: { name: houseSlug },
    include: {
      sections: {
        where: { archived: false },
        orderBy: { createdAt: "asc" },
        include: {
          tasks: {
            orderBy: { createdAt: "asc" },
            include: {
              stars: {
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      },
      users: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!house) {
    notFound();
  }

  return <HouseView house={house} />;
}
