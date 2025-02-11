export const STAR_COLORS = [
  { id: "red", name: "Red", class: "text-red-500" },
  { id: "blue", name: "Blue", class: "text-blue-500" },
  { id: "green", name: "Green", class: "text-green-500" },
  { id: "yellow", name: "Yellow", class: "text-yellow-500" },
  { id: "purple", name: "Purple", class: "text-purple-500" },
  { id: "pink", name: "Pink", class: "text-pink-500" },
] as const;

export type StarColor = (typeof STAR_COLORS)[number]["id"];

export const DEFAULT_SECTIONS = [
  "Kitchen",
  "Bathroom",
  "Living Room",
  "General",
] as const;

export const DEFAULT_TASKS = {
  Kitchen: ["Dishes", "Counters", "Floor", "Trash", "Recycling"],
  Bathroom: ["Toilet", "Shower", "Sink", "Floor"],
  "Living Room": ["Vacuum", "Dust", "Organize"],
  General: ["Take out trash", "Water plants", "Clean windows"],
} as const;
