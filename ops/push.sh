#!/bin/bash

set -xeo pipefail
[[ -f "aws-envs.sh" ]] && source aws-envs.sh

REALMDAO_IMAGE_NAME="realmdao_web"
BRANCH_NAME=$(echo "$CI_COMMIT_BRANCH" | sed -r "s,/,-,g")
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}"
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/realmdao-$AWS_ENV-repo-web"

build_image(){
    docker image build -f Dockerfile -t "${REALMDAO_IMAGE_NAME}:latest" --build-arg NODE_ENV=$NODE_ENV .
}

push_image() {
    aws ecr get-login-password --region $AWS_DEFAULT_REGION --profile realmdao-$AWS_ENV | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
    docker image tag "${REALMDAO_IMAGE_NAME}:latest" "${ECR_URL}:${image_tag}"
    docker image push "${ECR_URL}:${image_tag}" &
    fe_process=$! && echo $fe_process
    wait $fe_process
}

build_image
image_tag="$BRANCH_NAME-$(git rev-parse --short HEAD)"
push_image

cat <<EOT >> "aws-envs.sh"
export DOCKER_IMAGE="${ECR_URL}:${image_tag}"
export IMAGE_TAG="${image_tag}"
export AWS_ACCOUNT_ID="$AWS_ACCOUNT_ID"
export ECR_URL="$ECR_URL"
export AWS_REGION="$AWS_REGION"
export REALMDAO_IMAGE_NAME="$REALMDAO_IMAGE_NAME"
EOT