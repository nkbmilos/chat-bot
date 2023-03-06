/* eslint-disable @typescript-eslint/no-unused-vars */
import { createLogger, transports, format } from 'winston';
import { getId } from 'correlation-id';

const { combine, timestamp, printf, json } = format;

const localTransports: any[] = [];

const addCorrelationId = format((info) => {
  const infoValue = info;
  infoValue.correlationId = getId();
  return infoValue;
});

const consoleLogConfig = {
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), addCorrelationId(), json()),
};

localTransports.push(new transports.Console(consoleLogConfig));

const logger = createLogger({
  transports: localTransports,
});

export default function getLogger(loggerName: string) {
  return {
    debug: (message) => {
      logger.log({ label: loggerName, level: 'debug', message });
    },

    info: (message) => {
      logger.log({ label: loggerName, level: 'info', message });
    },

    warn: (message) => {
      logger.log({ label: loggerName, level: 'warn', message });
    },

    error: (message, error?) => {
      logger.log({ label: loggerName, level: 'error', message, error });
    },
  };
}
