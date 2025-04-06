resource "aws_sns_topic" "approval_notifications" {
  name = "manual-approval-notifications"
}

resource "aws_codepipeline" "release_pipeline" {
  name     = "frontend-release"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeCommit" # or GitHub/GitLab
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        RepositoryName = "your-repo"
        BranchName     = "main"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]

      configuration = {
        ProjectName = aws_codebuild_project.build_project.name
      }
    }
  }

  stage {
    name = "Approval"

    action {
      name             = "ManualApproval"
      category         = "Approval"
      owner            = "AWS"
      provider         = "Manual"
      version          = "1"
      input_artifacts  = []
      output_artifacts = []

      configuration = {
        NotificationArn = aws_sns_topic.approval_notifications.arn
        CustomData      = "Please enter the change request ID in the comments. Link to Jira: https://jira.company.com/browse/CR-XXXX"
        ExternalEntityLink = "https://gitlab.company.com/your-project/merge_requests"
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "DeployToS3"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "S3"
      version         = "1"
      input_artifacts = ["build_output"]

      configuration = {
        BucketName = aws_s3_bucket.frontend_bucket.bucket
        Extract    = "true"
      }
    }
  }
}
