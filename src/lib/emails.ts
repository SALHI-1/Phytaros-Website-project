import nodemailer from "nodemailer";
import { Resend } from "resend";
import {
  SITE_CONFIG,
  formatPriceMad,
  type PreorderProduct,
} from "@/config/site";
import {
  escapeHtml,
  normalizeWhatsAppDigits,
  type InquiryInput,
  type PreorderInput,
} from "@/lib/validation";

export interface PricedPreorderItem {
  product: PreorderProduct;
  quantity: number;
  lineTotalMad: number;
}

export interface PreorderEmailPayload {
  orderId: string;
  items: PricedPreorderItem[];
  totalMad: number;
  customer: PreorderInput["customer"];
  estimatedDelivery: string;
}

export type EmailDeliveryMode = "resend" | "smtp" | "dry-run";

interface OutgoingEmail {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";

  // Supports both standard SMTP_* env vars and Mailtrap's Host/Port/Username/Password copy-paste format
  const smtpHost = (process.env.SMTP_HOST || process.env.Host || "").trim();
  const smtpPortRaw = (process.env.SMTP_PORT || process.env.Port || "2525").trim();
  const smtpPort = Number.parseInt(smtpPortRaw, 10) || 2525;
  const smtpUser = (process.env.SMTP_USER || process.env.Username || "").trim();
  const smtpPass = (process.env.SMTP_PASS || process.env.Password || "").trim();
  const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);

  const from =
    process.env.EMAIL_FROM?.trim() ||
    `${SITE_CONFIG.brand.name} <orders@phytaros.com>`;
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim() || SITE_CONFIG.contact.email;
  const forceDryRun = process.env.EMAIL_DRY_RUN === "true";

  return {
    resendApiKey,
    hasSmtp,
    smtp: {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      isMailtrap: smtpHost.toLowerCase().includes("mailtrap"),
    },
    from,
    adminEmail,
    forceDryRun,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dispatchEmails(
  messages: OutgoingEmail[],
  dryRunMeta: Record<string, unknown>
): Promise<{ mode: EmailDeliveryMode }> {
  const config = getEmailConfig();

  if (config.forceDryRun) {
    console.info("[Phytaros Email DRY RUN]", dryRunMeta);
    return { mode: "dry-run" };
  }

  // 1. Production priority: Resend HTTP API
  if (config.resendApiKey) {
    const resend = new Resend(config.resendApiKey);
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const result = await resend.emails.send({
        from: config.from,
        to: [msg.to],
        replyTo: msg.replyTo,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      if (result.error) {
        if (i === 0) {
          throw new Error(`Email send failed: ${result.error.message}`);
        }
        console.error(
          "[Phytaros] Secondary email failed (Resend):",
          result.error
        );
      }
    }
    return { mode: "resend" };
  }

  // 2. Local dev / staging: SMTP via Nodemailer (Mailtrap Sandbox, etc.)
  if (config.hasSmtp) {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      // Mailtrap Sandbox free tier throttles rapid consecutive emails
      if (i > 0 && config.smtp.isMailtrap) {
        await delay(3000);
      }

      let sent = false;
      let lastError: unknown;

      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          await transporter.sendMail({
            from: config.from,
            to: msg.to,
            replyTo: msg.replyTo,
            subject: msg.subject,
            html: msg.html,
            text: msg.text,
          });
          sent = true;
          break;
        } catch (err) {
          lastError = err;
          const errMsg = err instanceof Error ? err.message : String(err);
          const isRateLimit =
            errMsg.includes("550") ||
            errMsg.toLowerCase().includes("too many emails") ||
            errMsg.includes("421");

          if (isRateLimit && attempt < 4) {
            await delay(3500 * attempt);
            continue;
          }
          break;
        }
      }

      if (!sent) {
        if (i === 0) {
          throw lastError instanceof Error
            ? lastError
            : new Error("Failed to send admin notification email.");
        }
        console.error(
          "[Phytaros] Secondary email failed (SMTP) after retries:",
          lastError
        );
      }
    }
    return { mode: "smtp" };
  }

  // 3. No email provider configured
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Email service is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS."
    );
  }

  console.info("[Phytaros Email DRY RUN — no provider configured]", dryRunMeta);
  return { mode: "dry-run" };
}

