import { useState, useEffect, useCallback } from "react";
import type { Capabilities } from "@shared/schema";

const DEBUG_SESSION_KEY = "debug_validated";
const DEBUG_SESSION_EXPIRY_KEY = "debug_validated_expiry";
const DEBUG_TOKEN_KEY = "debug_token";
const DEBUG_MODE_KEY = "debug_mode";
const DEBUG_CAPABILITIES_KEY = "debug_capabilities";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const DEFAULT_CAPABILITIES: Capabilities = {
  webmaster: false,
  content_read: false,
  content_edit_text: false,
  content_edit_structure: false,
  content_edit_media: false,
  content_publish: false,
};

// Check if debug mode is active
// In development: always true
// In production: requires ?debug=true in URL (persisted in sessionStorage)
export function isDebugModeActive(): boolean {
  // Check URL for ?debug=false first - explicit override to disable
  const urlParams = new URLSearchParams(window.location.search);
  const debugParam = urlParams.get("debug");
  
  if (debugParam === "false") {
    return false;
  }
  
  const isDev = import.meta.env.DEV;
  
  // Always active in development (unless explicitly disabled above)
  if (isDev) {
    return true;
  }
  
  // Check sessionStorage first (persists across navigation)
  const storedDebugMode = sessionStorage.getItem(DEBUG_MODE_KEY);
  if (storedDebugMode === "true") {
    return true;
  }
  
  if (debugParam === "true") {
    // Store in sessionStorage and clean up URL
    sessionStorage.setItem(DEBUG_MODE_KEY, "true");
    const url = new URL(window.location.href);
    url.searchParams.delete("debug");
    window.history.replaceState({}, "", url.toString());
    return true;
  }
  
  return false;
}

export function getDebugToken(): string | null {
  // Check sessionStorage for cached token
  const cachedToken = sessionStorage.getItem(DEBUG_TOKEN_KEY);
  const cachedExpiry = sessionStorage.getItem(DEBUG_SESSION_EXPIRY_KEY);
  
  if (cachedToken && cachedExpiry) {
    const expiryTime = parseInt(cachedExpiry, 10);
    if (Date.now() < expiryTime) {
      return cachedToken;
    }
  }
  
  // Fall back to URL or env variable
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get("token");
  const envToken = import.meta.env.VITE_BREATHECODE_TOKEN;
  
  return urlToken || envToken || null;
}

