
## 🧭 Goal

- Replace your current JSON response API with a **binary streaming response** from S3.
- Ensure the **S3 image files remain private**.
- Allow your **React frontend (hosted via CloudFront)** to consume the image via a standard `<img>` or viewer (e.g. OpenSeadragon).

---

## ✅ Summary of Design

| Component           | Change Required                                   |
|---------------------|----------------------------------------------------|
| **Lambda (Kotlin)** | Switch from returning JSON to returning image as base64 |
| **API Gateway**     | Enable binary media types (e.g. `image/jpeg`)     |
| **S3**              | Keep private, only Lambda has read access         |
| **Frontend**        | Use image URL pointing to your API (`/image/{id}`) |

---

## ✅ Lambda Conversion: JSON → Image Streaming

### 🔹 Original (Simplified)
```kotlin
return APIGatewayProxyResponseEvent()
    .withStatusCode(200)
    .withHeaders(mapOf("Content-Type" to "application/json"))
    .withBody("{ \"url\": \"https://s3...\" }")
```

### 🔹 New (Streaming from S3)
```kotlin
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import java.util.Base64

class ImageLambdaHandler : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private val s3 = S3Client.create()

    override fun handleRequest(
        request: APIGatewayProxyRequestEvent,
        context: Context
    ): APIGatewayProxyResponseEvent {
        val imageId = request.pathParameters?.get("id")
            ?: return errorResponse(400, "Missing image ID")

        val key = "images/$imageId.jpg" // adjust if needed
        val bucket = "your-private-s3-bucket"

        return try {
            val s3Object = s3.getObject(
                GetObjectRequest.builder().bucket(bucket).key(key).build()
            )

            val imageBytes = s3Object.readBytes()
            val base64 = Base64.getEncoder().encodeToString(imageBytes)

            APIGatewayProxyResponseEvent()
                .withStatusCode(200)
                .withIsBase64Encoded(true)
                .withHeaders(
                    mapOf(
                        "Content-Type" to "image/jpeg",
                        "Content-Disposition" to "inline"
                    )
                )
                .withBody(base64)

        } catch (e: Exception) {
            context.logger.log("Error fetching image: ${e.message}")
            errorResponse(500, "Could not load image")
        }
    }

    private fun errorResponse(code: Int, message: String): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(code)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody("""{"error":"$message"}""")
    }
}
```

---

## ✅ API Gateway Configuration

In the AWS Console for your **API Gateway**:

1. **Enable binary support**:
    - Go to your API → Settings
    - Add binary media types:
      ```
      image/jpeg
      image/png
      image/webp
      ```

2. **Enable Lambda Proxy Integration**:
    - Confirm integration type for the route is `Lambda Proxy`.

3. **Deploy** the API again for changes to take effect.

---

## ✅ IAM Role for Lambda

Ensure your Lambda execution role allows `s3:GetObject`:

```json
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::your-private-s3-bucket/images/*"
}
```

---

## ✅ Frontend Integration (React)

Update your frontend to **use the streaming endpoint directly**:

```tsx
const imageUrl = `https://api.yourdomain.com/image/${imageId}`;
return <img src={imageUrl} alt="Image preview" />;
```

### Optional: Convert response to a blob if you want control:
```tsx
const res = await fetch(imageUrl);
const blob = await res.blob();
const objectUrl = URL.createObjectURL(blob);

return <img src={objectUrl} />;
```

This also works with OpenSeadragon if the API streams tiles or a `.dzi` file using signed or proxied URLs.

---

## ✅ Benefits

| Feature               | Result                                      |
|------------------------|---------------------------------------------|
| Secure S3              | No public bucket or signed URLs needed      |
| Streamed content       | Efficient, low-latency delivery via base64  |
| Authz checks (optional)| You control access in Lambda                |
| CloudFront friendly    | No direct S3 exposure to the browser        |

---

## 🧪 Optional Enhancements

- Add **cache-control headers**:
  ```kotlin
  "Cache-Control" to "max-age=3600"
  ```
- Compress or resize images dynamically via AWS Lambda (using libraries like `java-image-scaling` or native support via `Sharp` in other runtimes)
- Support **OpenSeadragon tiles** or `.dzi` XML structure via routing logic in the same Lambda handler

---

## ✅ Recap: Conversion Steps

1. 🔁 Replace JSON response with base64 image in Kotlin
2. 🔐 Make sure Lambda has `s3:GetObject` permission
3. ⚙️ Configure API Gateway for binary support
4. 🌐 Use API route in frontend as an `<img src=... />`
5. ✅ Done — image now securely streams through your API

---

Let me know if you’d like:
- A **Terraform/CDK** config for S3/Lambda/API Gateway
- A **Ktor-style handler** if you're using a custom Lambda runtime
- A version for streaming `.dzi` tile responses for OpenSeadragon

Happy to walk you through deployment integration as well.