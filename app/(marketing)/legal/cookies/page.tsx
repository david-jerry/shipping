export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Cookie Policy</h1>
      <p className="mb-12 text-muted-foreground">Last updated: July 13, 2026</p>

      <div className="prose prose-invert max-w-none">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          This Cookie Policy explains how Lyftberan Logistics Inc. uses cookies
          and similar tracking technologies when you visit our websites and use
          our platform.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">1. What Are Cookies?</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Cookies are small text files stored on your device when you visit a
          website. They allow the site to recognize your device and store
          information about your preferences or past actions. We also use
          similar technologies such as pixel tags, local storage, and device
          fingerprinting.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          2. Types of Cookies We Use
        </h2>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Essential Cookies</h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          These cookies are necessary for the platform to function. They enable
          core features such as secure login, session management, and fraud
          prevention. You cannot opt out of these cookies.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Functional Cookies</h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          These cookies remember your preferences, such as language selection,
          theme settings (dark/light mode), and dashboard customization. They
          enhance your user experience but are not essential.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Analytics Cookies</h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          We use analytics cookies to understand how visitors interact with our
          platform. This helps us improve functionality, identify errors, and
          optimize performance. We primarily use:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Google Analytics for aggregate traffic analysis.</li>
          <li>Mixpanel for feature usage tracking.</li>
          <li>Sentry for error monitoring and debugging.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Marketing Cookies</h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          These cookies track your browsing habits to deliver relevant
          advertisements and measure campaign effectiveness. They may be set by
          us or our advertising partners.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">3. Third-Party Cookies</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Some cookies are placed by third-party services integrated into our
          platform, including payment processors (Stripe), cloud providers
          (AWS), and analytics vendors. These parties have their own privacy and
          cookie policies.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          4. Managing Your Preferences
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          You can manage cookie preferences through:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Our cookie consent banner displayed on first visit.</li>
          <li>Your browser settings to block or delete cookies.</li>
          <li>
            Industry opt-out tools such as the Network Advertising Initiative.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">5. Data Retention</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Cookies have varying lifespans. Session cookies expire when you close
          your browser. Persistent cookies remain for up to 24 months unless you
          delete them earlier. Analytics data is retained in aggregated form
          indefinitely.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">6. Contact</h2>
        <p className="leading-relaxed text-muted-foreground">
          For questions about this Cookie Policy, contact privacy@lyftberan.com.
        </p>
      </div>
    </div>
  )
}
