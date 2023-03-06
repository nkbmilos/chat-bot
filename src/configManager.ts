const getConfig = () => ({
  AWS_REGION: process.env.AWS_REGION || 'eu-west-1',
  BUCKET_NAME: process.env.BUCKET_NAME || 'csv-bucket',
  LOCAL_DYNAMODB_URL: process.env.LOCAL_DYNAMODB_URL || 'http://localhost:8009',
});

export default getConfig;
