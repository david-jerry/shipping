export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
      <p className="mb-12 text-muted-foreground">Last updated: July 13, 2026</p>

      <div className="prose prose-invert max-w-none">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          These Terms of Service ("Terms") govern your access to and use of the
          Lyftberan platform, websites, APIs, and logistics services
          ("Services"). By using our Services, you agree to be bound by these
          Terms.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">1. Acceptance of Terms</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          By accessing or using Lyftberan's Services, you confirm that you are
          at least 18 years old and have the legal capacity to enter into these
          Terms. If you are using the Services on behalf of an organization, you
          represent that you have authority to bind that organization.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          2. Account Registration
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          To access certain features, you must create an account. You agree to:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Provide accurate, current, and complete information.</li>
          <li>Maintain the security of your account credentials.</li>
          <li>Promptly notify us of any unauthorized access.</li>
          <li>Accept responsibility for all activities under your account.</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          3. Prohibited Items and Uses
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          You may not use our Services to ship:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Illegal goods, narcotics, or controlled substances.</li>
          <li>
            Weapons, explosives, or hazardous materials without proper
            declaration.
          </li>
          <li>
            Counterfeit goods or items infringing intellectual property rights.
          </li>
          <li>
            Live animals (except as permitted under specialized service
            agreements).
          </li>
          <li>
            Currency, precious metals, or negotiable instruments exceeding
            declared limits.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          4. Shipping and Delivery
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Lyftberan acts as a logistics platform connecting shippers with
          carriers. We commit to:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Exercising reasonable care in handling shipments.</li>
          <li>
            Providing accurate tracking information to the best of our technical
            ability.
          </li>
          <li>
            Adhering to published transit time estimates, subject to factors
            outside our control.
          </li>
        </ul>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Delivery times are estimates and not guaranteed unless explicitly
          agreed under a separate Service Level Agreement (SLA). We are not
          liable for delays caused by customs, weather, strikes, or force
          majeure events.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">5. Fees and Payment</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          You agree to pay all fees associated with your shipments as quoted at
          the time of booking. Fees are based on weight, dimensions,
          destination, service level, and applicable surcharges. All charges are
          non-refundable except as specified in our{" "}
          <a href="/legal/refunds" className="text-primary hover:underline">
            Refund Policy
          </a>
          .
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          6. Limitation of Liability
        </h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Lyftberan's liability for lost or damaged shipments is limited to the
          lesser of: (a) the declared value of the shipment, (b) the actual
          repair or replacement cost, or (c) $100 per shipment for standard
          services. Enhanced liability coverage is available for purchase. We
          are not liable for indirect, consequential, or punitive damages.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">7. Termination</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          We may suspend or terminate your access to the Services for violations
          of these Terms, fraudulent activity, or non-payment. You may cancel
          your account at any time subject to outstanding obligations.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">8. Governing Law</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          These Terms are governed by the laws of the State of California, USA,
          without regard to conflict of law principles. Disputes shall be
          resolved through binding arbitration in San Francisco, CA.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">9. Changes to Terms</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          We may modify these Terms at any time. Material changes will be
          notified 30 days in advance. Continued use constitutes acceptance of
          revised Terms.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">10. Contact</h2>
        <p className="leading-relaxed text-muted-foreground">
          For legal inquiries, contact legal@lyftberan.com.
        </p>
      </div>
    </div>
  )
}
