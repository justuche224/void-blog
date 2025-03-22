import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugifyString(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function createExcerpt(content: string, maxLength = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#+\s+(.*)/g, "$1") // Remove headings
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
    .replace(/!\[(.*?)\]$$.*?$$/g, "$1") // Remove images
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();

  // Truncate to maxLength
  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last space before maxLength
  const lastSpace = plainText.lastIndexOf(" ", maxLength);
  return lastSpace > 0
    ? plainText.substring(0, lastSpace) + "..."
    : plainText.substring(0, maxLength) + "...";
}