export function getCachedCapabilities(): Capabilities {
  try {
    const cached = sessionStorage.getItem(DEBUG_CAPABILITIES_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CAPABILITIES;
}

export function useDebugAuth() {
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [capabilities, setCapabilities] = useState<Capabilities>(DEFAULT_CAPABILITIES);
  
  const isDevelopment = import.meta.env.DEV;
  const isDebugMode = isDebugModeActive();

  const validateToken = useCallback(async (skipCache = false) => {
    // Check if we have a valid cached session (unless skipping cache for retry)
    if (!skipCache) {
      const cachedValidation = sessionStorage.getItem(DEBUG_SESSION_KEY);
      const cachedExpiry = sessionStorage.getItem(DEBUG_SESSION_EXPIRY_KEY);
      const cachedToken = sessionStorage.getItem(DEBUG_TOKEN_KEY);
      const cachedCaps = sessionStorage.getItem(DEBUG_CAPABILITIES_KEY);
      
      if (cachedValidation === "true" && cachedExpiry && cachedToken) {
        const expiryTime = parseInt(cachedExpiry, 10);
        if (Date.now() < expiryTime) {
          setHasToken(true);
          setIsValidated(true);
          if (cachedCaps) {
            try {
              setCapabilities(JSON.parse(cachedCaps));
            } catch {
              // Ignore
            }
          }
          setIsLoading(false);
          return;
        }
      }
    } else {
      // Clear cache when retrying
      sessionStorage.removeItem(DEBUG_SESSION_KEY);
      sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
      sessionStorage.removeItem(DEBUG_TOKEN_KEY);
      sessionStorage.removeItem(DEBUG_CAPABILITIES_KEY);
    }

    // Get token from URL querystring or env variable
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const envToken = import.meta.env.VITE_BREATHECODE_TOKEN;
    
    const token = urlToken || envToken;

    if (!token) {
      setHasToken(false);
      setIsValidated(false);
      setCapabilities(DEFAULT_CAPABILITIES);
      setIsLoading(false);
      return;
    }

    setHasToken(true);
    setIsLoading(true);

    // Clean up URL if token was in querystring
    if (urlToken) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }

    try {
      const response = await fetch("/api/debug/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (data.valid) {
        // Cache the validation result, token, and capabilities with expiry
        sessionStorage.setItem(DEBUG_SESSION_KEY, "true");
        sessionStorage.setItem(DEBUG_SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
        sessionStorage.setItem(DEBUG_TOKEN_KEY, token);
        if (data.capabilities) {
          sessionStorage.setItem(DEBUG_CAPABILITIES_KEY, JSON.stringify(data.capabilities));
          setCapabilities(data.capabilities);
        }
        setIsValidated(true);
      } else {
        sessionStorage.removeItem(DEBUG_SESSION_KEY);
        sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
        sessionStorage.removeItem(DEBUG_TOKEN_KEY);
        sessionStorage.removeItem(DEBUG_CAPABILITIES_KEY);
        setCapabilities(data.capabilities || DEFAULT_CAPABILITIES);
        setIsValidated(false);
      }
    } catch (error) {
      console.error("Debug auth validation error:", error);
      setIsValidated(false);
      setCapabilities(DEFAULT_CAPABILITIES);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    validateToken(false);
  }, [validateToken]);

  // Retry validation (clears cache and re-validates)
  const retryValidation = useCallback(() => {
    return validateToken(true);
  }, [validateToken]);

  // Validate a manually entered token
  const validateManualToken = useCallback(async (manualToken: string) => {
    if (!manualToken.trim()) return;
    
    setHasToken(true);
    setIsLoading(true);
    
    // Clear any existing cache
    sessionStorage.removeItem(DEBUG_SESSION_KEY);
    sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
    sessionStorage.removeItem(DEBUG_TOKEN_KEY);
    sessionStorage.removeItem(DEBUG_CAPABILITIES_KEY);

    try {
      const response = await fetch("/api/debug/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: manualToken }),
      });

      const data = await response.json();
      
      if (data.valid) {
        sessionStorage.setItem(DEBUG_SESSION_KEY, "true");
        sessionStorage.setItem(DEBUG_SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
        sessionStorage.setItem(DEBUG_TOKEN_KEY, manualToken);
        if (data.capabilities) {
          sessionStorage.setItem(DEBUG_CAPABILITIES_KEY, JSON.stringify(data.capabilities));
          setCapabilities(data.capabilities);
        }
        setIsValidated(true);
      } else {
        setCapabilities(data.capabilities || DEFAULT_CAPABILITIES);
        setIsValidated(false);
      }
    } catch (error) {
      console.error("Debug auth validation error:", error);
      setIsValidated(false);
      setCapabilities(DEFAULT_CAPABILITIES);
    }

    setIsLoading(false);
  }, []);

  // Clear token and reset to "no token" state
  const clearToken = useCallback(() => {
    sessionStorage.removeItem(DEBUG_SESSION_KEY);
    sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
    sessionStorage.removeItem(DEBUG_TOKEN_KEY);
    sessionStorage.removeItem(DEBUG_CAPABILITIES_KEY);
    setHasToken(false);
    setIsValidated(false);
    setCapabilities(DEFAULT_CAPABILITIES);
  }, []);

  // Check if user has a specific capability
  const hasCapability = useCallback((capability: keyof Capabilities): boolean => {
    return capabilities[capability] === true;
  }, [capabilities]);

  // Check if user can edit content (has any edit capability)
  const canEdit = capabilities.content_edit_text || 
                  capabilities.content_edit_structure || 
                  capabilities.content_edit_media;

  return { 
    isValidated, 
    hasToken, 
    isLoading, 
    isDevelopment, 
    isDebugMode, 
    capabilities,
    hasCapability,
    canEdit,
    retryValidation, 
    validateManualToken, 
    clearToken 
  };
}
