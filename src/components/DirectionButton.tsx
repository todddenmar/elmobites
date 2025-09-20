import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

type DirectionButtonProps = {
  latitude: number;
  longitude: number;
  label?: string;
};

export function DirectionButton({
  latitude,
  longitude,
  label,
}: DirectionButtonProps) {
  const handleClick = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Button onClick={handleClick} className="flex items-center gap-2 w-full">
      <MapPin className="w-4 h-4" />
      {label ?? "Get Directions"}
    </Button>
  );
}
