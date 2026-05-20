import type { Metadata } from "next";

export const sharedOgImage: NonNullable<Metadata["openGraph"]>["images"] = [
  {
    url: "/images/og-image.png",
    type: "image/png",
    width: 1025,
    height: 576,
    alt: "LE FOG",
  },
];
