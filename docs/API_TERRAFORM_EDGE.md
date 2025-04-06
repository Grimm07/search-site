To deploy an **AWS Lambda@Edge function** using **Terraform**, you need to set up several resources in your Terraform configuration. This includes:

1. **Lambda Function**: The actual Lambda function that will be deployed to AWS.
2. **IAM Role**: The IAM role that the Lambda function will use to execute.
3. **CloudFront Distribution**: The CloudFront distribution that will associate the Lambda function at the edge.
4. **Lambda@Edge**: To configure Lambda@Edge with CloudFront.

Here’s a basic **Terraform script** to deploy an **API Lambda@Edge** that gets triggered via CloudFront. The Lambda will be associated with a **CloudFront distribution** at the `ViewerRequest` or `ViewerResponse` stage.

### Terraform Script to Deploy Lambda@Edge

```hcl
# Provider setup for AWS
provider "aws" {
  region = "us-east-1"  # Lambda@Edge must be created in us-east-1 (N. Virginia)
}

# Create an IAM Role for Lambda execution
resource "aws_iam_role" "lambda_role" {
  name = "lambda-edge-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic Lambda execution policy to the role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Create the Lambda function (your Lambda code should be packaged and uploaded to an S3 bucket)
resource "aws_lambda_function" "edge_lambda" {
  function_name = "edge-lambda"

  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"  # Choose the runtime based on your Lambda function (e.g., nodejs14.x, python3.8, etc.)
  memory_size   = 128
  timeout       = 5

  # Your Lambda function code should be zipped and uploaded to S3 (or you can use a local path)
  s3_bucket = "your-s3-bucket"  # Update with the S3 bucket where your Lambda zip is stored
  s3_key    = "lambda-code.zip" # Update with the key for the Lambda zip

  # The Lambda function must be created in us-east-1 for Lambda@Edge
  provider = aws.us_east_1
}

# Create CloudFront Distribution (or use an existing one)
resource "aws_cloudfront_distribution" "example" {
  origin {
    domain_name = "your-origin-domain-name.amazonaws.com"
    origin_id   = "S3-your-bucket-name"
  }

  enabled = true

  default_cache_behavior {
    target_origin_id = "S3-your-bucket-name"

    viewer_protocol_policy = "redirect-to-https"

    # CloudFront will invoke the Lambda function at the viewer request stage
    lambda_function_association {
      event_type   = "viewer-request" # Use viewer-response for after request is served
      lambda_arn   = aws_lambda_function.edge_lambda.arn
      include_body = false
    }
  }

  price_class = "PriceClass_100"
}

# Lambda@Edge requires the Lambda function to be replicated to other regions for edge deployment
resource "aws_lambda_permission" "allow_cloudfront" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.edge_lambda.function_name
  principal     = "cloudfront.amazonaws.com"
  statement_id  = "AllowCloudFrontInvoke"
}

# Create Lambda@Edge replication (deploy Lambda to edge locations)
resource "aws_cloudfront_distribution" "lambda_edge" {
  depends_on = [aws_lambda_function.edge_lambda]  # Ensure Lambda is created first

  # Lambda@Edge requires the Lambda to be deployed from N. Virginia (us-east-1) for replication
  function_association {
    event_type   = "viewer-request"  # You can use other event types as needed (e.g., viewer-response)
    lambda_arn   = aws_lambda_function.edge_lambda.arn
    include_body = false
  }

  # Your CloudFront configuration
  origin {
    domain_name = "your-origin-domain-name.amazonaws.com"
    origin_id   = "S3-your-bucket-name"
  }

  enabled = true
  default_cache_behavior {
    target_origin_id = "S3-your-bucket-name"
    viewer_protocol_policy = "redirect-to-https"
  }

  # Lambda@Edge function will be automatically deployed and replicated across CloudFront edge locations.
  price_class = "PriceClass_100"
}
```

### Explanation:

