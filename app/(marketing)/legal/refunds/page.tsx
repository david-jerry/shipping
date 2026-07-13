export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Refund Policy</h1>
      <p className="mb-12 text-muted-foreground">Last updated: July 13, 2026</p>

      <div className="prose prose-invert max-w-none">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          At Lyftberan, we stand behind the quality of our logistics services.
          This Refund Policy outlines the circumstances under which you may be
          eligible for a refund, credit, or service adjustment.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          1. Eligibility for Refunds
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          You may be eligible for a refund in the following situations:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong>Service Failure:</strong> Shipment was not delivered within
            the guaranteed transit time specified in your service agreement or
            SLA.
          </li>
          <li>
            <strong>Lost Shipment:</strong> Package is confirmed lost by our
            carrier partners and cannot be located after 30 days of
            investigation.
          </li>
          <li>
            <strong>Damaged Goods:</strong> Items arrived damaged due to
            handling negligence, subject to inspection and documentation.
          </li>
          <li>
            <strong>Incorrect Charges:</strong> Billing errors, duplicate
            charges, or weight/dimension disputes resolved in your favor.
          </li>
          <li>
            <strong>Service Cancellation:</strong> Pre-paid shipments cancelled
            before pickup is attempted.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          2. Non-Refundable Circumstances
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Refunds will not be issued for:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Delays caused by customs inspections, weather events, strikes, or
            force majeure.
          </li>
          <li>
            Shipments delayed due to incorrect or incomplete address information
            provided by the shipper.
          </li>
          <li>
            Perishable goods that deteriorated due to improper packaging by the
            shipper.
          </li>
          <li>
            Prohibited items shipped in violation of our Terms of Service.
          </li>
          <li>
            Cosmetic packaging damage where the contents remain intact and
            functional.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">3. Refund Process</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          To request a refund:
        </p>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-muted-foreground">
          <li>Submit a claim within 30 days of the scheduled delivery date.</li>
          <li>
            Provide your tracking number, proof of value (invoice or receipt),
            and photos of damage if applicable.
          </li>
          <li>
            Our claims team will investigate and respond within 5 business days.
          </li>
          <li>
            Approved refunds are processed to the original payment method within
            10 business days.
          </li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-bold">4. Refund Amounts</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Refund amounts are calculated as follows:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong>Standard Shipments:</strong> Full refund of shipping costs
            plus declared value up to $100 unless enhanced coverage was
            purchased.
          </li>
          <li>
            <strong>Express Services:</strong> Full refund of shipping costs if
            delivery commitment is missed by more than 24 hours.
          </li>
          <li>
            <strong>Freight Services:</strong> Pro-rated refund based on the
            degree of service failure, subject to the terms of your freight
            contract.
          </li>
          <li>
            <strong>Enhanced Coverage:</strong> Full declared value up to the
            coverage limit purchased at booking.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          5. Credits and Alternatives
        </h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          At our discretion, we may offer account credits equivalent to 110% of
          the refund value as an alternative to cash refunds. Credits expire 12
          months from issuance.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">6. Dispute Resolution</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          If you disagree with our refund determination, you may escalate to our
          Customer Resolution Team within 14 days. Unresolved disputes shall be
          subject to the arbitration provisions in our Terms of Service.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">7. Contact</h2>
        <p className="leading-relaxed text-muted-foreground">
          Submit refund claims through your account portal or email
          claims@lyftberan.com.
        </p>
      </div>
    </div>
  )
}
