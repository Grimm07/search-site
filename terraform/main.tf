# Create S3 Bucket to store static website files (private access by default)
resource "aws_s3_bucket" "static_website" {
  bucket = "your-frontend-bucket"
}

resource "aws_s3_bucket_cors_configuration" "static_website_cors" {
  bucket = aws_s3_bucket.static_website.bucket

  cors_rule {
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]  # Adjust as needed for specific origins
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}


# Define the bucket's ACL using aws_s3_bucket_acl
resource "aws_s3_bucket_acl" "static_website_acl" {
  bucket = aws_s3_bucket.static_website.id
  acl    = "private"  # Set the desired ACL (e.g., private, public-read)
}

# Upload the frontend static files (Vite build output) to S3
resource "aws_s3_object" "index_html" {
  bucket = aws_s3_bucket.static_website.bucket
  key    = "index.html"
  acl    = "private"  # More secure, control access via policies
  source = "dist/index.html"  # Vite build output
}

# Upload other assets like JS, CSS, images, etc. (adjust paths to match your Vite build)
resource "aws_s3_object" "bundle_js" {
  bucket = aws_s3_bucket.static_website.bucket
  key    = "assets/bundle.js"  # Vite build output
  acl    = "private"  # More secure, control access via policies
  source = "dist/assets/bundle.js"  # Update with your Vite build output path
}

resource "aws_s3_object" "main_css" {
  bucket = aws_s3_bucket.static_website.bucket
  key    = "assets/main.css"  # Update for your Vite build output
  acl    = "private"  # More secure, control access via policies
  source = "dist/assets/main.css"  # Update with your Vite build output path
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name = "oac-for-your-frontend-bucket"
  description = "OAC for secure access to S3 bucket"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}


resource "aws_cloudfront_distribution" "frontend_distribution" {
  origin {
    domain_name = aws_s3_bucket.static_website.bucket_regional_domain_name
    origin_id   = "S3-your-frontend-bucket"

    s3_origin_config {
      origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Frontend CloudFront Distribution"
  price_class         = "PriceClass_100"
  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id       = "S3-your-frontend-bucket"
    viewer_protocol_policy = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_policy.id
    allowed_methods {
      items = ["GET", "HEAD", "OPTIONS"]
    }
    cached_methods {
      items = ["GET", "HEAD"]
    }
    compress = true
    headers = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    ssl_support_method             = "sni-only"
  }
}

resource "aws_cloudfront_response_headers_policy" "cors_policy" {
  name = "CORSPolicy"
  security_headers_config {
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override = true
    }
    referrer_policy {
      referrer_policy = "no-referrer"
      override = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override = true
    }
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains = true
      preload = true
      override = true
    }
    content_security_policy {
      content_security_policy = "default-src 'self';"
      override = true
    }
  }
}
