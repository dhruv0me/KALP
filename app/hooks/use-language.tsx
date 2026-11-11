import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANGUAGE_CODE,
  getLanguageOption,
  getUiCopy,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type LanguageOption,
  type UiCopy,
} from "@/lib/languages";

const STORAGE_KEY = "kalp-language";

interface LanguageContextValue {
  code: LanguageCode;
  language: LanguageOption;
  languages: readonly LanguageOption[];
  copy: UiCopy;
  setLanguage: (code: LanguageCode) => void;
}

const DEFAULT_VALUE: LanguageContextValue = {
  code: DEFAULT_LANGUAGE_CODE,
  language: getLanguageOption(DEFAULT_LANGUAGE_CODE),
  languages: SUPPORTED_LANGUAGES,
  copy: getUiCopy(DEFAULT_LANGUAGE_CODE),
  setLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextValue>(DEFAULT_VALUE);

function applyDocumentLanguage(option: LanguageOption) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = option.code;
  document.documentElement.dir = option.dir;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<LanguageCode>(DEFAULT_LANGUAGE_CODE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && isSupportedLanguage(saved)) {
        setCode(saved);
        applyDocumentLanguage(getLanguageOption(saved));
        return;
      }
    } catch {
      // Ignore storage errors in restricted environments.
    }
    applyDocumentLanguage(getLanguageOption(DEFAULT_LANGUAGE_CODE));
  }, []);

  const setLanguage = useCallback((nextCode: LanguageCode) => {
    setCode(nextCode);
    applyDocumentLanguage(getLanguageOption(nextCode));
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCode);
    } catch {
      // Ignore storage errors in restricted environments.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      code,
      language: getLanguageOption(code),
      languages: SUPPORTED_LANGUAGES,
      copy: getUiCopy(code),
      setLanguage,
    }),
    [code, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

