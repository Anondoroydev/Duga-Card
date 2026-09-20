import { GreetingCardData } from '../types';

interface CompactCardPayload {
  f: string;       // from
  t: string;       // to
  m: string;       // message
  th: string;      // theme
  i?: string;      // imageUrl
  ts?: number;     // timestamp
}

/**
 * Safely encodes a card into a URL-safe Base64 string that supports full UTF-8 (Bengali, emojis, etc.)
 */
export function encodeCardToParam(card: GreetingCardData): string {
  try {
    const payload: CompactCardPayload = {
      f: (card.from || '').trim(),
      t: (card.to || '').trim(),
      m: (card.message || '').trim(),
      th: card.theme || 'royal-maroon',
      i: card.imageUrl || '',
      ts: Date.now(),
    };

    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    const len = bytes.byteLength;
    for (let j = 0; j < len; j++) {
      binary += String.fromCharCode(bytes[j]);
    }
    
    // URL-safe Base64 (RFC 4648)
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode card to param:', err);
    return '';
  }
}

/**
 * Safely decodes a card from a URL-safe Base64 string with full UTF-8 support
 */
export function decodeCardFromParam(param: string): GreetingCardData | null {
  if (!param || typeof param !== 'string') return null;
  try {
    let clean = param.trim().replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }

    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let j = 0; j < binary.length; j++) {
      bytes[j] = binary.charCodeAt(j);
    }

    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json) as Partial<CompactCardPayload & GreetingCardData>;

    const from = data.f || data.from || '';
    const to = data.t || data.to || '';
    const message = data.m || data.message || '';
    const theme = data.th || data.theme || 'royal-maroon';
    const imageUrl = data.i || data.imageUrl || undefined;

    if (from || to || message) {
      return {
        from,
        to,
        message,
        theme: (theme as any) || 'royal-maroon',
        imageUrl: imageUrl || undefined,
      };
    }
  } catch (err) {
    console.warn('Failed to decode card param:', err);
  }
  return null;
}

/**
 * Generates an indestructible share URL based on the real browser origin
 */
export function buildIndestructibleShareUrl(card: GreetingCardData): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  // Create base URL without trailing slash, but ensure origin is clean
  const cleanOrigin = origin.replace(/\/+$/, '');
  const cleanPath = pathname.replace(/\/+$/, '');
  const base = `${cleanOrigin}${cleanPath || ''}`;
  
  const encodedCard = encodeCardToParam(card);
  const params = new URLSearchParams();
  
  if (encodedCard) {
    params.set('card', encodedCard);
  }
  
  // Also append standard human-readable parameters as 100% resilient fallback
  params.set('from', card.from.trim());
  params.set('to', card.to.trim());
  params.set('msg', card.message.trim());
  params.set('theme', card.theme || 'royal-maroon');
  if (card.imageUrl) {
    params.set('img', card.imageUrl);
  }

  // Ensure precisely one slash between base and query params
  return `${base}/?${params.toString()}`;
}

/**
 * Safely decodes a URI component without throwing URIError
 */
export function safeUriDecode(val: string | null | undefined): string {
  if (!val) return '';
  try {
    return decodeURIComponent(val);
  } catch (_e) {
    return val;
  }
}

/**
 * Parses shared greeting card from the current window location (supports ?card, ?c, and ?from/to/msg)
 * Works across serverless restarts, deploy environments, WhatsApp/FB browsers, search & hash params.
 */
export async function parseCardFromLocation(): Promise<GreetingCardData | null> {
  if (typeof window === 'undefined') return null;

  // 1. Gather all URLSearchParams from both search (?...) and hash (#...)
  const searchParams = new URLSearchParams(window.location.search);
  
  let hashParams = new URLSearchParams();
  if (window.location.hash) {
    const hashContent = window.location.hash.replace(/^#\/?/, '');
    const queryIdx = hashContent.indexOf('?');
    if (queryIdx !== -1) {
      hashParams = new URLSearchParams(hashContent.slice(queryIdx + 1));
    } else if (hashContent.includes('=')) {
      hashParams = new URLSearchParams(hashContent);
    }
  }

  // Helper to get from either search or hash
  const getParam = (key: string): string | null => {
    const val = searchParams.get(key) || hashParams.get(key);
    if (!val) return null;
    // Strip quotes if any (some redirectors might add them)
    return val.replace(/^["']|["']$/g, "").trim();
  };

  // 2. Try the self-contained 'card' parameter first (0ms, 100% offline & deploy-proof)
  const cardParam = getParam('card');
  if (cardParam) {
    const decoded = decodeCardFromParam(cardParam);
    if (decoded) {
      return decoded;
    }
  }

  // 3. Try the 'c' parameter (could be short code or base64 token)
  const cParam = getParam('c');
  if (cParam) {
    // Check if 'c' is directly a base64 encoded card
    const directDecode = decodeCardFromParam(cParam);
    if (directDecode) {
      return directDecode;
    }

    // Try fetching from backend API if available
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`/api/cards/${encodeURIComponent(cParam)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.card) {
          return {
            from: data.card.from || '',
            to: data.card.to || '',
            message: data.card.message || '',
            theme: data.card.theme || 'royal-maroon',
            imageUrl: data.card.imageUrl || undefined,
          };
        }
      }
    } catch (_err) {
      // Backend fetch failed or timed out
    }
  }

  // 4. Try standard query parameters (?from=...&to=...&msg=...)
  const from = getParam('from');
  const to = getParam('to');
  const msg = getParam('msg') || getParam('message');
  const theme = getParam('theme');
  const img = getParam('img') || getParam('imageUrl');

  if (from && to && msg) {
    return {
      from: safeUriDecode(from),
      to: safeUriDecode(to),
      message: safeUriDecode(msg),
      theme: (theme as any) || 'royal-maroon',
      imageUrl: img ? safeUriDecode(img) : undefined,
    };
  }

  return null;
}
