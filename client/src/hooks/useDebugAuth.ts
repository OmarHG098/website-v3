import { useState, useEffect } from "react";

const DEBUG_SESSION_KEY = "debug_validated";
const DEBUG_SESSION_EXPIRY_KEY = "debug_validated_expiry";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function useDebugAuth() {
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    async function validateToken() {
      // Check if we have a valid cached session
      const cachedValidation = sessionStorage.getItem(DEBUG_SESSION_KEY);
      const cachedExpiry = sessionStorage.getItem(DEBUG_SESSION_EXPIRY_KEY);
      
      if (cachedValidation === "true" && cachedExpiry) {
        const expiryTime = parseInt(cachedExpiry, 10);
        if (Date.now() < expiryTime) {
          setHasToken(true);
          setIsValidated(true);
          setIsLoading(false);
          return;
        }
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
          // Cache the validation result with expiry
          sessionStorage.setItem(DEBUG_SESSION_KEY, "true");
          sessionStorage.setItem(DEBUG_SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
          setIsValidated(true);
        } else {
          sessionStorage.removeItem(DEBUG_SESSION_KEY);
          sessionStorage.removeItem(DEBUG_SESSION_EXPIRY_KEY);
          setIsValidated(false);
        }
      } catch (error) {
        console.error("Debug auth validation error:", error);
        setIsValidated(false);
      }

      setIsLoading(false);
    }

    validateToken();
  }, []);

  return { isValidated, hasToken, isLoading, isDevelopment };
}
