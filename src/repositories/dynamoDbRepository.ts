import {client} from "./dynamodbClient";
import {PutItemInput} from '@aws-sdk/client-dynamodb/dist-types/models/models_0';
import {PutCommandOutput, ScanCommand, ScanCommandInput, ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
import getLogger from "../logger";
import {GetItemCommand, GetItemCommandInput, GetItemCommandOutput, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {v4 as uuidv4} from 'uuid';

const logger = getLogger('dbRep');
const generateResponse = async (response: ScanCommandOutput) => {
    if (response?.$metadata?.httpStatusCode !== 200 || !response.Items) {
        throw Error;
    }
    return response.Items;
};
const generateResponsePutCommandOutput = async (response: PutCommandOutput) => {
    if (response?.$metadata?.httpStatusCode !== 200 || !response) {
        throw Error;
    }
    return response;
};
const generateResponseGetItemCommandInput = async (response: GetItemCommandOutput) => {
    if (response?.$metadata?.httpStatusCode !== 200 || !response.Item) {
        throw Error;
    }
    return response.Item;
};
export const getAll = async (TableName: string) => {
    try {
        const params: ScanCommandInput = {
            TableName: TableName
        };
        const dbResponse = await client.send(new ScanCommand(params));
        return await generateResponse(dbResponse);
    } catch (e) {
        logger.error(JSON.stringify(e))
        throw e;
    }
};
export const createConversation = async (conversationA: string, conversationB: string) => {
    try {
        const params: PutItemInput = {
            Item: {
                id: {
                    S: uuidv4(),
                },
                textA: {
                    S: conversationA
                },
                textB: {
                    S: conversationB
                }
            },
            TableName: "Conversations"
        };
        const dbResponse = await client.send(new PutItemCommand(params));
        return await generateResponsePutCommandOutput(dbResponse);
    } catch (e) {
        logger.error(JSON.stringify(e))
        throw e;
    }
};

export const getConversation = async (id: string) => {
    try {
        const params: GetItemCommandInput = {
            Key: {id: {S: id}},
            TableName: "Conversations"
        };
        const dbResponse = await client.send(new GetItemCommand(params));
        return await generateResponseGetItemCommandInput(dbResponse);
    } catch (e) {
        logger.error(JSON.stringify(e))
        throw e;
    }
};