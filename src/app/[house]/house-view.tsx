"use client";

import { useEffect, useState } from "react";
import { House, HouseSection, HouseUser, Star, Task } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { STAR_COLORS } from "@/lib/constants";
import clsx from "clsx";

type HouseWithRelations = House & {
  sections: (HouseSection & {
    tasks: (Task & {
      stars: Star[];
    })[];
  })[];
  users: HouseUser[];
};

export function HouseView({ house }: { house: HouseWithRelations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedColor, setSelectedColor] = useState(STAR_COLORS[0].id);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem(`house-${house.id}-userId`);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setIsOpen(true);
    }
  }, [house.id]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/house/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        houseId: house.id,
        name: userName,
        color: selectedColor,
      }),
    });

    if (!res.ok) {
      // TODO: Handle error
      return;
    }

    const user = await res.json();
    localStorage.setItem(`house-${house.id}-userId`, user.id);
    setUserId(user.id);
    setIsOpen(false);
  }

  async function handleAddStar(taskId: string) {
    if (!userId || !currentUser) return;

    const rotation = Math.random() * 30 - 15; // -15 to 15 degrees
    const xOffset = Math.random() * 20 - 10; // -10 to 10 pixels
    const yOffset = Math.random() * 20 - 10; // -10 to 10 pixels

    const res = await fetch("/api/house/star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId,
        color: currentUser.color,
        rotationDegrees: rotation,
        xOffset,
        yOffset,
      }),
    });

    if (!res.ok) {
      // TODO: Handle error
      return;
    }

    // Optimistically update UI
    window.location.reload();
  }

  const availableColors = STAR_COLORS.filter(
    (color) => !house.users.some((user) => user.color === color.id)
  );

  const currentUser = house.users.find((user) => user.id === userId);

  return (
    <>
      <div className="min-h-full">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    {house.name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {house.users.map((user) => (
                  <div
                    key={user.id}
                    className={clsx(
                      "flex items-center gap-1 px-3 py-1 rounded-full transition-all",
                      user.id === userId && "bg-indigo-50 shadow-sm",
                      "hover:scale-105"
                    )}
                  >
                    <StarIconSolid
                      className={clsx(
                        "h-5 w-5",
                        STAR_COLORS.find((c) => c.id === user.color)?.class
                      )}
                    />
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {house.sections.map((section) => (
            <div key={section.id} className="mt-8">
              <h2 className="text-xl font-bold text-indigo-900 pl-1">
                {section.name}
              </h2>
              <div className="mt-4 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
                {section.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group relative flex items-center justify-between p-4 transition-colors hover:bg-indigo-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-medium text-gray-900">
                        {task.name}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <div className="relative h-8 w-32">
                        {task.stars.map((star, i) => (
                          <StarIconSolid
                            key={star.id}
                            className={clsx(
                              "absolute h-8 w-8 transition-all duration-150",
                              STAR_COLORS.find((c) => c.id === star.color)
                                ?.class,
                              "drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]",
                              "hover:scale-110"
                            )}
                            style={{
                              transform: `rotate(${star.rotationDegrees}deg) translate(${star.xOffset}px, ${star.yOffset}px)`,
                              right: `${i * 12}px`,
                            }}
                          />
                        ))}
                      </div>
                      {currentUser && (
                        <button
                          type="button"
                          onClick={() => handleAddStar(task.id)}
                          className="rounded-full p-2 transition-all hover:bg-white hover:scale-110 hover:shadow-md active:scale-95"
                        >
                          <StarIconOutline
                            className={clsx(
                              "h-6 w-6",
                              STAR_COLORS.find(
                                (c) => c.id === currentUser.color
                              )?.class,
                              "drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]"
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Transition show={isOpen} as="div" className="relative z-10">
        <Dialog onClose={() => {}}>
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm" />

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-indigo-900"
                    >
                      Welcome to {house.name}!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Choose your name and star color to get started.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateUser} className="mt-5 sm:mt-6">
                  <div className="grid gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Your name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Your star color
                      </label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {availableColors.map((color) => (
                          <div key={color.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedColor(color.id)}
                              className={clsx(
                                "relative flex h-10 w-full items-center justify-center rounded-lg border py-3 transition-all hover:scale-105",
                                selectedColor === color.id
                                  ? "border-2 border-indigo-600 bg-indigo-50 shadow-sm"
                                  : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                              )}
                            >
                              <StarIconSolid
                                className={clsx("h-6 w-6", color.class)}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!userName || !selectedColor}
                    className="mt-6 w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Start Contributing
                  </button>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
