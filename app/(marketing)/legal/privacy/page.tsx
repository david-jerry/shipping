import type { Metadata } from "next"
import { buildMarketingMetadata } from "@/lib/seo"

/* eslint-disable react/no-unescaped-entities */
export const metadata: Metadata = buildMarketingMetadata({
  title: "Privacy Policy | Lyftberan",
  description:
    "Read how Lyftberan collects, uses, shares, and protects personal and shipment-related information.",
  path: "/legal/privacy",
})

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-12 text-muted-foreground">Last updated: July 13, 2026</p>

      <div className="prose prose-invert max-w-none">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Lyftberan Logistics Inc. ("Lyftberan," "we," "us," or "our") is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use
          our platform, services, and websites.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          1. Information We Collect
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong>Account Information:</strong> Name, email address, phone
            number, company name, and billing details when you register for an
            account.
          </li>
          <li>
            <strong>Shipment Information:</strong> Origin and destination
            addresses, package contents descriptions, customs documentation, and
            recipient contact details.
          </li>
          <li>
            <strong>Payment Information:</strong> Credit card details and
            banking information processed securely through PCI-DSS compliant
            payment processors.
          </li>
          <li>
            <strong>Communications:</strong> Records of your interactions with
            our support team and any feedback you provide.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          2. Automatically Collected Information
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          When you access our platform, we automatically collect:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong>Log Data:</strong> IP address, browser type, operating
            system, pages visited, and timestamps.
          </li>
          <li>
            <strong>Device Information:</strong> Hardware model, unique device
            identifiers, and mobile network information.
          </li>
          <li>
            <strong>Location Data:</strong> With your consent, precise
            geolocation data for delivery optimization and tracking features.
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> See our{" "}
            <a href="/legal/cookies" className="text-primary hover:underline">
              Cookie Policy
            </a>{" "}
            for details.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          3. How We Use Your Information
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          We use the collected information to:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Process and manage shipments, including customs clearance and
            delivery coordination.
          </li>
          <li>Provide real-time tracking and status notifications.</li>
          <li>
            Optimize routing and logistics operations using AI-driven analytics.
          </li>
          <li>Process payments and maintain financial records.</li>
          <li>
            Communicate with you about your shipments, account, and service
            updates.
          </li>
          <li>
            Improve our platform, develop new features, and conduct data
            analysis.
          </li>
          <li>Comply with legal obligations and enforce our terms.</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          4. Data Sharing and Disclosure
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          We may share your information with:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong>Logistics Partners:</strong> Carriers, freight forwarders,
            customs brokers, and last-mile delivery providers necessary to
            fulfill your shipment.
          </li>
          <li>
            <strong>Service Providers:</strong> Cloud hosting, payment
            processing, analytics, and customer support vendors bound by
            confidentiality agreements.
          </li>
          <li>
            <strong>Legal Authorities:</strong> When required by law, court
            order, or to protect our rights and safety.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with mergers,
            acquisitions, or asset sales.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">5. Data Security</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          We implement industry-standard security measures including AES-256
          encryption, TLS 1.3 for data in transit, SOC 2 Type II certified data
          centers, and regular penetration testing. Access to personal data is
          restricted to authorized personnel with multi-factor authentication.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">6. Your Rights</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Depending on your jurisdiction, you may have the right to:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Access, correct, or delete your personal information.</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Data portability and withdrawal of consent.</li>
          <li>Lodge a complaint with a supervisory authority.</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">7. Contact Us</h2>
        <p className="leading-relaxed text-muted-foreground">
          For privacy-related inquiries, contact our Data Protection Officer at
          privacy@lyftberan.com or 350 Mission Street, Suite 200, San Francisco,
          CA 94105.
        </p>
      </div>
    </div>
  )
}
