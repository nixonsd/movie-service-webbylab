import { resolveMx } from 'node:dns/promises';

export async function hasMxRecord(email: string): Promise<boolean> {
  const at = email.lastIndexOf('@');
  if (at === -1) return false;

  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase();
  if (!domain) return false;

  try {
    const mx = await resolveMx(domain);
    return Array.isArray(mx) && mx.length > 0;
  } catch {
    return false;
  }
}
