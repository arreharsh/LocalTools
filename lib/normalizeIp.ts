export function normalizeIp(ip: string | null | undefined) {
  if (!ip) return null;

  // localhost ipv6
  if (ip === "::1") return "127.0.0.1";

  // ipv4-mapped ipv6
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
}
