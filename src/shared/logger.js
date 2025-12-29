import pino  from 'pino';

const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
    level: process.env.LOG_LEVEL || isProd ? 'info' : 'debug',
    transport:  isProd ? undefined : {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:standard',
            colorize: true,
        }
    }
})

export default logger