// Simple utility to merge class names without external dependencies if they are broken
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
