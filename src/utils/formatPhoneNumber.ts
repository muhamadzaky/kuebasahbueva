export function formatPhoneNumber(
  phone: string | undefined,
  purified = false,
): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;

  if (!normalized.startsWith("62")) {
    return purified ? digits : phone;
  }

  if (purified) {
    return normalized;
  }

  const countryCode = normalized.slice(0, 2);
  const rest = normalized.slice(2);

  const part1 = rest.slice(0, 3);
  const part2 = rest.slice(3, 7);
  const part3 = rest.slice(7);

  return `+${countryCode} ${part1}-${part2}${part3 ? `-${part3}` : ""}`;
}
