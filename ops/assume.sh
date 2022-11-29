#!/bin/bash

set -xeuo pipefail
set -u


if [[ "${CI_COMMIT_BRANCH}" == "develop" ]]; then
    aws_account_id="$AWS_ACCOUNT_ID_DEV"
    aws_env="dev"
    aws_iam_role_external_id="$AWS_IAM_ROLE_EXTERNAL_ID_DEV"
fi

if [[ "${CI_COMMIT_BRANCH}" == "staging" ]]; then
    aws_account_id="$AWS_ACCOUNT_ID_STG"
    aws_env="stg"
    aws_iam_role_external_id="$AWS_IAM_ROLE_EXTERNAL_ID_STG"
fi

if [[ "${CI_COMMIT_BRANCH}" == "main" ]]; then
    aws_account_id="$AWS_ACCOUNT_ID_PROD"
    aws_env="prod"
    aws_iam_role_external_id="$AWS_IAM_ROLE_EXTERNAL_ID_PROD"
fi
rm -rf ~/.aws/credentials


aws_sts_credentials="$(aws sts assume-role \
    --role-arn "arn:aws:iam::${aws_account_id}:role/GitlabCI-${aws_env}" \
    --role-session-name "$GITLAB_USER_LOGIN" \
    --external-id "$aws_iam_role_external_id" \
    --duration-seconds "1800" \
    --query "Credentials" \
    --output "json")"

aws configure --profile realmdao-${aws_env} << EOF
$(echo "$aws_sts_credentials" | jq -r '.AccessKeyId')
$(echo "$aws_sts_credentials" | jq -r '.SecretAccessKey')
ap-southeast-1
json
EOF

echo aws_session_token="$(echo "$aws_sts_credentials" | jq -r '.SessionToken')" >> ~/.aws/credentials
echo aws_expiration="$(echo "$aws_sts_credentials" | jq -r '.Expiration')" >> ~/.aws/credentials

echo $(pwd)

cat <<EOT > "aws-envs.sh"
export AWS_ACCESS_KEY_ID="$(echo "$aws_sts_credentials" | jq -r '.AccessKeyId')"
export AWS_SECRET_ACCESS_KEY="$(echo "$aws_sts_credentials" | jq -r '.SecretAccessKey')"
export AWS_SESSION_TOKEN="$(echo "$aws_sts_credentials" | jq -r '.SessionToken')"
export AWS_ACCOUNT_ID="$aws_account_id"
export AWS_DEFAULT_REGION="ap-southeast-1"
export AWS_ACCOUNT_ID="$aws_account_id"
export AWS_ENV="$aws_env"
EOT

source aws-envs.sh

ecs_cluster_name="$(aws ssm get-parameter --name /${aws_env}/ECS_CLUSTER_REALMDAO_NAME --profile realmdao-${aws_env} --with-decryption --query "Parameter"| jq -r '.Value' )" 
realmdao_service_name="$(aws ssm get-parameter --name /${aws_env}/REALMDAO_SERVICE_NAME --profile realmdao-${aws_env} --with-decryption --query "Parameter"| jq -r '.Value' )" 

cat <<EOT >> "aws-envs.sh"
export ECS_CLUSTER_NAME="$ecs_cluster_name"
export REALMDAO_SERVICE_NAME="$realmdao_service_name"
EOT

source aws-envs.sh

ls -la
