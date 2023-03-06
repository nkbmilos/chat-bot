import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import getLogger from '../logger';
import {toResponse} from "../helpers";
import {getConversation} from "../repositories/dynamoDbRepository";

const logger = getLogger('getConv');
const getAllHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const pathParameters = event.pathParameters ?? {};
    const {id} = pathParameters;
    if (!id) {
        return {statusCode: 400, body: 'Bad request'};
    }
    const conversation = await getConversation(id)
    return toResponse(200, {message: 'ok', conversation});
};
export const handler = getAllHandler;
