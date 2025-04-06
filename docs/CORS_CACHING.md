Yes, if your API (Lambda function) is accessed from a **web browser** on a different domain (i.e., a **cross-origin** request), then **CORS (Cross-Origin Resource Sharing) headers** are still required. CORS headers are necessary to tell the browser that it is allowed to make requests to a different domain (or a different subdomain) and to handle the cross-origin requests securely.

### CORS Headers and CloudFront

In the context of using **CloudFront** to serve your Lambda-backed API, CORS headers will need to be properly configured to ensure that the browser can make successful requests to your API, especially if the API is being accessed from a different origin than the CloudFront distribution.

Here’s how CORS affects your API and how you can handle it in the context of a **Lambda function**:

### 1. **Lambda and CORS Configuration**
When the Lambda function is serving HTTP requests, CORS headers must be explicitly set in the Lambda response to allow or restrict cross-origin access. You’ll need to add the appropriate CORS headers like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.

For example, in Kotlin (assuming your Lambda is returning JSON data), the response headers would look something like this:

```kotlin
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent

class MyLambdaHandler : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    override fun handleRequest(
        input: APIGatewayProxyRequestEvent,
        context: Context
    ): APIGatewayProxyResponseEvent {
        // Sample response
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(mapOf(
                "Content-Type" to "application/json",
                "Access-Control-Allow-Origin" to "*", // Allow all domains (use more specific origins in production)
                "Access-Control-Allow-Methods" to "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers" to "Content-Type"
            ))
            .withBody("""{"message":"Hello from Lambda!"}""")
    }
}
```

- **`Access-Control-Allow-Origin`**: This header specifies which domains can access your API. Setting this to `*` allows any origin to access the API, but in production, you should set it to specific domains (e.g., `https://your-frontend-app.com`) to avoid security risks.
- **`Access-Control-Allow-Methods`**: This header specifies which HTTP methods are allowed (e.g., `GET`, `POST`, `OPTIONS`).
- **`Access-Control-Allow-Headers`**: This header specifies which request headers are allowed.

### 2. **Handling Preflight Requests (OPTIONS)**
In some cases, the browser may first send an **OPTIONS** request to the API to check if the server allows cross-origin requests before sending the actual request. This is known as a **preflight request**.

To handle **preflight requests**:
- You’ll need to add logic in your Lambda function to respond to **OPTIONS** requests.
- You also need to ensure that your API Gateway (if you're using it) or CloudFront correctly forwards the OPTIONS request to the Lambda function.

For example, here’s how you would handle the **OPTIONS** request in Kotlin:

```kotlin
if (input.httpMethod == "OPTIONS") {
    return APIGatewayProxyResponseEvent()
        .withStatusCode(200)
        .withHeaders(mapOf(
            "Access-Control-Allow-Origin" to "*",  // Allow all domains
            "Access-Control-Allow-Methods" to "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers" to "Content-Type"
        ))
        .withBody("")
}
```

### 3. **CloudFront and CORS**
When using **CloudFront** in front of your Lambda function, CloudFront will **cache the responses**, including the CORS headers. You need to ensure that:
- CloudFront **does not cache the preflight OPTIONS request**: You can configure CloudFront to **bypass cache for OPTIONS requests** or set the cache behavior for specific paths (e.g., `/api/*`) to forward headers like `Origin` and `Access-Control-Request-Method`.
- CloudFront **forwards the correct headers**: You must ensure CloudFront is configured to forward the `Origin` and `Access-Control-Request-Method` headers to the Lambda function.

For CloudFront, you can configure it to forward specific headers and query strings:

```hcl
resource "aws_cloudfront_distribution" "example" {
  # Other CloudFront configuration...

  default_cache_behavior {
    target_origin_id = "S3-your-bucket-name"
    
    # Forward specific headers like Origin and Access-Control-Request-Method
    allowed_headers = ["*"]
    cached_headers  = ["Origin"]
    
    # Enable to forward all headers from the request to the Lambda function
    forward_headers = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]

    # Cache based on query string if needed
    forward_query_string = true

    # Enable response header forwarding for CORS handling
    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = aws_lambda_function.edge_lambda.arn
      include_body = false
    }
  }

  # Other configurations...
}
```

### 4. **CloudFront Caching and CORS**
CloudFront’s caching mechanism can sometimes lead to caching issues with CORS headers, especially for **OPTIONS requests** and dynamic content that needs specific CORS headers. You need to:
- **Configure CloudFront to Forward CORS Headers**: In the **Cache Behavior** settings for your CloudFront distribution, ensure that it forwards the **CORS-related headers** like `Origin` and `Access-Control-Request-Method` to the Lambda function.
- **Invalidate Cache**: When you make changes to CORS headers or other content, you may need to invalidate CloudFront caches so that the updated headers are sent with the next request.

### 5. **Lambda Function Permissions**
Ensure that your Lambda function is set up with the right **permissions** to be triggered by CloudFront and to handle CORS-related requests.

```hcl
resource "aws_lambda_permission" "allow_cloudfront" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.edge_lambda.function_name
  principal     = "cloudfront.amazonaws.com"
  statement_id  = "AllowCloudFrontInvoke"
}
```

### Summary:
- **Yes**, your Lambda API will still require **CORS headers** if it is being accessed from a different origin (e.g., from a CloudFront distribution).
- You can handle CORS within the **Lambda function** by setting the necessary headers in the response, including `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.
- You also need to ensure that CloudFront is **configured to forward CORS-related headers** and **bypass caching for OPTIONS requests** to ensure that preflight requests are handled correctly.
- In **production**, be specific about the origins that are allowed to access your API, rather than using the wildcard `*`, to ensure the security of your application.