import { checkUsage } from "@/hooks/useUsageCheck";

/**
 * Guard wrapper for tools
 * - Guest: 10/day → alert + auth modal
 * - Free: 50/day → alert (upgrade)
 * - Pro: unlimited
 */
export async function runToolWithGuard(
  runTool: () => void,
  openAuthModal: () => void
) {
  const result = await checkUsage();

  if (result === true) {
    runTool();
    return;
  }

  // 🟢 Guest limit hit → alert + login modal
  if (result === "LOGIN_REQUIRED") {
    alert("You’ve reached the free guest limit. Please login to continue.");
    openAuthModal();
    return;
  }

  // 🟡 Free limit hit → alert only
  if (result === "FREE_LIMIT_REACHED") {
    alert("Daily free limit reached. Upgrade to Pro for unlimited access.");
    return;
  }
}
