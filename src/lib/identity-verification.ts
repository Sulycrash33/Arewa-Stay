/**
 * Identity verification integration boundary.
 *
 * IMPORTANT: This does NOT actually verify a NIN or BVN against any real
 * government or bank database. No such integration exists yet because that
 * requires a paid account and API key with a licensed provider (e.g.
 * Youverify, Paystack Identity, or a direct NIBSS integration) — the same
 * kind of external credential dependency as Paystack payments.
 *
 * What this module does today: validates the *shape* of the input (11
 * digits) and returns a `pending` result, exactly as if a real check were
 * in flight. The admin approval queue (/admin/verifications) is the actual
 * decision-maker right now — a human reviews the submission.
 *
 * When real credentials are available, swap the body of `verifyIdentity`
 * for a real API call. Nothing else in the app needs to change: the
 * calling code (onboarding/identity/page.tsx) only depends on this
 * function's return shape, not on how the check is performed.
 */

export type IdentityVerificationResult =
  | { status: 'verified'; provider: string }
  | { status: 'pending_manual_review'; reason: string }
  | { status: 'invalid_format'; reason: string };

export async function verifyIdentity(
  idType: 'NIN' | 'BVN',
  idNumber: string
): Promise<IdentityVerificationResult> {
  const digitsOnly = idNumber.replace(/\D/g, '');

  if (digitsOnly.length !== 11) {
    return { status: 'invalid_format', reason: `${idType} must be exactly 11 digits.` };
  }

  // --- REAL PROVIDER CALL GOES HERE ---
  // Example shape for Youverify (https://youverify.co/docs):
  //
  //   const res = await fetch('https://api.youverify.co/v2/api/identity/ng/nin', {
  //     method: 'POST',
  //     headers: { token: process.env.YOUVERIFY_API_KEY!, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ id: digitsOnly, isSubjectConsent: true }),
  //   });
  //   const data = await res.json();
  //   if (data.success) return { status: 'verified', provider: 'youverify' };
  //
  // Until YOUVERIFY_API_KEY (or an equivalent provider key) is configured,
  // every submission falls through to manual admin review below.

  return {
    status: 'pending_manual_review',
    reason: 'No identity verification provider is configured yet — an admin will review this submission manually.',
  };
}
