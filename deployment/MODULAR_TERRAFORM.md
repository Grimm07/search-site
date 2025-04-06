# Step-by-Step Guide to Set Up a Modular Terraform Deployment Project

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Directory Structure](#directory-structure)
4. [Create Terraform Modules](#create-terraform-modules)
    - [S3 Bucket Module](#s3-bucket-module)
    - [EC2 Instance Module](#ec2-instance-module)
    - [IAM Role Module](#iam-role-module)
5. [Environment Configuration](#environment-configuration)
    - [Staging Environment](#staging-environment)
    - [Production Environment](#production-environment)
6. [Main Terraform Configuration](#main-terraform-configuration)
7. [Set Up GitLab Deployment Pipeline](#set-up-gitlab-deployment-pipeline)
8. [Deploying the Infrastructure](#deploying-the-infrastructure)
9. [Managing and Troubleshooting](#managing-and-troubleshooting)
    - [Common Pitfalls](#common-pitfalls)
10. [Conclusion](#conclusion)

---

## 1. Overview

This guide walks you through setting up a **modular Terraform deployment project** for deploying separate projects with reusable components (like S3, EC2, and IAM roles). We'll use GitLab CI/CD for managing deployments, with manual approval workflows for staging and production environments. The goal is to create a clean, maintainable, and scalable infrastructure setup.

---

## 2. Prerequisites

Before setting up this deployment project, ensure that the following tools and configurations are in place:

- **Terraform**: Ensure Terraform is installed on your local machine or CI/CD pipeline.
- **AWS CLI**: Install and configure AWS CLI for managing AWS resources.
- **GitLab Project**: Create a GitLab project with CI/CD enabled.
- **GitLab Premium** (for protected environments and deployment approvals).
- **IAM Role Permissions**: Ensure the AWS IAM role used by Terraform has sufficient permissions for creating resources (e.g., S3, EC2, IAM roles).

---

## 3. Directory Structure

We will use a modular structure for the Terraform configuration:

```plaintext
terraform-deployment/
├── modules/
│   ├── s3_bucket/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ec2_instance/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── iam_role/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   └── variables.tf
│   ├── production/
│   │   ├── main.tf
│   │   └── variables.tf
├── main.tf
└── variables.tf
```

- **modules/**: Contains reusable components like S3, EC2, and IAM roles.
- **environments/**: Contains the configurations for staging and production environments.
- **main.tf**: The root configuration that ties everything together.
- **variables.tf**: Defines the project-wide variables.

---

## 4. Create Terraform Modules

We'll define reusable Terraform modules for each infrastructure component.

### S3 Bucket Module

**Path:** `modules/s3_bucket/main.tf`

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
  acl    = "private"

  tags = {
    Name = var.bucket_name
  }
}
```

**Variables (`modules/s3_bucket/variables.tf`)**:

```hcl
variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}
```

**Outputs (`modules/s3_bucket/outputs.tf`)**:

```hcl
output "bucket_name" {
  value = aws_s3_bucket.bucket.bucket
}
```

### EC2 Instance Module

**Path:** `modules/ec2_instance/main.tf`

```hcl
resource "aws_instance" "app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type

  tags = {
    Name = var.instance_name
  }
}
```

**Variables (`modules/ec2_instance/variables.tf`)**:

```hcl
variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "Instance type for the EC2 instance"
  default     = "t2.micro"
  type        = string
}

variable "instance_name" {
  description = "Name of the EC2 instance"
  type        = string
}
```

**Outputs (`modules/ec2_instance/outputs.tf`)**:

```hcl
output "instance_id" {
  value = aws_instance.app_server.id
}
```

### IAM Role Module

**Path:** `modules/iam_role/main.tf`

```hcl
resource "aws_iam_role" "app_role" {
  name               = var.role_name
  assume_role_policy = var.assume_role_policy
}
```

**Variables (`modules/iam_role/variables.tf`)**:

```hcl
variable "role_name" {
  description = "Name of the IAM role"
  type        = string
}

variable "assume_role_policy" {
  description = "The assume role policy document"
  type        = string
}
```

**Outputs (`modules/iam_role/outputs.tf`)**:

```hcl
output "role_name" {
  value = aws_iam_role.app_role.name
}
```

---

## 5. Environment Configuration

### Staging Environment

**Path:** `environments/staging/main.tf`

```hcl
module "s3_bucket" {
  source      = "../../modules/s3_bucket"
  bucket_name = "staging-app-bucket"
}

module "ec2_instance" {
  source        = "../../modules/ec2_instance"
  ami_id        = "ami-12345678"
  instance_type = "t2.micro"
  instance_name = "staging-app-server"
}

module "iam_role" {
  source     = "../../modules/iam_role"
  role_name  = "staging-app-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}
```

### Production Environment

**Path:** `environments/production/main.tf`

```hcl
module "s3_bucket" {
  source      = "../../modules/s3_bucket"
  bucket_name = "production-app-bucket"
}

module "ec2_instance" {
  source        = "../../modules/ec2_instance"
  ami_id        = "ami-87654321"
  instance_type = "t2.medium"
  instance_name = "production-app-server"
}

module "iam_role" {
  source     = "../../modules/iam_role"
  role_name  = "production-app-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}
```

---

## 6. Main Terraform Configuration

**Path:** `main.tf`

```hcl
provider "aws" {
  region = "us-east-1"
}

module "staging" {
  source = "./environments/staging"
}

module "production" {
  source = "./environments/production"
}
```

---

## 7. Set Up GitLab Deployment Pipeline

To trigger deployments via GitLab CI/CD, use the `.gitlab-ci.yml` file. This configuration triggers the deployment process on successful builds, using the **Terraform modules** you created.

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - echo "Building the project..."
  artifacts:
    paths:
      - build/

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    - terraform init
    - terraform apply -var-file=staging.tfvars
  environment:
    name: staging
  when: manual
  allow_failure: false

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - terraform init
    - terraform apply -var-file=production.tfvars
  environment:
    name: production
  when: manual
  allow_failure: false
```

### Explanation:
- **Terraform commands** are used in the `script` section to initialize the configuration (`terraform init`) and apply the infrastructure changes (`terraform apply`).
- **Manual deployment** for both staging and production allows approvers to approve deployments before they occur.

---

## 8. Deploying the Infrastructure

1. **Initialize Terraform**: Run `terraform init` to initialize the project.
2. **Plan Deployment**: Run `terraform plan` to preview the changes that will be applied.
3. **Apply Configuration**: Run `terraform apply` to apply the infrastructure changes.

---

## 9. Managing and Troubleshooting

### Common Pitfalls

1. **Missing Variables**: Ensure that variables for your environments are set correctly. Use `terraform.tfvars` to define environment-specific variables.

2. **IAM Role Permissions**: The IAM role used by Terraform must have sufficient permissions to create and modify the resources defined in the modules (e.g., EC2, S3, IAM roles).

3. **State Management**: When managing multiple environments, use **remote backends** (e.g., S3 with DynamoDB for locking) to avoid conflicts and ensure consistency in state files.

4. **Incorrect Configuration in Modules**: Double-check the inputs and outputs of your modules. Ensure they are correctly referenced in each environment file.

### Debugging Tips:
- **Terraform Logs**: Check the Terraform plan and apply logs for detailed error messages.
- **GitLab Pipeline Logs**: Review the GitLab CI/CD pipeline logs to identify issues during the