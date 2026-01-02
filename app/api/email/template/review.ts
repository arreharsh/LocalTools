export function reviewEmailTemplate({
  name,
  role,
  text,
  rating,
}: {
  name?: string;
  role?: string;
  text: string;
  rating: number;
}) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0c;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="max-width:520px;background:#111214;border-radius:12px;padding:32px;"
          >

            <tr>
              <td>
                <h2 style="margin:0 0 12px;color:#ffffff;">
                  ⭐ New Review Received
                </h2>

                <p style="color:#a1a1aa;font-size:13px;margin:0 0 8px;">
                  <strong>Name:</strong> ${name || "Anonymous"}
                </p>

                ${
                  role
                    ? `<p style="color:#a1a1aa;font-size:13px;margin:0 0 8px;">
                        <strong>Role / Company:</strong> ${role}
                      </p>`
                    : ""
                }

                <!-- ⭐ RATING -->
                <p style="color:#facc15;font-size:14px;margin:8px 0;">
                  <strong>Rating:</strong>
                  ${"⭐".repeat(rating)}${"☆".repeat(5 - rating)}
                </p>

                <hr style="border:none;border-top:1px solid #27272a;margin:16px 0;" />

                <p style="color:#e5e7eb;font-size:14px;line-height:1.6;">
                  ${text.replace(/\n/g, "<br />")}
                </p>

              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
