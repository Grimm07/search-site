# 🧾 Authentication Storage Strategy — Detailed Rationale and Tradeoffs

## 🏗 Context

This application is a **React Single Page Application (SPA)** delivered via **AWS CloudFront** and uses **Microsoft Entra ID** (via **MSAL.js**) for single sign-on (SSO). The frontend is a purely client-rendered app, with no server-side session persistence.

All protected backend APIs are accessed via HTTP with **Bearer tokens**, passed in the `Authorization` header.

## 🔐 Problem Space

SPAs must manage user authentication state — including access tokens and account metadata — entirely in the browser. However, **how and where** this data is stored dramatically affects:

- **Security** (XSS vulnerability, token exposure)
- **Usability** (persistence across tabs/reloads)
- **Cross-browser compatibility** (especially macOS/iOS behavior)
- **Silent token renewal reliability**

MSAL provides three options for token caching:

1. `memoryStorage` (default)
2. `sessionStorage`
3. `localStorage`

Each has its own tradeoffs.

---

## ✅ Chosen Configuration

```ts
cache: {
  cacheLocation: 'sessionStorage',
  storeAuthStateInCookie: true
}
```

### 📌 Why This Setup Was Chosen

This hybrid approach:
- Uses `sessionStorage` to **minimize persistence** of sensitive tokens
- Enables cookie fallback (`storeAuthStateInCookie: true`) to **maintain silent auth** compatibility across **Safari**, **Firefox**, and **iOS**, which are notorious for breaking silent auth in iframe contexts

We’ll now explain the rationale and contrast with other configurations.

---

## 🧠 Deep Dive: Cache Options

### Option 1: `memoryStorage` (MSAL default)

| Feature                | Behavior |
|------------------------|----------|
| Token storage          | In-memory (JS variables only) |
| Scope                  | Current tab only |
| Survives reload?       | ❌ No — token gone on hard refresh |
| Works in iframe?       | ✅ Yes (until page reload) |
| Cross-tab sync         | ❌ No |
| Silent token renewal   | ✅ Works, until page is refreshed |
| Security               | 🔐 Best (cannot be stolen via XSS or persisted) |

**Pros**:
- No tokens persist between page loads = very secure
- Works for ephemeral login sessions

**Cons**:
- Breaks on reload or navigation (user must re-login or MSAL must re-init)
- Useless for "remember me" UX
- Can't restore account context without explicit token refresh

**Why we didn't choose it**:
- Too disruptive for users — MSAL state lost on reload (especially bad during dev/testing)
- Silent renewal only works until the user refreshes or closes the tab

---

### Option 2: `localStorage`

| Feature                | Behavior |
|------------------------|----------|
| Token storage          | Local, persistent |
| Survives reload?       | ✅ Yes |
| Works in iframe?       | ✅ Yes |
| Cross-tab sync         | ✅ Yes (implicitly via shared storage) |
| Silent token renewal   | ✅ Reliable |
| Security               | ⚠️ Risky (vulnerable to XSS attacks) |

**Pros**:
- Reliable persistent login
- No flicker or re-login needed
- Works consistently across all browsers

**Cons**:
- Persistent access tokens stored in a **global, readable JS context**
- Vulnerable to **XSS**: if any JS injection occurs, attacker can steal tokens
- Security-conscious users (especially in enterprise) may forbid this

**Why we didn’t choose it**:
- We prioritize **minimizing attack surface**
- Long-lived tokens in `localStorage` are too exposed for our risk model

---

### ✅ Option 3: `sessionStorage` + `storeAuthStateInCookie: true` (**Chosen**)

| Feature                | Behavior |
|------------------------|----------|
| Token storage          | Session-only, per-tab |
| Silent renewal support | ✅ Works even in Safari (via cookie fallback) |
| Cross-tab sync         | ❌ No |
| Survives reload?       | ✅ Yes (in same tab), ❌ No (across tabs or new session) |
| XSS-safe               | ✅ Mostly (short-lived) |
| Token refresh fallback | ✅ Cookies enable silent auth even when iframe sessionStorage is blocked |

**Pros**:
- Balances security (non-persistent tokens) with UX (auto-silent reauth)
- Works around Safari/iOS **iframe + sessionStorage blocking**
- Keeps session ephemeral — matches cloud-native identity best practices

**Cons**:
- Still volatile — user may need to reauth after closing browser
- Cookies can’t be inspected/debugged easily (they’re scoped to Entra endpoints)

**Why we chose it**:
- Fixes silent auth in problematic browsers
- Keeps tokens out of long-term storage
- Lets us safely show login UI only when really needed

---

## 🔐 Security Principles We Upheld

| Principle                            | How it’s respected |
|-------------------------------------|---------------------|
| 🧼 Avoid persistent secrets          | Tokens never stored in `localStorage` |
| 🛡 Minimize XSS exposure             | No app-visible cookies, no persistent tokens |
| 📉 Scope to session context          | `sessionStorage` and MSAL’s account memory |
| 🚫 Avoid storage replay attacks      | MSAL’s cookie fallback is origin-bound |
| ⚠️ Refresh expiration managed        | We manually expire Zustand state via `persistedAt` timestamp |

---

## 🧪 Compatibility Testing Summary

| Browser     | Silent Auth Success | Logout on Close | Consistent UX |
|-------------|---------------------|------------------|---------------|
| Safari macOS/iOS | ✅ (with cookie fallback) | ✅ | ✅ |
| Firefox     | ✅ (with fallback)   | ✅ | ✅ |
| Chrome      | ✅ Native            | ✅ | ✅ |
| Edge        | ✅ Native            | ✅ | ✅ |

> 📝 In Safari and Firefox (esp. private mode), iframe silent auth without cookies fails — that was the original issue we encountered.

---

## 🌐 Impact on CloudFront

> **None.**

- MSAL and token exchange happens **entirely in the client**, with:
    - JavaScript served by CloudFront
    - Token requests to `login.microsoftonline.com`
- CloudFront serves static assets and does not interact with MSAL or identity at all
- **No additional headers or CORS adjustments required** on CloudFront side

---

## ✅ Final Justification

This hybrid config provides:
- The **maximum cross-browser silent login compatibility** short of persisting tokens
- A **short-lived, session-bound** identity context
- Compatibility with security-focused SPA design (no server-side auth, no cookie sessions)
- Mitigations for iframe limitations on Safari and Firefox
- Respects principle of least privilege and least persistence

> It’s the best balance between **security**, **usability**, and **cross-browser stability** for a CloudFront-distributed React SPA using MSAL.
