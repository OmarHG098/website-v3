import { useState, useEffect, useCallback } from "react";

const DEBUG_SESSION_KEY = "debug_validated";
const DEBUG_SESSION_EXPIRY_KEY = "debug_validated_expiry";
const DEBUG_TOKEN_KEY = "debug_token";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

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

export function useDebugAuth() {
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isDevelopment = import.meta.env.DEV;

  const validateToken = useCallback(async (skipCache = false) => {
    // Check if we have a valid cached session (unless skipping cache for retry)
    if (!skipCache) {
      const cachedValidation = sessionStorage.getItem(DEBUG_SESSION_KEY);
      const cachedExpiry = sessionStorage.getItem(DEBUG_SESSION_EXPIRY_KEY);
      const cachedToken = sessionStorage.getItem(DEBUG_TOKEN_KEY);
      
      if (cachedValidation === "true" && cachedExpiry && cachedToken) {
        const expiryTime = parseInt(cachedExpiry, 10);
        if (Date.now() < expiryTime) {
          setHasToken(true);
          setIsValidated(true);
          setIsLoading(false);
          return;
        }
      }
    } else {
      // Clear cache when retrying
      sessionStorage.removeItem(DEBUG_SESSION_KEY);
      sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
      sessionStorage.removeItem(DEBUG_TOKEN_KEY);
    }

    // Get token from URL querystring or env variable
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const envToken = import.meta.env.VITE_BREATHECODE_TOKEN;
    
    const token = urlToken || envToken;

    if (!token) {
      setHasToken(false);
      setIsValidated(false);
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
        // Cache the validation result and token with expiry
        sessionStorage.setItem(DEBUG_SESSION_KEY, "true");
        sessionStorage.setItem(DEBUG_SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
        sessionStorage.setItem(DEBUG_TOKEN_KEY, token);
        setIsValidated(true);
      } else {
        sessionStorage.removeItem(DEBUG_SESSION_KEY);
        sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
        sessionStorage.removeItem(DEBUG_TOKEN_KEY);
        setIsValidated(false);
      }
    } catch (error) {
      console.error("Debug auth validation error:", error);
      setIsValidated(false);
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

  return { isValidated, hasToken, isLoading, isDevelopment, retryValidation };
}
