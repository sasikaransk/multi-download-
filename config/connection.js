import P from 'pino';

export const connectionConfig = {
    printQRInTerminal: true,
    logger: P({ level: 'silent' })
};

export const reconnectOptions = {
    maxRetries: 5,
    delayMs: 3000
};