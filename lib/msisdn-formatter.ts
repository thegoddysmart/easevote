/**
 * Formats a phone number string (e.g., "233244123456") 
 * into a human-readable international format: "+233 24 412 3456"
 * Supports masking for privacy: "+233 24 412 ●●●●"
 */
export function formatMSISDN(msisdn: string, mask: boolean = false): string {
  if (!msisdn) return "N/A";

  // Ensure it starts with 233 (Ghana prefix)
  let clean = msisdn.replace(/\D/g, "");
  if (clean.length === 10 && clean.startsWith("0")) {
    clean = "233" + clean.substring(1);
  } else if (clean.length === 9) {
    clean = "233" + clean;
  }

  // Formatting logic: +233 XX XXX XXXX
  const prefix = "+233";
  const line1 = clean.substring(3, 5); // 24
  const line2 = clean.substring(5, 8); // 412
  const line3 = clean.substring(8);    // 3456

  if (mask && line3.length >= 4) {
    return `${prefix} ${line1} ${line2} ●●●●`;
  }

  return `${prefix} ${line1} ${line2} ${line3}`;
}
