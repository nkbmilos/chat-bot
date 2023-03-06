import getConfig from "../configManager";
import getLogger from "../logger";
import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {Metadata} from "aws-sdk/clients/s3";
import {Readable} from "stream";

const logger = getLogger('s3-service');
const BUCKET_NAME = getConfig().BUCKET_NAME;

const s3Client = new S3Client({
    region: "eu-west-1",
    endpoint: "http://0.0.0.0:4566"
});
export const uploadCsvFile = async (s3Key: string, content: Buffer, metadata: Metadata) => {
    const command = new PutObjectCommand({
        Body: content,
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Metadata: metadata,
    });

    logger.info(`uploading object: bucket: ${BUCKET_NAME} key: ${s3Key}`);
    const response = await s3Client.send(command);
    if (response.$metadata.httpStatusCode !== 200) {
        throw new Error();
    }
    logger.info(`uploaded successfully ${JSON.stringify(response.$metadata)}`);
};

type S3File = {
    body: Readable;
};

export async function getS3Object(command: GetObjectCommand): Promise<Readable> {
    try {
        const response = await s3Client.send(command);
        return response.Body as Readable;
    } catch (error: any) {
        logger.error(`Error happened while getting file from S3`, error);
        throw Error;
    }
}

export const encodeBuf = (data: Readable): Promise<string> => {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        data.on('data', (chunk) => chunks.push(chunk));
        data.on('error', reject);
        data.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
};

export async function getS3File(s3Key: string): Promise<S3File> {
    logger.info(`Getting s3 file with key ${s3Key} and bucket ${BUCKET_NAME}`);
    const command: GetObjectCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
    });
    const content: Readable = await getS3Object(command);
    return {body: content};
}