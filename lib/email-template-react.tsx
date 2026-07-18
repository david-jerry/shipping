import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { render } from "@react-email/render"
import type { CSSProperties } from "react"

import type { EmailTemplateKey } from "@/lib/email-templates"

type TemplateValues = Record<string, string>

type RenderedEmailTemplate = {
  subject: string
  htmlBody: string
  textBody: string
}

type MarketingEmailInput = {
  subject: string
  recipientName?: string | null
  messageText?: string
  messageHtml?: string
  discountCode?: string | null
  ctaUrl?: string | null
}

function EmailShell({
  preview,
  heading,
  intro,
  ctaLabel,
  ctaUrl,
  outro,
}: {
  preview: string
  heading: string
  intro: string
  ctaLabel: string
  ctaUrl: string
  outro: string
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{heading}</Heading>
          <Text style={styles.text}>{intro}</Text>
          <Section style={styles.ctaSection}>
            <Button href={ctaUrl} style={styles.button}>
              {ctaLabel}
            </Button>
          </Section>
          <Text style={styles.text}>{outro}</Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Lyftberan • Logistics and Delivery Updates
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

function getCopy(key: EmailTemplateKey, values: TemplateValues) {
  const name = values.name?.trim() || "there"
  const url = values.url?.trim() || "#"

  if (key === "register_verification") {
    return {
      subject: "Verify your Lyftberan account",
      preview: "Confirm your email address to activate your account",
      heading: "Welcome to Lyftberan",
      intro: `Hi ${name}, please verify your email address to activate your account.`,
      ctaLabel: "Verify Email",
      ctaUrl: url,
      outro:
        "If you did not create this account, you can safely ignore this email.",
    }
  }

  return {
    subject: "Reset your Lyftberan password",
    preview: "Use this secure link to reset your password",
    heading: "Password Reset Request",
    intro: `Hi ${name}, we received a request to reset your password.`,
    ctaLabel: "Reset Password",
    ctaUrl: url,
    outro: "If this was not you, you can ignore this email.",
  }
}

function MarketingShell({
  preview,
  heading,
  greeting,
  messageText,
  messageHtml,
  discountCode,
  ctaUrl,
}: {
  preview: string
  heading: string
  greeting: string
  messageText?: string
  messageHtml?: string
  discountCode?: string
  ctaUrl?: string
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{heading}</Heading>
          <Text style={styles.text}>{greeting}</Text>
          {messageHtml ? (
            <Section
              style={styles.messageCard}
              dangerouslySetInnerHTML={{ __html: messageHtml }}
            />
          ) : null}
          {messageText ? <Text style={styles.text}>{messageText}</Text> : null}
          {discountCode ? (
            <Section style={styles.discountCard}>
              <Text style={styles.discountLabel}>Discount code</Text>
              <Text style={styles.discountCode}>{discountCode}</Text>
            </Section>
          ) : null}
          {ctaUrl ? (
            <Section style={styles.ctaSection}>
              <Button href={ctaUrl} style={styles.button}>
                Claim Your Offer
              </Button>
            </Section>
          ) : null}
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Lyftberan • Logistics and Delivery Updates
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export async function renderDefaultEmailTemplate(
  key: EmailTemplateKey,
  values: TemplateValues
): Promise<RenderedEmailTemplate> {
  const copy = getCopy(key, values)

  const component = (
    <EmailShell
      preview={copy.preview}
      heading={copy.heading}
      intro={copy.intro}
      ctaLabel={copy.ctaLabel}
      ctaUrl={copy.ctaUrl}
      outro={copy.outro}
    />
  )

  const htmlBody = await render(component)
  const textBody = await render(component, { plainText: true })

  return {
    subject: copy.subject,
    htmlBody,
    textBody,
  }
}

export async function renderMarketingEmailTemplate(
  input: MarketingEmailInput
): Promise<RenderedEmailTemplate> {
  const normalizedSubject = input.subject.trim()
  const name = input.recipientName?.trim()
  const greeting = name ? `Hi ${name},` : "Hello,"
  const messageText = input.messageText?.trim() || undefined
  const messageHtml = input.messageHtml?.trim() || undefined
  const discountCode = input.discountCode?.trim() || undefined
  const ctaUrl = input.ctaUrl?.trim() || undefined

  const component = (
    <MarketingShell
      preview={normalizedSubject}
      heading={normalizedSubject}
      greeting={greeting}
      messageText={messageText}
      messageHtml={messageHtml}
      discountCode={discountCode}
      ctaUrl={ctaUrl}
    />
  )

  const htmlBody = await render(component)
  const textBody = await render(component, { plainText: true })

  return {
    subject: normalizedSubject,
    htmlBody,
    textBody,
  }
}

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: "#f4f6fb",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "28px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    margin: "0 auto",
    maxWidth: "560px",
    padding: "28px",
  },
  heading: {
    color: "#111827",
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    lineHeight: "32px",
    margin: "0 0 12px",
  },
  text: {
    color: "#374151",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 14px",
  },
  ctaSection: {
    margin: "24px 0",
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: "10px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "14px",
    padding: "14px 20px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "24px 0 14px",
  },
  messageCard: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    color: "#374151",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 14px",
    padding: "14px",
  },
  discountCard: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    margin: "14px 0",
    padding: "12px 14px",
  },
  discountLabel: {
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "18px",
    margin: "0 0 4px",
    textTransform: "uppercase",
  },
  discountCode: {
    color: "#1e3a8a",
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    lineHeight: "24px",
    margin: 0,
  },
  footer: {
    color: "#9ca3af",
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
  },
}
