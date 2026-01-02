export function welcomeEmailTemplate(name: string) {
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

            <!-- LOGO -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <img
                  src="https://localtools.app/logo.png"
                  alt="LocalTools"
                  height="36"
                />
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <h2 style="margin:0;color:#ffffff;font-size:22px;">
                  Welcome, ${name} 👋
                </h2>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <p style="margin:0;color:#a1a1aa;font-size:14px;line-height:1.6;">
                  We’re excited to have you onboard.<br /><br />
                  <strong style="color:#ffffff;">LocalTools</strong> lets you use powerful tools
                  directly in your browser — no installs, no tracking.
                </p>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <a
                  href="https://localtools.app"
                  style="
                    background:#19bdaf;
                    color:#ffffff;
                    text-decoration:none;
                    padding:12px 20px;
                    border-radius:8px;
                    font-size:14px;
                    font-weight:600;
                    display:inline-block;
                  "
                >
                  Start using LocalTools
                </a>
              </td>
            </tr>
           <tr>
  <td align="center" style="padding-top:8px;">
    <p style="margin:0;color:#a1a1aa;font-size:11px;line-height:1.6;">
      If you didn’t sign up for LocalTools, you can safely ignore this email.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr>
        <td style="padding:0 8px;">
          <a
            href="mailto:support@localtools.app"
            style="text-decoration:none;"
            aria-label="Email"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
              width="18"
              height="18"
              alt="Email"
              style="display:block;opacity:0.6;"
            />
          </a>
        </td>
        <td style="padding:0 8px;">
          <a
            href="https://x.com/localtoolsapp"
            target="_blank"
            style="text-decoration:none;"
            aria-label="Twitter X"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968958.png"
              width="18"
              height="18"
              alt="Twitter X"
              style="display:block;opacity:0.6;"
            />
          </a>
        </td>
      </tr>
    </table>

    <p style="margin-top:12px;color:#52525b;font-size:11px;">
      ~ Team LocalTools
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
