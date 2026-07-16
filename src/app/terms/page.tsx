const SECTION_CLASS = 'font-title-md text-title-md text-m3-primary mt-stack-lg mb-stack-sm';
const P_CLASS = 'font-body-md text-on-surface-variant mb-stack-sm leading-relaxed';

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-3xl">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Terms of Service</h1>
      <p className="text-sm text-on-surface-variant mb-stack-lg">Last updated: July 2026</p>

      <div className="rounded-tubali bg-ochre-gold/10 border border-ochre-gold/30 p-stack-sm mb-stack-lg">
        <p className="font-body-md text-sm text-on-surface-variant">
          This document is a working draft prepared for Arewa Stay's launch and has not yet been reviewed by a
          licensed Nigerian lawyer. Please have qualified legal counsel review it before relying on it for a live,
          paying platform.
        </p>
      </div>

      <p className={P_CLASS}>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Arewa Stay, a hospitality
        marketplace connecting guests with hosts across Northern Nigeria and Niger Republic. By creating an
        account, listing a property, or booking a stay, you agree to these Terms.
      </p>

      <h2 className={SECTION_CLASS}>1. Eligibility</h2>
      <p className={P_CLASS}>
        You must be at least 18 years old and capable of entering a binding contract under the laws of your
        country of residence to use Arewa Stay, whether as a guest or a host.
      </p>

      <h2 className={SECTION_CLASS}>2. What Arewa Stay Is (and Isn&apos;t)</h2>
      <p className={P_CLASS}>
        Arewa Stay is a marketplace that connects independent hosts with guests. We are not a party to the
        rental agreement formed between a host and a guest, and we do not own, manage, or inspect any
        listed property beyond the verification steps described below. Hosts are solely responsible for the
        accuracy of their listings and compliance with applicable local law, tenancy regulations, and tax
        obligations.
      </p>

      <h2 className={SECTION_CLASS}>3. Identity Verification (NIN / BVN)</h2>
      <p className={P_CLASS}>
        To build trust between strangers transacting for the first time, hosts are asked to verify their
        identity using their National Identification Number (NIN) or Bank Verification Number (BVN). Arewa
        Stay does not store your raw NIN or BVN in our database, we record only the outcome of a one-time
        validation performed through a licensed identity-verification provider or a community liaison review.
        See our Privacy Policy for full detail on how this data is handled.
      </p>

      <h2 className={SECTION_CLASS}>4. The Maraba Booking Process</h2>
      <p className={P_CLASS}>
        Arewa Stay does not use instant-book. When a guest requests a stay, the host has 12 hours to
        respond &mdash; &quot;Maraba&quot; to accept, or &quot;Nemi Wani&quot; to decline. If a host does not respond within
        that window, the request automatically expires and any guest payment hold is released in full. No
        guest is charged, and no host is obligated, until a request is explicitly accepted.
      </p>

      <h2 className={SECTION_CLASS}>5. Cultural &amp; Household Filters</h2>
      <p className={P_CLASS}>
        Some listings are marked women-only, family-only, or alcohol-free by the host. These filters reflect
        the host&apos;s household preferences. Arewa Stay relies on good-faith disclosure by both guests and hosts
        when using these filters and cannot independently verify compliance inside a private residence. Hosts
        and guests found to have misrepresented themselves to circumvent a filter may have their account
        suspended.
      </p>

      <h2 className={SECTION_CLASS}>6. Trust Tiers</h2>
      <p className={P_CLASS}>
        Hosts progress through three tiers &mdash; Bako (new), Majidadin (established, based on completed stays
        and response time), and Sarki (top-tier, subject to additional review) &mdash; which affect visibility and
        payout timing. Tier status is calculated automatically from platform activity and can be reviewed by
        our team at any time.
      </p>

      <h2 className={SECTION_CLASS}>7. Fees, Pricing &amp; Currency</h2>
      <p className={P_CLASS}>
        Hosts set their own nightly price in Naira (NGN) or CFA Franc (XOF). Arewa Stay will disclose any
        service fee charged to guests or commission deducted from host payouts before you complete a booking
        or accept a request. Fees may change with notice; the fee in effect at the time you book or accept
        applies to that transaction.
      </p>

      <h2 className={SECTION_CLASS}>8. Cancellations</h2>
      <p className={P_CLASS}>
        Cancellation terms for a confirmed booking are set out at the time of booking and may vary by
        listing. Requests that expire under the Maraba window (Section 4) are not cancellations and do not
        count against either party.
      </p>

      <h2 className={SECTION_CLASS}>9. Prohibited Conduct</h2>
      <p className={P_CLASS}>
        You may not use Arewa Stay to list a property you do not have the right to rent, to discriminate
        unlawfully, to harass another user, to circumvent the platform&apos;s payment or verification systems, or
        to engage in any activity that is illegal under Nigerian or Nigerien law.
      </p>

      <h2 className={SECTION_CLASS}>10. Disputes</h2>
      <p className={P_CLASS}>
        If something goes wrong with a stay, either party can open a dispute from their booking. Our team
        reviews disputes and, where relevant, may involve a community liaison familiar with the local area.
        We aim to mediate in good faith but do not guarantee a particular outcome and are not a substitute
        for legal proceedings where those are warranted.
      </p>

      <h2 className={SECTION_CLASS}>11. Limitation of Liability</h2>
      <p className={P_CLASS}>
        Arewa Stay provides the platform &quot;as is.&quot; To the fullest extent permitted by law, we are not liable
        for the conduct of any host or guest, the condition of any listed property, or any indirect,
        incidental, or consequential damages arising from your use of the platform.
      </p>

      <h2 className={SECTION_CLASS}>12. Termination</h2>
      <p className={P_CLASS}>
        We may suspend or terminate an account that violates these Terms, poses a safety risk to other
        users, or is subject to a legal requirement to do so. You may close your account at any time by
        contacting us.
      </p>

      <h2 className={SECTION_CLASS}>13. Governing Law</h2>
      <p className={P_CLASS}>
        These Terms are governed by the laws of the Federal Republic of Nigeria. Users in Niger Republic
        remain subject to applicable local law in addition to these Terms.
      </p>

      <h2 className={SECTION_CLASS}>14. Changes to These Terms</h2>
      <p className={P_CLASS}>
        We may update these Terms from time to time. Continued use of Arewa Stay after a change takes
        effect constitutes acceptance of the revised Terms.
      </p>

      <h2 className={SECTION_CLASS}>15. Contact</h2>
      <p className={P_CLASS}>
        Questions about these Terms can be sent through our <a href="/contact" className="text-primary-container hover:underline">Contact page</a>.
      </p>
    </main>
  );
}
