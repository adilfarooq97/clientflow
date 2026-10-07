import type { FileType } from "@/types";

export function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  ) {
    return "document";
  }

  return "other";
}

export function isExternalFileUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}