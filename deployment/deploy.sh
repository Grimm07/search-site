echo "Deploying components..."
COMPONENTS=("projectA" "projectB")  # List all your projects here

for project in "${COMPONENTS[@]}"; do
  echo "Deploying $project..."

  # Check if the environment variable is set, if not, use default (staging)
  TARGET_ENV=${CI_COMMIT_REF_NAME:-staging}  # Default to 'staging' if no env is provided
  echo "Deploying to $TARGET_ENV environment..."

  # Execute the deploy script
  bash $DEPLOY_SCRIPT_PATH --project $project --env $TARGET_ENV --version $CI_COMMIT_REF_NAME

  if [ $? -ne 0 ]; then
    echo "Deployment of $project to $TARGET_ENV failed. Retrying..."
    exit 1  # If a deployment fails, it will retry based on retry configuration
  fi
done