# SECURITY.md

## Overview

This document outlines the authentication storage strategy and associated security implications for the React Single Page Application (SPA) delivered via AWS CloudFront. The app uses Microsoft Entra ID for authentication through the MSAL.js library. Token handling, persistence, and exposure are critical to maintaining a secure environment in a fully client-rendered application.

See also: [BROWSER_COMPATIBILITY.md](./BROWSER_COMPATIBILITY.md) for in-depth handling of browser behavior related to authentication.

---

## Authentication Architecture

The application uses the [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js) library to authenticate users against Microsoft Entra ID (formerly Azure AD) via popup login. All authentication occurs client-side.

**Access tokens are passed to backend APIs as Bearer tokens in the `Authorization` header.** No cookies or session state are maintained server-side.

The app's authentication and session state are governed by:
- MSAL token cache storage (`sessionStorage`, `memoryStorage`, `localStorage`)
- Zustand `authSlice` state persistence
- Silent token renewal via iframe-based `acquireTokenSilent()`

---

## Chosen Token Storage Configuration

```ts
cache: {
  cacheLocation: 'sessionStorage',
  storeAuthStateInCookie: true,
}
```

### Rationale

This hybrid configuration balances security and cross-browser compatibility:
- **sessionStorage** ensures that tokens are **short-lived** and **tab-scoped**, reducing risk of token theft.
- **storeAuthStateInCookie: true** enables MSAL to maintain **silent token renewal** in browsers that block `sessionStorage` in hidden iframes (e.g., Safari, Firefox).

This combination:
- Prevents persistent token leakage via localStorage
- Enables seamless silent token renewal in problematic browser environments
- Avoids XSS-accessible cookie/session-based tokens

---

## Security-Focused Decision Matrix

| Security Criteria                     | `memoryStorage`         | `sessionStorage`          | `localStorage`             | ✅ `sessionStorage` + Cookies |
|--------------------------------------|--------------------------|----------------------------|-----------------------------|------------------------------|
| Token lifetime                       | 🔄 Ephemeral             | 🔄 Session-only            | 🕓 Persistent                | 🔄 Session-only              |
| XSS vulnerability                    | ✅ Minimal               | ✅ Minimal                 | ❌ High                      | ✅ Minimal                   |
| Scope of token visibility            | 🔒 JS only               | 🔒 Per tab                 | 🔓 Global JS                 | 🔒 Per tab + MS fallback     |
| Silent refresh support               | ✅ Good (volatile)       | ❌ Broken in Safari        | ✅ Reliable                  | ✅ Reliable                  |
| Safari/iOS/Firefox compatibility     | ❌ Breaks after reload   | ❌ iframe issues           | ✅ Works                     | ✅ Works                     |
| Cookie exposure to app               | ✅ None                  | ✅ None                    | ✅ None                      | ✅ None                      |
| Token replay risk                    | ✅ Low                   | ✅ Low                     | ❌ High                      | ✅ Low                       |
| Cross-tab sync                       | ❌ No                    | ❌ No                      | ✅ Yes                       | ❌ No                        |

---

## Additional Mitigations

- Tokens are **never persisted to Zustand or localStorage**.
- Zustand `authSlice` uses `persistedAt` + `onRehydrateStorage` to expire account metadata after a configurable interval.
- All user session logic is client-side — no sensitive state is shared across tabs or stored server-side.
- MSAL cookie fallback is **scoped to Microsoft domains**, not the app origin.

---

## CloudFront Compatibility

CloudFront serves only static assets (HTML, JS, CSS). Authentication and token exchange occurs between the client and Microsoft identity endpoints. No special CloudFront config is required.

- No `Set-Cookie` headers are used by the app
- No state is passed via query parameters
- CORS headers for API endpoints must allow `Authorization` header for Bearer tokens

---

## Summary

This authentication design reflects a balance of:
- Enterprise SSO usability
- Short-lived session isolation
- Browser compatibility
- Zero-persistence, zero-trust alignment

By using `sessionStorage` with cookie-based fallback, the app achieves a secure default posture while minimizing user friction and ensuring compatibility across modern browsers.
