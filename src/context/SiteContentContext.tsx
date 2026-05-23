import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SITE_CONTENT_SEED } from '../data';
import { fetchSiteContent } from '../lib/api';
import type { SiteContent } from '../types';

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  loadError: string | null;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(SITE_CONTENT_SEED);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshContent = async () => {
    try {
      const next = await fetchSiteContent();
      setContent(next);
      setLoadError(null);
    } catch (error) {
      console.error('Could not load site content:', error);
      setLoadError(error instanceof Error ? error.message : 'Could not load live site content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshContent();
  }, []);

  const value = useMemo(
    () => ({
      content,
      loading,
      loadError,
      refreshContent,
    }),
    [content, loading, loadError],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used inside SiteContentProvider.');
  }

  return context;
}
