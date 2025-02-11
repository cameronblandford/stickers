import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SettingsView } from "@/app/[house]/settings/settings-view";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ house: string }>;
}) {
  const { house: houseSlug } = await params;
  const house = await prisma.house.findUnique({
    where: { name: houseSlug },
    include: {
      sections: {
        orderBy: { createdAt: "asc" },
        include: {
          tasks: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!house) {
    notFound();
  }

  return <SettingsView house={house} />;
}
