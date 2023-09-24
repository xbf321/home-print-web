// @ts-nocheck
import winston from "winston";
export default defineNitroPlugin((nitroApp) => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.printf((event) => {
      return `${JSON.stringify({ ...event, timestamp: new Date().toISOString() }, null, 4)}\n`;
    })),
    defaultMeta: { service: 'home-print-web' },
    transports: [
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
      new winston.transports.Console()
    ],
  });
  nitroApp.$logger = logger;
})