1. **IAM Role for Lambda**:
    - `aws_iam_role.lambda_role` creates an IAM role that grants Lambda permission to execute. It uses the basic `AWSLambdaBasicExecutionRole` policy for logging and other necessary permissions.

2. **Lambda Function**:
    - `aws_lambda_function.edge_lambda` creates the actual Lambda function. You need to specify the **S3 bucket** and **S3 key** for the Lambda code (this code needs to be packaged as a `.zip` and stored in an S3 bucket).
    - **Runtime**: Choose the runtime (`nodejs14.x`, `python3.8`, etc.) based on your Lambda function code.
    - **Lambda Function Location**: You need to create the Lambda in **us-east-1** (N. Virginia) because **Lambda@Edge** requires this region for deployment.

3. **CloudFront Distribution**:
    - `aws_cloudfront_distribution.example` is an example CloudFront distribution where we define the origin (your S3 bucket or another origin), and the caching behavior.
    - The `lambda_function_association` field connects the Lambda function to the CloudFront distribution, specifying the `event_type` as **"viewer-request"**, meaning the Lambda will be triggered **before** the request reaches your origin.

4. **Lambda Permissions**:
    - `aws_lambda_permission.allow_cloudfront` ensures that CloudFront can invoke your Lambda function.

5. **Deploy Lambda to Edge**:
    - `aws_cloudfront_distribution.lambda_edge` replicates your Lambda function to **Lambda@Edge**. The function is deployed to CloudFront edge locations, making it available globally for handling requests.

### 3. **Deploying Lambda@Edge**:
- **Lambda@Edge** replicates your function to AWS edge locations globally once it is associated with a CloudFront distribution. This ensures that the Lambda function is run at the edge locations nearest to the user, which **reduces latency** significantly.
- You can use event types like **viewer-request**, **viewer-response**, **origin-request**, and **origin-response** to control when your Lambda is triggered:
    - **Viewer Request**: Before CloudFront forwards the request to your origin.
    - **Viewer Response**: After CloudFront gets the response from the origin and before returning it to the viewer.
    - **Origin Request**: Before CloudFront sends the request to the origin.
    - **Origin Response**: After the origin sends the response but before CloudFront caches it.

### 4. **Lambda Function at Edge - Considerations**:
- **Cold Starts**: Lambda@Edge functions might experience cold starts, so it’s essential to **minimize the size** of your Lambda function and **optimize the execution** (e.g., by keeping the handler lightweight).
- **IAM Role Permissions**: Ensure your Lambda’s IAM role has sufficient permissions for reading from other AWS services if needed (e.g., S3, DynamoDB).

### 5. **Caching in CloudFront**:
CloudFront has powerful caching mechanisms that can be configured to cache responses closer to the user. You can configure **TTL (Time-to-Live)** for cached content and specify **cache behaviors** for specific file types or paths.

- You can also **invalidate caches** to ensure content is updated when you want. You may trigger an invalidation of CloudFront caches when the content on S3 changes.

```hcl
# Create CloudFront Cache Invalidation
resource "aws_cloudfront_distribution" "example" {
  # Configuration as before

  # CloudFront Cache Invalidation
  resource "aws_cloudfront_cache_invalidation" "invalidate_cache" {
    distribution_id = aws_cloudfront_distribution.example.id
    paths           = ["/*"] # Invalidate all paths, or specify paths
  }
}
```

### 6. **Conclusion**:
This Terraform script will deploy a **Lambda@Edge function** that gets triggered by **CloudFront**, allowing you to execute logic at the edge and reduce latency for your users. It integrates with **S3** for storage and enables you to take advantage of **Lambda's global distribution** across edge locations to optimize performance.

- **Optimize for Caching**: Ensure appropriate cache policies are set to minimize API calls and latency.
- **Ensure Lambda is Lightweight**: Minimize cold starts by keeping the Lambda small and efficient.
- **Granular Control**: Use IAM roles and policies to manage permissions effectively, ensuring that only authorized actions are allowed.

