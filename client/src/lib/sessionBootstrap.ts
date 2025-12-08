import type { Session } from '@shared/session';
import { SESSION_STORAGE_KEY, SESSION_VERSION, defaultSession } from '@shared/session';

export function getCachedSession(): Session | null {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as Session;
    
    if (session.version !== SESSION_VERSION) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable
  }
}

export function getLanguageFromCache(): 'en' | 'es' {
  const session = getCachedSession();
  return session?.language || 'en';
}

export function getPathLanguage(path: string): 'en' | 'es' | null {
  const segment = path.split('/').filter(Boolean)[0];
  if (segment === 'es') return 'es';
  if (segment === 'en') return 'en';
  return null;
}

export function shouldRedirectLanguage(currentPath: string): string | null {
  const session = getCachedSession();
  if (!session?.initialized) return null;
  
  const pathLang = getPathLanguage(currentPath);
  
  if (pathLang !== null) return null;
  
  if (session.language === 'es' && !currentPath.startsWith('/es')) {
    return `/es${currentPath}`;
  }
  
  return null;
}

export function getNavigatorInfo(): string {
  if (typeof navigator === 'undefined') {
    return JSON.stringify({ languages: ['en'] });
  }
  
  return JSON.stringify({
    languages: navigator.languages || [],
    language: navigator.language,
    userLanguage: (navigator as { userLanguage?: string }).userLanguage,
  });
}

export function createDefaultSession(): Session {
  return { ...defaultSession };
}