function buildAdminWhatsAppLink(payload: PreorderEmailPayload): string {
  const digits = normalizeWhatsAppDigits(payload.customer.whatsappPhone);
  const summary = payload.items
    .map((item) => `${item.quantity}x ${item.product.name}`)
    .join(", ");
  const message =
    `Hello ${payload.customer.fullName}, thank you for your Phytaros pre-order (${payload.orderId}) for ${summary} ` +
    `(${formatPriceMad(payload.totalMad)}, delivery included, pay on delivery). ` +
    `We are reaching out to confirm your pre-order and delivery address in ${payload.customer.city}.`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function buildItemsTableHtml(
  items: PricedPreorderItem[],
  totalMad: number
): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #dbd9cc;color:#0f2018;font-size:15px;">
          <strong>${escapeHtml(item.product.name)}</strong><br/>
          <span style="color:#4b5c53;font-size:13px;">${item.product.blocks} blocks · ${item.product.plantSites} plant sites</span>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #dbd9cc;color:#4b5c53;font-size:14px;text-align:center;font-family:monospace;">
          &times;${item.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #dbd9cc;color:#0f2018;font-size:15px;font-weight:600;text-align:right;font-family:monospace;">
          ${escapeHtml(formatPriceMad(item.lineTotalMad))}
        </td>
      </tr>`
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
      ${rows}
      <tr>
        <td colspan="2" style="padding:12px 0 4px;color:#4b5c53;font-size:14px;">Delivery</td>
        <td style="padding:12px 0 4px;color:#1a7888;font-size:14px;font-weight:600;text-align:right;font-family:monospace;">INCLUDED</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:8px 0 0;color:#0f2018;font-size:16px;font-weight:700;">Total (Pay on delivery)</td>
        <td style="padding:8px 0 0;color:#0f2018;font-size:18px;font-weight:700;text-align:right;font-family:monospace;">
          ${escapeHtml(formatPriceMad(totalMad))}
        </td>
      </tr>
    </table>`;
}

function buildAdminPreorderHtml(payload: PreorderEmailPayload): string {
  const waLink = buildAdminWhatsAppLink(payload);
  const { customer } = payload;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f7f6f1;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f2018;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dbd9cc;border-radius:16px;overflow:hidden;">
    <div style="background:#0d281e;padding:24px 28px;color:#eef5e8;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;font-weight:600;color:#b6ec3d;">NEW PRE-ORDER RECEIVED</p>
      <h1 style="margin:0;font-size:24px;line-height:1.2;">Order ${escapeHtml(payload.orderId)}</h1>
    </div>
    <div style="padding:28px;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#4b5c53;">
        A customer has placed a new tower pre-order. Review the details below and confirm via WhatsApp.
      </p>

      <div style="background:#f7f6f1;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;font-weight:600;color:#35630a;">CUSTOMER DETAILS</p>
        <p style="margin:4px 0;font-size:15px;"><strong>Name:</strong> ${escapeHtml(customer.fullName)}</p>
        <p style="margin:4px 0;font-size:15px;"><strong>WhatsApp:</strong> ${escapeHtml(customer.whatsappPhone)}</p>
        <p style="margin:4px 0;font-size:15px;"><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
        <p style="margin:4px 0;font-size:15px;"><strong>City:</strong> ${escapeHtml(customer.city)}</p>
        <p style="margin:4px 0;font-size:15px;"><strong>Address:</strong> ${escapeHtml(customer.address)}</p>
        ${
          customer.notes
            ? `<p style="margin:8px 0 0;font-size:14px;color:#4b5c53;"><strong>Notes:</strong> ${escapeHtml(customer.notes)}</p>`
            : ""
        }
      </div>

      ${buildItemsTableHtml(payload.items, payload.totalMad)}

      <p style="margin:12px 0 24px;font-size:13px;color:#4b5c53;font-family:monospace;">
        PAYMENT: CASH ON DELIVERY · EST. DELIVERY: ${escapeHtml(payload.estimatedDelivery)}
      </p>

      <a href="${escapeHtml(waLink)}" style="display:inline-block;background:#b6ec3d;color:#0f2018;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:12px;">
        Confirm order on WhatsApp &rarr;
      </a>
    </div>
  </div>
</body>
</html>`;
}

function buildCustomerPreorderHtml(payload: PreorderEmailPayload): string {
  const { customer } = payload;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f7f6f1;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f2018;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dbd9cc;border-radius:16px;overflow:hidden;">
    <div style="background:#0d281e;padding:24px 28px;color:#eef5e8;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;font-weight:600;color:#b6ec3d;">PHYTAROS · PRE-ORDER CONFIRMED</p>
      <h1 style="margin:0;font-size:24px;line-height:1.2;">Thank you, ${escapeHtml(customer.fullName)}.</h1>
    </div>
    <div style="padding:28px;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#0f2018;">
        We have received your pre-order <strong>${escapeHtml(payload.orderId)}</strong>.
      </p>

      <div style="background:#dfedd0;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;font-weight:700;color:#35630a;">NEXT STEP · WHATSAPP CONFIRMATION</p>
        <p style="margin:0;font-size:15px;line-height:1.5;color:#0f2018;">
          ${escapeHtml(SITE_CONFIG.preorder.whatsappFollowUp)}
        </p>
      </div>

      ${buildItemsTableHtml(payload.items, payload.totalMad)}

      <div style="background:#f7f6f1;border-radius:12px;padding:16px 20px;margin-top:20px;font-size:14px;color:#4b5c53;line-height:1.6;">
        <p style="margin:0;"><strong>Payment:</strong> ${escapeHtml(SITE_CONFIG.preorder.paymentLabel)}</p>
        <p style="margin:4px 0 0;"><strong>Delivery:</strong> ${escapeHtml(SITE_CONFIG.preorder.deliveryLabel)}</p>
        <p style="margin:4px 0 0;"><strong>Estimated delivery:</strong> ${escapeHtml(payload.estimatedDelivery)}</p>
        <p style="margin:4px 0 0;"><strong>Shipping to:</strong> ${escapeHtml(customer.address)}, ${escapeHtml(customer.city)}</p>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#4b5c53;">
        Phytaros — Modular hydroponic towers. Grown in Morocco.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendPreorderEmails(
  payload: PreorderEmailPayload
): Promise<{ mode: EmailDeliveryMode }> {
  const { adminEmail } = getEmailConfig();
  const waLink = buildAdminWhatsAppLink(payload);
  const itemsText = payload.items
    .map(
      (i) =>
        `- ${i.quantity}x ${i.product.name} (${formatPriceMad(i.lineTotalMad)})`
    )
    .join("\n");

  const adminMsg: OutgoingEmail = {
    to: adminEmail,
    replyTo: payload.customer.email,
    subject: `[Phytaros Pre-Order] ${payload.orderId} — ${payload.customer.fullName} (${formatPriceMad(payload.totalMad)})`,
    html: buildAdminPreorderHtml(payload),
    text: `New Phytaros pre-order ${payload.orderId}\n\nCustomer: ${payload.customer.fullName}\nWhatsApp: ${payload.customer.whatsappPhone}\nEmail: ${payload.customer.email}\nCity: ${payload.customer.city}\nAddress: ${payload.customer.address}\n\nItems:\n${itemsText}\n\nTotal (Delivery included, COD): ${formatPriceMad(payload.totalMad)}\nConfirm on WhatsApp: ${waLink}`,
  };

  const customerMsg: OutgoingEmail = {
    to: payload.customer.email,
    replyTo: adminEmail,
    subject: `Phytaros Pre-Order Received (${payload.orderId})`,
    html: buildCustomerPreorderHtml(payload),
    text: `Thank you, ${payload.customer.fullName}!\n\nWe received your pre-order ${payload.orderId}.\n${SITE_CONFIG.preorder.whatsappFollowUp}\n\nItems:\n${itemsText}\n\nTotal (Delivery included, Pay on delivery): ${formatPriceMad(payload.totalMad)}\nEstimated delivery: ${payload.estimatedDelivery}`,
  };

  return dispatchEmails([adminMsg, customerMsg], {
    orderId: payload.orderId,
    adminEmail,
    customerEmail: payload.customer.email,
    totalMad: payload.totalMad,
    whatsappLinkForAdmin: waLink,
  });
}

const INQUIRY_LABELS: Record<InquiryInput["type"], string> = {
  "smartcap-waitlist": "SmartCap Waitlist",
  "farming-as-a-service": "Farming-as-a-Service",
  general: "General / Partnership Inquiry",
};

export async function sendInquiryEmail(
  inquiry: InquiryInput
): Promise<{ mode: EmailDeliveryMode }> {
  const { adminEmail } = getEmailConfig();
  const label = INQUIRY_LABELS[inquiry.type];
  const waDigits = inquiry.whatsappPhone
    ? normalizeWhatsAppDigits(inquiry.whatsappPhone)
    : "";

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f7f6f1;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f2018;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dbd9cc;border-radius:16px;overflow:hidden;">
    <div style="background:#0d281e;padding:24px 28px;color:#eef5e8;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;font-weight:600;color:#b6ec3d;">PHYTAROS · ${escapeHtml(label.toUpperCase())}</p>
      <h1 style="margin:0;font-size:22px;line-height:1.2;">New message from ${escapeHtml(inquiry.fullName)}</h1>
    </div>
    <div style="padding:28px;font-size:15px;line-height:1.6;">
      <p style="margin:4px 0;"><strong>Name:</strong> ${escapeHtml(inquiry.fullName)}</p>
      <p style="margin:4px 0;"><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
      ${inquiry.whatsappPhone ? `<p style="margin:4px 0;"><strong>WhatsApp:</strong> ${escapeHtml(inquiry.whatsappPhone)}</p>` : ""}
      ${inquiry.organization ? `<p style="margin:4px 0;"><strong>Organization:</strong> ${escapeHtml(inquiry.organization)}</p>` : ""}
      ${inquiry.type === "smartcap-waitlist" ? `<p style="margin:4px 0;"><strong>Current tower:</strong> ${escapeHtml(inquiry.ownsTower)}</p>` : ""}
      ${inquiry.message ? `<div style="margin-top:16px;padding:16px;background:#f7f6f1;border-radius:12px;"><strong>Message:</strong><br/>${escapeHtml(inquiry.message).replace(/\n/g, "<br/>")}</div>` : ""}
      ${
        waDigits
          ? `<p style="margin-top:24px;"><a href="https://wa.me/${escapeHtml(waDigits)}" style="display:inline-block;background:#b6ec3d;color:#0f2018;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:12px;">Reply on WhatsApp &rarr;</a></p>`
          : ""
      }
    </div>
  </div>
</body>
</html>`;

  const msg: OutgoingEmail = {
    to: adminEmail,
    replyTo: inquiry.email,
    subject: `[Phytaros ${label}] ${inquiry.fullName}`,
    html,
    text: `Phytaros ${label}\nName: ${inquiry.fullName}\nEmail: ${inquiry.email}\nWhatsApp: ${inquiry.whatsappPhone || "-"}\nMessage: ${inquiry.message || "-"}`,
  };

  return dispatchEmails([msg], {
    type: label,
    adminEmail,
    fromCustomer: inquiry.email,
    name: inquiry.fullName,
  });
}
