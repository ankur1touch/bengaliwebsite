const CMS_TOKEN = process.env.CMS_API_TOKEN;

export function validateCmsToken(authHeader: string | null): boolean {
  if (!CMS_TOKEN || CMS_TOKEN === 'CHANGE_ME_TOKEN') return false;
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  if (token.length !== CMS_TOKEN.length) return false;
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ CMS_TOKEN.charCodeAt(i);
  }
  return mismatch === 0;
}
