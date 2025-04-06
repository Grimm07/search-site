## 📊 MSAL Storage Strategy Decision Matrix

| Criteria                              | `memoryStorage` (default)             | `sessionStorage`                        | `localStorage`                         | ✅ `sessionStorage` + `storeAuthStateInCookie` (**Chosen**) |
|---------------------------------------|----------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------------------------|
| **Security**                          | 🔒 Best — tokens in-memory only        | 🔒 High — tokens cleared on tab close     | ⚠️ Medium — tokens persist in JS context | 🔒 High — short-lived tokens + safe fallback cookies        |
| **Persistence on reload**            | ❌ No                                   | ✅ Yes (same tab only)                     | ✅ Yes (any tab)                          | ✅ Yes (same tab only)                                     |
| **Cross-tab support**                | ❌ No                                   | ❌ No                                      | ✅ Yes                                    | ❌ No                                                      |
| **Silent token refresh support**     | ✅ Yes (until reload)                  | ❌ Fails in Safari/iOS/Firefox            | ✅ Yes                                    | ✅ Yes — cookies allow fallback in iframe                  |
| **Compatibility: Safari/iOS**        | ❌ Breaks after reload                 | ❌ iframe refresh blocked                 | ✅ Reliable                               | ✅ Reliable — cookie fallback works                        |
| **UX smoothness**                    | ❌ Poor — user reauths on reload       | ⚠️ Mid — session-only, no cross-tab reuse | ✅ Great — persistent login               | ✅ Good — session-bound but refreshes reliably             |
| **Token exposure surface**           | ✅ Minimal                              | ✅ Minimal                                 | ❌ Exposed to XSS                         | ✅ Minimal — no app-visible cookies                        |
| **Resilience to XSS**                | ✅ Best                                 | ✅ Best                                    | ❌ Worst                                  | ✅ Strong — no local tokens, cookies inaccessible          |
| **Recovery after browser restart**   | ❌ Lost                                 | ❌ Lost                                    | ✅ Preserved                              | ❌ Lost — session-only                                    |
| **Debug/debuggability**              | ✅ Simple (in JS only)                 | ✅ Simple                                  | ✅ Simple                                  | ⚠️ Harder — fallback uses cookies outside app scope       |
| **CloudFront impact**                | ✅ None                                 | ✅ None                                    | ✅ None                                    | ✅ None                                                    |
| **Use case fit**                     | 🔐 Highest security, dev tooling       | 🧪 Internal apps, ephemeral sessions       | 🛠 General use, low-risk apps             | 🚀 SPAs needing secure, reliable silent auth across browsers |

---

### ✅ Our Selection: `sessionStorage` + `storeAuthStateInCookie: true`

This hybrid configuration was chosen because it provides:

- **Strong security guarantees** without persistent token exposure
- **Reliable silent auth in cross-browser conditions**, including Safari, Firefox, and mobile
- A clean balance between **user experience** and **enterprise-grade risk tolerance**

> In short: it’s a pragmatic default for secure SPAs delivered via CloudFront with Microsoft Entra SSO.
