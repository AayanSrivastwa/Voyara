import React, { useEffect, useState } from "react";

const BACKGROUND_MAP = {
  storm: "/backgrounds/storm.jpg",
  thunderstorm: "/backgrounds/storm.jpg",
  sunny: "/backgrounds/sunny.jpg",
  clear: "/backgrounds/sunny.jpg",
  cloudy: "/backgrounds/cloudy.jpg",
  clouds: "/backgrounds/cloudy.jpg",
  snow: "/backgrounds/snow.jpg",
  rain: "/backgrounds/rain.jpg",
  drizzle: "/backgrounds/rain.jpg",
  fog: "/backgrounds/fog.jpg",
  mist: "/backgrounds/fog.jpg",
  haze: "/backgrounds/fog.jpg",
  smoke: "/backgrounds/fog.jpg",
  night: "/backgrounds/night.jpg",
};

export const normalizeWeatherCondition = (condition = "storm", isNight = false) => {
  if (!condition) return isNight ? "night" : "storm";
  const lower = condition.toLowerCase();
  if (lower.includes("thunder") || lower.includes("storm") || lower.includes("squall") || lower.includes("tornado")) {
    return "storm";
  }
  if (lower.includes("snow") || lower.includes("blizzard") || lower.includes("sleet")) {
    return "snow";
  }
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("shower")) {
    return "rain";
  }
  if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze") || lower.includes("smoke") || lower.includes("dust")) {
    return "fog";
  }
  if (lower.includes("cloud") || lower.includes("overcast")) {
    return "cloudy";
  }
  if (lower.includes("clear") || lower.includes("sun")) {
    return isNight ? "night" : "sunny";
  }
  return isNight ? "night" : (BACKGROUND_MAP[lower] ? lower : "storm");
};

export default function Background({ weather = "storm", isNight = false }) {
  const normalizedKey = normalizeWeatherCondition(weather, isNight);
  const targetImage = BACKGROUND_MAP[normalizedKey] || BACKGROUND_MAP.storm;

  const [activeImage, setActiveImage] = useState(targetImage);
  const [prevImage, setPrevImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (targetImage !== activeImage) {
      // Preload the target image
      const img = new Image();
      img.src = targetImage;
      img.onload = () => {
        setPrevImage(activeImage);
        setActiveImage(targetImage);
        setIsTransitioning(true);

        const timer = setTimeout(() => {
          setIsTransitioning(false);
          setPrevImage(null);
        }, 1000);
        return () => clearTimeout(timer);
      };
      img.onerror = () => {
        // Fallback remains on current image or default
      };
    }
  }, [targetImage, activeImage]);

  return (
    <div className="background" aria-hidden="true">
      {prevImage && (
        <div
          className="background-image prev"
          style={{ backgroundImage: `url("${prevImage}")` }}
        />
      )}
      <div
        className={`background-image current ${isTransitioning ? "fade-in" : ""}`}
        style={{ backgroundImage: `url("${activeImage}")` }}
      />
      <div className="background-overlay" />
    </div>
  );
}
