type NewsletterEmailContent = {
    recipientName?: string | null
    subject: string
    messageHtml: string
    discountCode?: string | null
    ctaUrl?: string | null
}

function stripHtml(input: string) {
    return input
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

export function buildNewsletterEmailHtml(content: NewsletterEmailContent) {
    const greeting = content.recipientName ? `Hi ${content.recipientName},` : "Hello,"
    const discountBlock = content.discountCode
        ? `<div style=\"margin:20px 0;padding:14px 16px;border:1px dashed #0ea5e9;border-radius:10px;background:#f0f9ff;color:#0c4a6e;font-weight:700;\">Discount code: ${content.discountCode}</div>`
        : ""
    const ctaBlock = content.ctaUrl
        ? `<div style=\"margin-top:24px;\"><a href=\"${content.ctaUrl}\" style=\"display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;\">View Offer</a></div>`
        : ""

    return `
<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>${content.subject}</title>
  </head>
  <body style=\"margin:0;padding:0;background:#f8fafc;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;\">
    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding:24px 12px;\">
      <tr>
        <td align=\"center\">
          <table role=\"presentation\" width=\"640\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;\">
            <tr>
              <td style=\"padding:20px 24px;background:linear-gradient(120deg,#0ea5e9,#1d4ed8);color:#ffffff;\">
                <p style=\"margin:0 0 6px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.9;\">Lyftberan Logistics</p>
                <h1 style=\"margin:0;font-size:24px;line-height:1.25;\">${content.subject}</h1>
              </td>
            </tr>
            <tr>
              <td style=\"padding:24px;\">
                <p style=\"margin:0 0 14px 0;font-size:16px;line-height:1.6;\">${greeting}</p>
                <div style=\"font-size:15px;line-height:1.7;color:#1e293b;\">${content.messageHtml}</div>
                ${discountBlock}
                ${ctaBlock}
              </td>
            </tr>
            <tr>
              <td style=\"padding:16px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;\">
                You are receiving this email because you are subscribed to Lyftberan newsletter updates.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim()
}

export function buildNewsletterEmailText(content: NewsletterEmailContent) {
    return [
        content.recipientName ? `Hi ${content.recipientName},` : "Hello,",
        stripHtml(content.messageHtml),
        content.discountCode ? `Discount code: ${content.discountCode}` : "",
        content.ctaUrl ? `View offer: ${content.ctaUrl}` : "",
    ]
        .filter(Boolean)
        .join("\n\n")
}
