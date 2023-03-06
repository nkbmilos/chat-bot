import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import getLogger from '../logger';
import {uploadCsvFile} from "../services/s3Clinet";
import {toResponse} from "../helpers";
import {v4 as uuidv4} from 'uuid';
const logger = getLogger('csv');
const csvHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`csvHandler was called with: ${event.pathParameters}`);
    const csvStringify = JSON.stringify(event.body);
    const lines = csvStringify.split('\\r\\n');
    if (lines && lines[0]) {
        const headers = lines[0].split(';');
        if (headers.length !== 4) {
            return toResponse(400, {code: '1.1.1', message: 'Missing headers'});
        }
        if (headers[0].replace(/['"]+/g, '').trim() !== "sender_username"
            || headers[1].replace(/['"]+/g, '').trim() !== "reciever_username"
            || headers[2].replace(/['"]+/g, '').trim() !== "message"
            || headers[3].replace(/['"]+/g, '').trim() !== "channel") {
            return toResponse(400, {code: '1.1.2', message: 'Bad header naming'});
        }
    }
    if (lines.length !== 1001) {
        return toResponse(400, {code: '1.1.3', message: 'Number of rows is not 1000'});
    }
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(';');
        if (fields.length !== 4 || !(["instagram", 'facebook', 'whatsapp', 'email'].indexOf(fields[3].replace(/['"]+/g, '').trim()) > -1)) {
            return toResponse(400, {code: '1.1.4', message: 'Channel not supported'});
        }
    }
    const bufferObject = Buffer.from(csvStringify);
    await uploadCsvFile(uuidv4()+ '.csv', bufferObject, {});
    return toResponse(200, {message: 'ok'});
};
export const handler = csvHandler;
