/**
 * Formats a date string or object into a human-readable format.
 * Example: Sat, 2 May 2026
 */
export const formatEventDate = (date: string | Date): string => {
  if (!date) return "TBA";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);

  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Formats a date string or object into a human-readable date + time.
 * Example: 12 May 2026, 8:35 pm
 */
export const formatEventDateTime = (date: string | Date): string => {
  if (!date) return "TBA";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Formats a date string or object into a readable time.
 * Example: 7:45 PM
 */
export const formatEventTime = (date: string | Date): string => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
