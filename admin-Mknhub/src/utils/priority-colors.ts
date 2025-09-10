/**
 * Utility functions for calculating colors based on priority levels
 * DISABLED: Priority-based colors have been removed
 */

export interface PriorityColorConfig {
  textColor: string;
  backgroundColor: string;
  borderColor?: string;
}

/**
 * Get color configuration based on priority level
 * Higher priority = darker/more intense colors
 * @param priority - Priority number (higher = more urgent)
 * @param baseColor - Base color in hex format (e.g., "#FF0000")
 * @returns Color configuration object
 */
// DISABLED: Priority-based colors removed
export function getPriorityColors(
  priority: number | null | undefined,
  baseColor: string = "#FF0000"
): PriorityColorConfig {
  if (!priority || priority <= 0) {
    return {
      textColor: "#666666",
      backgroundColor: "#F5F5F5",
      borderColor: "#E0E0E0",
    };
  }

  // Normalize priority to 0-1000 range for color calculation
  const normalizedPriority = Math.min(Math.max(priority, 0), 1000);
  const intensity = normalizedPriority / 1000;

  // Calculate color intensity
  const getIntensityColor = (hex: string, intensity: number) => {
    const hexValue = hex.replace("#", "");
    const r = parseInt(hexValue.substr(0, 2), 16);
    const g = parseInt(hexValue.substr(2, 2), 16);
    const b = parseInt(hexValue.substr(4, 2), 16);

    // Darken the color based on intensity
    const newR = Math.floor(r * (0.3 + intensity * 0.7));
    const newG = Math.floor(g * (0.3 + intensity * 0.7));
    const newB = Math.floor(b * (0.3 + intensity * 0.7));

    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  const textColor = getIntensityColor(baseColor, intensity);
  const backgroundColor = getIntensityColor(baseColor, intensity * 0.1);
  const borderColor = getIntensityColor(baseColor, intensity * 0.5);

  return {
    textColor,
    backgroundColor,
    borderColor,
  };
}

/**
 * Get predefined color schemes for different priority ranges
 */
// DISABLED: Priority-based colors removed
export function getPriorityColorScheme(
  priority: number | null | undefined
): PriorityColorConfig {
  if (!priority || priority <= 0) {
    return {
      textColor: "#666666",
      backgroundColor: "#F5F5F5",
      borderColor: "#E0E0E0",
    };
  }

  // Define color schemes based on priority ranges
  if (priority >= 900) {
    // Critical priority - Red
    return getPriorityColors(priority, "#DC2626");
  } else if (priority >= 700) {
    // High priority - Orange
    return getPriorityColors(priority, "#EA580C");
  } else if (priority >= 500) {
    // Medium priority - Yellow
    return getPriorityColors(priority, "#D97706");
  } else if (priority >= 300) {
    // Low priority - Blue
    return getPriorityColors(priority, "#2563EB");
  } else {
    // Very low priority - Green
    return getPriorityColors(priority, "#16A34A");
  }
}

/**
 * Get priority level description
 */
// DISABLED: Priority-based descriptions removed
export function getPriorityDescription(
  priority: number | null | undefined
): string {
  if (!priority || priority <= 0) {
    return "Không ưu tiên";
  }

  if (priority >= 900) {
    return "Cực kỳ khẩn cấp";
  } else if (priority >= 700) {
    return "Rất khẩn cấp";
  } else if (priority >= 500) {
    return "Khẩn cấp";
  } else if (priority >= 300) {
    return "Quan trọng";
  } else if (priority >= 100) {
    return "Bình thường";
  } else {
    return "Thấp";
  }
}
