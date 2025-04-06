# BROWSER_COMPATIBILITY.md

## Overview

This document outlines browser compatibility considerations for the authentication architecture of the React Single Page Application (SPA) delivered via AWS CloudFront. The app uses Microsoft Entra ID via MSAL.js for authentication, and silent token renewal relies on iframe-based flows. Compatibility issues can arise due to differences in how browsers handle `sessionStorage`, cross-origin iframes, and cookie isolation.

Related: See [SECURITY.md](./SECURITY.md) for token storage rationale and threat analysis.

---

## Browser Behaviors Affecting MSAL

### 1. **Safari (macOS/iOS)**
- ❌ Blocks `sessionStorage` access in hidden iframes
- ❌ Prevents silent token renewal via `acquireTokenSilent()` when `sessionStorage` is used alone
- ✅ Works with `storeAuthStateInCookie: true` fallback cookies
- ⚠️ Private mode may break session even with fallback

### 2. **Firefox (especially Private Browsing)**
- ❌ Blocks third-party iframe `sessionStorage` access
- ❌ iframe silent auth may fail unless cookie fallback is enabled
- ✅ Compatible when `storeAuthStateInCookie: true` is set

### 3. **Chrome / Chromium-based (Edge, Brave, Vivaldi)**
- ✅ Fully compatible with `sessionStorage` and iframe-based silent token renewal
- ✅ Refresh and cross-origin iframe usage function as expected

### 4. **Internet Explorer 11 (legacy support)**
- ❌ Not supported (MSAL v2+ does not support IE)

### 5. **Android Chrome / iOS Chrome**
- ✅ Mostly compatible, but inherits Safari iframe issues on iOS
- ✅ Works when `storeAuthStateInCookie: true` is used


---

## Recommended Configuration for Cross-Browser Support

```ts
cache: {
  cacheLocation: 'sessionStorage',
  storeAuthStateInCookie: true
}
```

This hybrid configuration is the most effective for:
- Supporting silent token renewal across **Safari**, **Firefox**, and mobile browsers
- Avoiding `localStorage` security concerns
- Maintaining short-lived session isolation in modern security models

---

## Known Issues

| Browser | Issue | Mitigation |
|---------|-------|------------|
| Safari (iOS/macOS) | iframe cannot access `sessionStorage` | `storeAuthStateInCookie: true` allows fallback |
| Firefox (Private) | iframe `sessionStorage` inaccessible | Cookie fallback enables silent auth |
| Safari (Private) | Cookies and `sessionStorage` both purged aggressively | Reauthentication required on session expiry |

---

## Automated Testing Strategy

To validate silent auth behavior across environments:

```ts
// msalTest.ts (Pseudocode/Concept)
const testSilentRenewal = async () => {
  const msalInstance = new PublicClientApplication(config);
  const account = msalInstance.getActiveAccount();

  const result = await msalInstance.acquireTokenSilent({
    scopes: ['user.read'],
    account,
  });

  console.assert(result.accessToken !== undefined, 'Silent auth failed');
};
```

Suggested test procedure:
1. Open DevTools → Application → Storage → Validate MSAL entries in `sessionStorage`
2. Simulate iframe refresh (`acquireTokenSilent`) and observe behavior
3. Repeat in:
    - Chrome, Edge, Firefox
    - Safari (macOS + iOS), Private Browsing modes
4. Check fallback to popup if silent auth fails

Consider using Playwright or Cypress for scripted validation of:
- Auth persistence
- Silent auth timing
- Failure modes with blocked cookies/storage

---

## Summary

Due to inconsistent iframe and storage behavior across browsers, especially in privacy-focused modes, this application uses `sessionStorage` with `storeAuthStateInCookie: true`. This approach ensures:
- Maximum security via ephemeral session-based token storage
- Reliable silent auth compatibility across all mainstream browsers
- Predictable behavior on mobile and desktop

This configuration is recommended by Microsoft and validated across enterprise-grade deployments.

