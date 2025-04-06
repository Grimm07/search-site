# project_architecture_diagram.py
# Architecture diagram using diagrams library for a modern React + AWS app

from diagrams import Diagram, Cluster
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.storage import S3
from diagrams.aws.devtools import CodePipeline
from diagrams.aws.management import Cloudwatch
from diagrams.aws.analytics import OpenSearchService
from diagrams.onprem.ci import GitlabCI
from diagrams.programming.framework import React
from diagrams.generic.database import SQL
from diagrams.generic.blank import Blank
from diagrams.saas.identity import Auth0

with Diagram("React + AWS Architecture", show=False, direction="LR"):

    # Frontend Block
    with Cluster("Frontend"):
        react_ui = React("React + MUI")
        zustand = Blank("Zustand Slices")
        msal_auth = Auth0("MSAL (Microsoft Entra ID)")

    # Dev Tools
    dev_panel = Blank("Dev Panel / Mocking (MSW)")

    # API Backend
    with Cluster("AWS Lambda API"):
        api_gateway = APIGateway("API Gateway")
        lambda_fn = Lambda("Lambda (Kotlin JVM 11)")
        s3 = S3("S3 for files")
        opensearch = OpenSearchService("OpenSearch Logs")

    # CI/CD & Monitoring
    with Cluster("CI/CD & Monitoring"):
        gitlab = GitlabCI("GitLab CI")
        deploy = CodePipeline("Terraform Deploy")
        logs = Cloudwatch("CloudWatch")

    # Content Delivery
    cdn = CloudFront("CloudFront")

    # Connections
    react_ui >> zustand >> [msal_auth, dev_panel] >> api_gateway
    api_gateway >> lambda_fn
    lambda_fn >> [s3, opensearch, logs]
    gitlab >> deploy >> lambda_fn
    react_ui >> cdn >> api_gateway
