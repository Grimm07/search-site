If you're currently using **API Gateway JWT token validation** for authenticating every request from the UI, and you are considering moving to **Lambda@Edge** for authentication, there will be several **architectural implications** and changes to how your system operates. Let's explore how the move to **Lambda@Edge** would affect your current architecture, particularly in terms of **authentication**, **security**, and **token validation**.

### Current Architecture with API Gateway JWT Token Validation:

In your current setup, **API Gateway** is responsible for validating the JWT tokens for each request. The flow typically looks like this:
1. **UI sends a request** to the API, with the JWT token attached in the **Authorization header**.
2. **API Gateway** checks the JWT token in the **Authorization header** using a **JWT Authorizer**.
3. If the token is valid, the request is forwarded to your **Kotlin-based API** Lambda function.
4. If the token is invalid, API Gateway returns a **401 Unauthorized** response.

This architecture ensures that all requests are authenticated centrally at **API Gateway** before they hit the backend, which simplifies the design and keeps the security validation at a single point.

### Moving to Lambda@Edge: Changes to the Architecture

When you move to **Lambda@Edge**, the following changes will impact your architecture:

#### 1. **JWT Validation at the Edge**
In the current setup, **API Gateway** is performing the JWT validation before passing the request to the backend. If you move to **Lambda@Edge**:
- **Lambda@Edge** will now validate the JWT token **before the request reaches the origin (your API)**. This means authentication is handled closer to the user, reducing **latency** by running at **CloudFront edge locations**.
- However, unlike **API Gateway's JWT Authorizer**, **Lambda@Edge** does not natively support JWT validation, so you’ll have to implement the logic for **token validation** yourself.

#### How would this work?
1. The **client** sends a request to CloudFront (which acts as the reverse proxy).
2. **Lambda@Edge** is triggered during the **Viewer Request** or **Viewer Response** phase to **validate the JWT token**.
3. If the token is valid, the request proceeds to your **origin** (i.e., your **Kotlin Lambda API**).
4. If the token is invalid, **Lambda@Edge** returns a **401 Unauthorized** response, and the request doesn’t reach your origin API.

**Token Validation with Lambda@Edge**:
- You’ll need to extract the JWT token from the **Authorization header** in the request.
- Use a **public key** or **JWKS (JSON Web Key Set)** from your **identity provider (IDP)** (e.g., Azure AD) to **verify the token**.
- You may also need to handle **token expiration** and other validation logic (e.g., audience, issuer, and signature checks).

#### Example of Lambda@Edge (Node.js) JWT Validation:
```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: 'https://login.microsoftonline.com/{tenantId}/discovery/v2.0/keys'
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const token = headers['authorization'] ? headers['authorization'][0].value.split(' ')[1] : null;

    if (!token) {
        return {
            status: '401',
            statusDescription: 'Unauthorized',
            body: 'No authorization token provided',
        };
    }

    try {
        // Validate the token
        const decoded = jwt.verify(token, getKey);
        return request;  // Proceed if token is valid
    } catch (error) {
        return {
            status: '401',
            statusDescription: 'Unauthorized',
            body: 'Invalid or expired token',
        };
    }
};
```

In this scenario, **Lambda@Edge** performs the token validation before the request reaches the backend.

#### 2. **Impact on API Gateway and Authorization Flow**
If you decide to **move authentication to Lambda@Edge**, there are a few key considerations:

- **No Need for API Gateway JWT Authorizer**: If you validate the JWT token at the edge, **API Gateway's JWT Authorizer** becomes redundant. You no longer need API Gateway to validate tokens because **Lambda@Edge** will handle it.

- **Custom Authorization Lambda**: Your current **upstream authorization Lambda** (used by API Gateway) would either:
    - Be replaced entirely by **Lambda@Edge** for token validation at the edge, or
    - Continue to be used for more **complex** or **backend-specific** validation (e.g., checking user roles, scopes, or querying external services for user information). In this case, your **backend Lambda function** (Kotlin-based) would still handle the business logic, but the edge Lambda takes care of authentication.

#### 3. **Security Considerations**
Moving authentication to Lambda@Edge has certain **security implications**:
- **Public Key Access**: Lambda@Edge needs to fetch the public keys (for JWT signature verification) from the **JWKS endpoint** of your **identity provider** (e.g., Azure AD). This introduces a potential risk if the **JWKS endpoint** is not publicly accessible or if there are latency issues fetching the keys.
- **Token Validation at the Edge**: By validating tokens at the edge, unauthorized requests are blocked before reaching your origin, reducing load on your backend services.
- **Sensitive Data Handling**: If your authentication logic requires handling **sensitive data** (like **client secrets**), be cautious when working with Lambda@Edge, as these functions run in **multiple global regions**.

#### 4. **Edge Lambda Performance Constraints**
- **Resource Limits**: Lambda@Edge functions have resource limits, including execution time (max 5 seconds) and memory (up to 3GB). Complex authentication processes that involve multiple external API calls (such as querying multiple identity providers or validating large JWT tokens) could exceed these limits.
- **Cold Starts**: Lambda@Edge functions can experience **cold starts**, particularly when the edge location is not warm. While CloudFront caches the function, first-time invocations or infrequent requests could incur additional latency.

#### 5. **Error Handling and Logging**
- **Error Handling**: You will need to handle errors gracefully. For example, if the token is expired, invalid, or missing, you should return a **401 Unauthorized** response with an appropriate error message.
- **Logging**: Use **CloudWatch Logs** for logging Lambda execution details (such as token validation successes or failures) and any security incidents. CloudFront also has **access logs** that can help track the requests coming through your distribution.

---

### 6. **Diagram of the New Architecture**:

Here’s how the flow changes with **Lambda@Edge**:

1. **UI sends a request** to **CloudFront** (which acts as the reverse proxy).
2. **Lambda@Edge** is invoked at the **Viewer Request** or **Viewer Response** phase to validate the **JWT token** from the **Authorization header**.
    - If valid, the request is forwarded to the backend (your **Kotlin API Lambda**).
    - If invalid, the request is immediately **blocked** with a **401 Unauthorized** response.
3. **CloudFront** caches the response (if allowed).
4. **API Gateway** may no longer be required for JWT validation, but could still be used for other functions (e.g., rate limiting, request validation).

### 7. **Summary of Architectural Changes**:

- **JWT validation**: Moved from API Gateway to **Lambda@Edge**, enabling lower-latency authentication and offloading the backend services.
- **API Gateway JWT Authorizer**: Likely unnecessary unless you still need to perform additional backend validation.
- **Lambda@Edge**: Handles the **authentication** at the edge, reducing load on your backend and ensuring that unauthorized requests are blocked before they reach the API.
- **Security**: You must ensure that **public keys** for token validation (e.g., Azure JWKS) are accessible and that any sensitive data (like secrets) is securely managed.
- **Edge Function Constraints**: Ensure that your authentication logic is lightweight and that you stay within the **execution time and memory limits** of Lambda@Edge.

In conclusion, moving to **Lambda@Edge** for authentication can significantly reduce **latency** and improve **performance** by validating tokens closer to the user, but you need to carefully consider **security** and **resource limits** while implementing this architecture.