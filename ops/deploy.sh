#!/usr/bin/env bash
set -xeuo pipefail

source aws-envs.sh

rm -rf web.txt || true

ECS_TASK_FAMILY=realmdao-${AWS_ENV}-ecs-task-web

#Get current task definition arn before deploy to rollback purback
CURRENT_TASK_DEFINITION_ARN=$(aws ecs describe-services --cluster $ECS_CLUSTER_NAME --services $REALMDAO_SERVICE_NAME --query 'services[*].taskDefinition' --output text --region $AWS_DEFAULT_REGION)

#Get log stream prefix
CURRENT_LOG_STREAM_PREFIX=$(aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY} --region ${AWS_DEFAULT_REGION} --query 'taskDefinition.containerDefinitions[0].logConfiguration.options' | jq -r '.["awslogs-stream-prefix"]')

#Create task definition with new log stream
CONTAINER_DEFINITION_JSON=$(aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY} --region ${AWS_DEFAULT_REGION} --query 'taskDefinition.containerDefinitions[]' | sed "s/${CURRENT_LOG_STREAM_PREFIX}/${IMAGE_TAG}/")
#Get temporary revision number
TEMP_REVISION=$(aws ecs describe-services --cluster $ECS_CLUSTER_NAME --services $REALMDAO_SERVICE_NAME --region $AWS_DEFAULT_REGION --query 'services[*].taskDefinition' --output text | awk -F: '{print $7}')

#Register new task definition
aws ecs register-task-definition --family ${ECS_TASK_FAMILY} --container-definitions "${CONTAINER_DEFINITION_JSON}" \
--execution-role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_DEFAULT_REGION}-realmdao-${AWS_ENV}-ecs-execution-task-role \
--task-role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_DEFAULT_REGION}-realmdao-${AWS_ENV}-ecs-task-role \
--requires-compatibilities EC2 \
--region ${AWS_DEFAULT_REGION} --profile realmdao-${AWS_ENV}

#Deploy with latest task definition, it will create newer revision of task definition
docker run --env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} --env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} --env AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN} fabfuel/ecs-deploy:1.10.0 ecs deploy ${ECS_CLUSTER_NAME} ${REALMDAO_SERVICE_NAME} --task ${ECS_TASK_FAMILY} --region ${AWS_DEFAULT_REGION} \
--exclusive-env \
--timeout 900 \
--command web "" \
-t $IMAGE_TAG || echo $? > web.txt

if [[ -f web.txt ]];
then
    echo "Deploy service fails. Rollback:"
    docker run --env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} --env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} --env AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN} fabfuel/ecs-deploy:1.10.0 ecs deploy ${ECS_CLUSTER_NAME} ${REALMDAO_SERVICE_NAME} --task ${CURRENT_TASK_DEFINITION_ARN} --region ${AWS_DEFAULT_REGION}
    exit 1
else
    echo "Deployed Successful"
    echo "Deregister TEMP_REVISION"
    aws ecs deregister-task-definition --task-definition "${ECS_TASK_FAMILY}:${TEMP_REVISION}" --region ${AWS_DEFAULT_REGION} --profile realmdao-$AWS_ENV  > /dev/null
fi
