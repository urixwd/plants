"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CareEventsSDK, PhotosSDK } from "@/lib/sdk";
import type { PlantInstanceWithPlant } from "@/lib/sdk";

interface PlantCardProps {
  plantInstance: PlantInstanceWithPlant;
  onQuickWater?: (plantInstanceId: string) => void;
  onViewDetails?: (plantInstanceId: string) => void;
}

export function PlantCard({
  plantInstance,
  onQuickWater,
  onViewDetails,
}: PlantCardProps) {
  const router = useRouter();
  const [isWatering, setIsWatering] = useState(false);
  const [lastWatering, setLastWatering] = useState<Date | null>(null);

  // Get health status color
  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "struggling":
        return "warning";
      case "sick":
        return "destructive";
      case "dead":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Handle quick water action
  const handleQuickWater = async () => {
    if (isWatering) return;

    setIsWatering(true);
    try {
      await CareEventsSDK.log(plantInstance.id, {
        type: "water",
        notes: "Quick water from plant card",
      });

      // Update last watering date
      setLastWatering(new Date());

      // Call parent callback if provided
      onQuickWater?.(plantInstance.id);
    } catch (error) {
      console.error("Failed to log watering:", error);
    } finally {
      setIsWatering(false);
    }
  };

  // Handle photo capture
  const handleTakePhoto = () => {
    // Navigate to photos page
    router.push(`/plants/${plantInstance.id}/photos`);
  };

  // Format location for display
  const formatLocation = (location: string) => {
    return location
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get plant emoji based on type or use default
  const getPlantEmoji = () => {
    const name = plantInstance.plant.englishName?.toLowerCase() || "";
    if (name.includes("monstera")) return "🌿";
    if (name.includes("snake")) return "🐍";
    if (name.includes("fiddle")) return "🎻";
    if (name.includes("rubber")) return "🌳";
    return "🪴";
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getPlantEmoji()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg leading-tight">
                {plantInstance.nickname ||
                  plantInstance.plant.englishName ||
                  "Unknown Plant"}
              </CardTitle>
              <p className="text-sm text-earth-600">
                {plantInstance.plant.scientificName}
              </p>
            </div>
          </div>
          <Badge
            variant={getHealthColor(plantInstance.healthStatus || "healthy")}
          >
            {plantInstance.healthStatus || "healthy"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-earth-600">Location:</span>
          <span className="font-medium">
            {formatLocation(plantInstance.location)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-earth-600">Pot size:</span>
          <Badge variant="outline">{plantInstance.potSize.toUpperCase()}</Badge>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-earth-600">Sun:</span>
          <span className="font-medium">
            {plantInstance.sunType} ({plantInstance.sunStrength}/5)
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-earth-600">Last watered:</span>
          <span className="font-medium text-primary-600">
            {lastWatering ? "Just now" : "Loading..."}
          </span>
        </div>

        {plantInstance.notes && (
          <div className="text-sm text-earth-700 bg-earth-50 p-2 rounded">
            {plantInstance.notes}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex space-x-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleQuickWater}
          disabled={isWatering}
          className="flex-1"
        >
          💧 {isWatering ? "Watering..." : "Water"}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleTakePhoto}>
          📷
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails?.(plantInstance.id)}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
