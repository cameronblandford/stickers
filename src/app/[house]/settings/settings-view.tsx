"use client";

import { useState } from "react";
import { House, HouseSection, Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

type HouseWithRelations = House & {
  sections: (HouseSection & {
    tasks: Task[];
  })[];
};

export function SettingsView({ house }: { house: HouseWithRelations }) {
  const router = useRouter();
  const [newSectionName, setNewSectionName] = useState("");
  const [newTaskNames, setNewTaskNames] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newSectionName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await fetch("/api/house/section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        houseId: house.id,
        name: newSectionName,
      }),
    });

    if (res.ok) {
      setNewSectionName("");
      router.refresh();
    }
    setIsSubmitting(false);
  }

  async function handleAddTask(e: React.FormEvent, sectionId: string) {
    e.preventDefault();
    const taskName = newTaskNames[sectionId];
    if (!taskName?.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await fetch("/api/house/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId,
        name: taskName,
      }),
    });

    if (res.ok) {
      setNewTaskNames((prev) => ({ ...prev, [sectionId]: "" }));
      router.refresh();
    }
    setIsSubmitting(false);
  }

  async function handleArchiveSection(sectionId: string) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const res = await fetch("/api/house/section", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId,
        archived: true,
      }),
    });

    if (res.ok) {
      router.refresh();
    }
    setIsSubmitting(false);
  }

  async function handleDeleteTask(taskId: string) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const res = await fetch("/api/house/task", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });

    if (res.ok) {
      router.refresh();
    }
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-full">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href={`/${house.name}`}
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-500"
              >
                {house.name}
              </Link>
              <span className="text-sm text-gray-500">Settings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Add New Section
            </h2>
            <form onSubmit={handleAddSection} className="mt-4 flex gap-4">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Section name"
                className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                disabled={!newSectionName.trim() || isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Section
              </button>
            </form>
          </div>

          {house.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {section.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleArchiveSection(section.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Archive Section
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
                {section.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 hover:bg-indigo-50"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {task.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-full p-1 text-gray-400 hover:bg-white hover:text-red-600 hover:shadow-sm"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <form
                  onSubmit={(e) => handleAddTask(e, section.id)}
                  className="flex items-center gap-2 border-t border-gray-100 p-4"
                >
                  <input
                    type="text"
                    value={newTaskNames[section.id] || ""}
                    onChange={(e) =>
                      setNewTaskNames((prev) => ({
                        ...prev,
                        [section.id]: e.target.value,
                      }))
                    }
                    placeholder="Add a task"
                    className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="submit"
                    disabled={!newTaskNames[section.id]?.trim() || isSubmitting}
                    className="rounded-full p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
