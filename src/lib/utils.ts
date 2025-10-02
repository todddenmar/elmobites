import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return formatted;
};

export const pluralize = ({
  number,
  plural,
  singular,
}: {
  number: number;
  plural: string;
  singular: string;
}) => {
  if (number > 1) {
    return `${number} ${plural}`;
  } else {
    return `${number} ${singular}`;
  }
};

export const calculateAge = (dateString: string): number => {
  const birthdate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
};

export const formatDate = (date: Date, withTime?: boolean) => {
  return withTime ? format(date, "Pp") : format(date, "PP");
};

export const customDateFormat = (date: Date, withTime?: boolean) => {
  return withTime
    ? format(date, "MMMM d, yyyy p")
    : format(date, "MMMM d, yyyy");
};

export const getShortBankName = (name: string) => {
  const match = name.match(/\(([^)]+)\)/);
  const result = match ? match[1] : name;
  return result;
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

import imageCompression from "browser-image-compression";

/**
 * Compresses and converts an image file to WebP format.
 * @param file Original image file (jpeg, png, etc.)
 * @returns A Promise<File> of the compressed WebP image
 */
export async function compressImageToWebP(file: File): Promise<File | null> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 720,
    useWebWorker: true,
    fileType: "image/webp", // ⬅️ Output as WebP,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    return null;
  }
}

export const formatTimeTo12Hour = (time24: string) => {
  const [hours, minutes] = time24.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", // Include minutes
    hour12: true,
  }); // remove space between number and AM/PM
};

export function hhmmssToSeconds(time: string): number {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

export const normalizeTeamName = (teamName: string) => {
  return teamName?.toLowerCase().replace(/\s+/g, " ").replace(/\./g, "").trim();
};

export const getDistanceInKm = (
  coord1: [number, number],
  coord2: [number, number]
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);

  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
