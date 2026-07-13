export default function NDAPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Non-Disclosure Agreement</h1>
      <p className="mb-12 text-muted-foreground">
        Effective Date: July 13, 2026
      </p>

      <div className="prose prose-invert max-w-none">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          This Mutual Non-Disclosure Agreement ("Agreement") is entered into
          between Lyftberan Logistics Inc. and the party accessing confidential
          information ("Recipient"). By using our enterprise services or
          accessing our partner portal, you agree to these terms.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          1. Definition of Confidential Information
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          "Confidential Information" means any and all non-public, proprietary,
          or confidential information disclosed by either party, whether in
          writing, orally, electronically, or by any other means, including:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Business plans, financial data, pricing structures, and strategic
            roadmaps.
          </li>
          <li>
            Customer lists, shipment data, and supply chain configurations.
          </li>
          <li>
            Software architecture, API documentation, algorithms, and technical
            specifications.
          </li>
          <li>
            Trade secrets, know-how, and research & development materials.
          </li>
          <li>
            Any information marked as "Confidential," "Proprietary," or with
            similar legend.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          2. Obligations of Recipient
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          The Recipient agrees to:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Maintain all Confidential Information in strict confidence using at
            least the same degree of care as for its own sensitive information,
            but no less than reasonable care.
          </li>
          <li>
            Not disclose Confidential Information to any third parties without
            prior written consent.
          </li>
          <li>
            Use Confidential Information solely for the purpose of evaluating,
            negotiating, or performing logistics services.
          </li>
          <li>
            Restrict access to Confidential Information to employees,
            contractors, and advisors with a need-to-know and who are bound by
            confidentiality obligations.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">3. Exclusions</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Confidential Information does not include information that:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Is or becomes publicly available through no breach of this
            Agreement.
          </li>
          <li>Was rightfully known to the Recipient prior to disclosure.</li>
          <li>
            Is rightfully received from a third party without restriction.
          </li>
          <li>
            Is independently developed without use of the disclosing party's
            Confidential Information.
          </li>
          <li>
            Is required to be disclosed by law, regulation, or court order,
            provided prompt notice is given.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-bold">4. Term</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          This Agreement remains in effect for five (5) years from the date of
          first disclosure. The obligations of confidentiality survive
          termination for a period of five (5) years.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">
          5. Return of Information
        </h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Upon termination or at the disclosing party's request, the Recipient
          shall promptly return or destroy all Confidential Information and
          certify such destruction in writing.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">6. Remedies</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          The parties acknowledge that breach of this Agreement may cause
          irreparable harm for which monetary damages are inadequate. The
          disclosing party is entitled to seek injunctive relief in addition to
          other remedies.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-bold">7. General Provisions</h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          This Agreement constitutes the entire understanding between the
          parties regarding confidential information. It is governed by the laws
          of the State of California. Any disputes shall be resolved in the
          state or federal courts of San Francisco County.
        </p>
      </div>
    </div>
  )
}
