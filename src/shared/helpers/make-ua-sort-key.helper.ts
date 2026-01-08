const UA_ALPHABET = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';
const UA_INDEX = new Map([...UA_ALPHABET].map((ch, i) => [ch, String(i + 1).padStart(2, '0')]));

function normalize(input: string): string {
  const raw = typeof input === 'string' ? input : '';
  return raw.trim().replace(/\s+/g, ' ').toUpperCase();
}

export function makeUaSortKey(input: string): string {
  const s = normalize(input);

  return [...s]
    .map((ch) => {
      const ua = UA_INDEX.get(ch);
      if (ua) return `1${ua}`; // UA letters first
      if (ch >= 'A' && ch <= 'Z') return `2${ch}`; // Latin next
      if (ch >= '0' && ch <= '9') return `3${ch}`; // Digits next
      return `9${ch}`; // Other chars last
    })
    .join('');
}
