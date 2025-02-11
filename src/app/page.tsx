import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DEFAULT_SECTIONS, DEFAULT_TASKS } from "@/lib/constants";

async function createHouse(formData: FormData) {
  "use server";

  const houseName = formData.get("houseName")?.toString().toLowerCase();
  if (!houseName) throw new Error("House name is required");

  const house = await prisma.house.create({
    data: {
      name: houseName,
      sections: {
        create: DEFAULT_SECTIONS.map((sectionName) => ({
          name: sectionName,
          tasks: {
            create: DEFAULT_TASKS[sectionName].map((taskName) => ({
              name: taskName,
            })),
          },
        })),
      },
    },
  });

  redirect(`/${house.name}`);
}

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          share.house
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create or join a house to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-12">
          <form action={createHouse} className="space-y-6">
            <div>
              <label
                htmlFor="houseName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                House Name
              </label>
              <div className="mt-2">
                <input
                  id="houseName"
                  name="houseName"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="my-cool-house"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This will be your house&apos;s URL: share.house/
                <span className="text-gray-900">house-name</span>
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create House
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
