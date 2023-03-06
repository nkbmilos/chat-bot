import {APIGatewayProxyResult, S3CreateEvent} from 'aws-lambda';
import getLogger from '../logger';
import {encodeBuf, getS3File} from "../services/s3Clinet";
import {createConversation, getAll} from "../repositories/dynamoDbRepository";

const logger = getLogger('postprocess');
export const createAnswer = (message: string, resMap, channel, sender, receiver) => {
    if (message.includes('how are you')) {
        const res = resMap['HAY-' + channel.trim()]
        return ReplaceUsers(res, sender, receiver)
    } else
        return 'Hi!'
}
export const ReplaceUsers = (message, sender, receiver) => {
    let string = message.replace('{{sender_username}}', sender).replace('{{reciever_username}}', receiver);
    return string;
}
const postprocessHandler = async (event: S3CreateEvent): Promise<APIGatewayProxyResult> => {
    const s3Key = event.Records[0].s3.object.key;
    if (!s3Key) {
        return {statusCode: 400, body: 'Bad request'};
    }
    const {body} = await getS3File(s3Key);
    const content: string = await encodeBuf(body);
    const lines = content.split('\\r\\n');
    const res = await getAll('ChatBotResponces');
    const resMap = res.reduce(function (map, obj) {
        map[obj.question] = obj.response;
        return map;
    }, {});

    for (let i = 1; i < lines.length; i++) {
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(';');
            const sender = fields[0];
            const receiver = fields[1];
            const message = fields[2];
            const channel = fields[3];
            await createConversation(message, createAnswer(message, resMap, channel, sender, receiver));
        }
    }
    return {statusCode: 200, body: 'ok'};
};
export const handler = postprocessHandler;
