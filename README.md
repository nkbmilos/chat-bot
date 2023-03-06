# chat-bot

# starting in offline mode
sls offline start --noPrependStageInUrl --host 0.0.0.0 --httpPort 4361
# create bucket in offline s3
awslocal s3api create-bucket --bucket csv-bucket
# starting localstack
docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
# DynamoDb UI
DYNAMO_ENDPOINT=http://localhost:8009 dynamodb-admin
# Triggering postprocess event in localstack:
aws --endpoint http://localhost:4569 s3 cp test.csv s3://csv-bucket/test.csv --profile s3local
upload: ./test.csv to s3://csv-bucket/test.csv 


