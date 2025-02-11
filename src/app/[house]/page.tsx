import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { HouseView } from "@/app/[house]/house-view";

export default async function HousePage({
  params,
}: {
  params: { house: string };
}) {
  const house = await prisma.house.findUnique({
    where: { name: params.house },
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
