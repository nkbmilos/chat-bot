import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {toResponse} from "../helpers";
import {getAll} from "../repositories/dynamoDbRepository";

const getAllHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const conversations = await getAll('Conversations')
    return toResponse(200, {message: 'ok', conversations});
};
export const handler = getAllHandler;
