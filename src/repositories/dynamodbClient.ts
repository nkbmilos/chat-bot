import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import getLogger from '../logger';
import getConfig from '../configManager';

const logger = getLogger('dynamodbClient');

const region: string = getConfig().AWS_REGION;
const localDynamoDbUrl: string = getConfig().LOCAL_DYNAMODB_URL;
let config: DynamoDBClientConfig = { region };

if (localDynamoDbUrl !== '') {
  logger.info(`Local dynamoDb url found - ${localDynamoDbUrl}`);
  const localConfig = {
    ...config,
    endpoint: localDynamoDbUrl,
    credentials: {
      accessKeyId: 'dummyKeyId',
      secretAccessKey: 'dummyKey',
    },
  };

  config = localConfig;
}

export const client: DynamoDBClient = new DynamoDBClient(config);
