export function requestToolEmailTemplate({
  tool,
  desc,
}: {
  tool: string;
  desc?: string;
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
                  🛠️ New Tool Request
                </h2>

                <p style="color:#a1a1aa;font-size:14px;">
                  <strong>Tool name:</strong> ${tool}
                </p>

                ${
                  desc
                    ? `<p style="color:#e5e7eb;font-size:14px;line-height:1.6;">
                        ${desc.replace(/\n/g, "<br />")}
                      </p>`
                    : `<p style="color:#71717a;font-size:13px;">
                        No description provided.
                      </p>`
                }
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
