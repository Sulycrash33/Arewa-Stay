const SECTION_CLASS = 'font-title-md text-title-md text-m3-primary mt-stack-lg mb-stack-sm';
const P_CLASS = 'font-body-md text-on-surface-variant mb-stack-sm leading-relaxed';

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-3xl">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-on-surface-variant mb-stack-lg">Last updated: July 2026</p>

      <div className="rounded-tubali bg-ochre-gold/10 border border-ochre-gold/30 p-stack-sm mb-stack-lg">
        <p className="font-body-md text-sm text-on-surface-variant">
          This document is a working draft prepared for Arewa Stay's launch and has not yet been reviewed by a
          licensed Nigerian lawyer or data protection specialist. Please have qualified counsel review it,
          particularly against the Nigeria Data Protection Act 2023, before relying on it for a live platform.
        </p>
      </div>

      <p className={P_CLASS}>
        This Privacy Policy explains what personal data Arewa Stay collects, why, and what rights you have
        over it. It applies to guests, hosts, and anyone who creates an account on the platform.
      </p>

      <h2 className={SECTION_CLASS}>1. Who We Are</h2>
      <p className={P_CLASS}>
        Arewa Stay is the data controller for the personal data described in this policy. Contact details are
        available on our <a href="/contact" className="text-primary-container hover:underline">Contact page</a>.
      </p>

      <h2 className={SECTION_CLASS}>2. What We Collect</h2>
      <p className={P_CLASS}>
        <strong className="text-on-surface">Account data:</strong> your name, email, phone number, and profile
        photo if you choose to add one.
      </p>
      <p className={P_CLASS}>
        <strong className="text-on-surface">Identity verification:</strong> if you list a property as a host,
        you may submit your NIN or BVN for one-time validation. We do not store the raw number in our
        database — only whether the check succeeded, via a licensed identity-verification provider or a
        community liaison review, is retained.
      </p>
      <p className={P_CLASS}>
        <strong className="text-on-surface">Booking data:</strong> stay dates, guest count, and the listing
        involved, tied to your account.
      </p>
      <p className={P_CLASS}>
        <strong className="text-on-surface">Messages:</strong> content you send through Arewa Stay&apos;s
        messaging feature with a host or guest, stored so both parties can refer back to a conversation.
      </p>
      <p className={P_CLASS}>
        <strong className="text-on-surface">Location data:</strong> the city/state you search or list in.
        Arewa Stay does not track your device&apos;s precise GPS location.
      </p>
      <p className={P_CLASS}>
        <strong className="text-on-surface">Payment metadata:</strong> once payments are enabled, we will
        record transaction references and amounts. Card and bank details are handled directly by our payment
        processor and are never stored on Arewa Stay&apos;s own servers.
      </p>

      <h2 className={SECTION_CLASS}>3. Why We Use It</h2>
      <p className={P_CLASS}>
        We use your data to operate the marketplace: to show your listings to relevant guests, to process
        booking requests, to verify host identity for guest safety, to respond to support requests, and to
        meet legal obligations (for example, responding to a lawful request from a Nigerian regulatory
        authority).
      </p>

      <h2 className={SECTION_CLASS}>4. Who We Share It With</h2>
      <p className={P_CLASS}>
        We share data with: (a) the other party to a booking, to the extent needed to complete a stay (e.g.
        a host sees a confirmed guest&apos;s name and contact details); (b) identity-verification providers,
        strictly for the one-time NIN/BVN check; (c) our infrastructure providers (database hosting,
        payments) who process data on our behalf under contract; (d) a community liaison, where one is
        assigned to review a host verification or mediate a dispute; and (e) law enforcement or regulators,
        only where legally required.
      </p>
      <p className={P_CLASS}>We do not sell personal data to advertisers or data brokers.</p>

      <h2 className={SECTION_CLASS}>5. Where Your Data Is Stored</h2>
      <p className={P_CLASS}>
        Arewa Stay&apos;s database and file storage are hosted on Supabase infrastructure. Data may be processed
        outside Nigeria and Niger Republic as a result; where this happens, we rely on our provider&apos;s
        standard contractual safeguards for cross-border data transfer.
      </p>

      <h2 className={SECTION_CLASS}>6. How Long We Keep It</h2>
      <p className={P_CLASS}>
        We retain account and booking data for as long as your account is active, and for a reasonable
        period afterward to meet legal, tax, and dispute-resolution obligations. You can request deletion of
        your account at any time (see Section 8).
      </p>

      <h2 className={SECTION_CLASS}>7. Security</h2>
      <p className={P_CLASS}>
        We use Row Level Security at the database level so that, by default, a user can only read or modify
        their own data, and access to sensitive tables is restricted to the relevant parties. No system is
        completely secure, and we cannot guarantee absolute security of information transmitted over the
        internet.
      </p>

      <h2 className={SECTION_CLASS}>8. Your Rights</h2>
      <p className={P_CLASS}>
        Under the Nigeria Data Protection Act, you have the right to: access the personal data we hold about
        you; request correction of inaccurate data; request deletion of your data, subject to legal
        retention requirements; object to certain processing; and lodge a complaint with the Nigeria Data
        Protection Commission (NDPC) if you believe your rights have been violated. To exercise any of these
        rights, contact us via our <a href="/contact" className="text-primary-container hover:underline">Contact page</a>.
      </p>

      <h2 className={SECTION_CLASS}>9. Children</h2>
      <p className={P_CLASS}>
        Arewa Stay is not directed at, and does not knowingly collect data from, anyone under 18.
      </p>

      <h2 className={SECTION_CLASS}>10. Cookies</h2>
      <p className={P_CLASS}>
        We use only the minimal session cookies required to keep you logged in. We do not currently use
        third-party advertising or tracking cookies.
      </p>

      <h2 className={SECTION_CLASS}>11. Changes to This Policy</h2>
      <p className={P_CLASS}>
        We may update this policy as the platform evolves, particularly as payments and additional
        verification features are added. We will update the date at the top of this page when we do.
      </p>

      <h2 className={SECTION_CLASS}>12. Contact</h2>
      <p className={P_CLASS}>
        For any question about this policy or your personal data, reach us through our{' '}
        <a href="/contact" className="text-primary-container hover:underline">Contact page</a>.
      </p>
    </main>
  );
}
