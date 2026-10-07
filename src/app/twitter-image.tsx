import { ImageResponse } from "next/og";
import SocialImage from "@/components/marketing/SocialImage";

export const alt = "Souqivo: One workspace from kickoff to approval.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<SocialImage />, size);
}
