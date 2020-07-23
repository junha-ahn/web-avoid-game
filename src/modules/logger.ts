import * as winston from 'winston'
const format = winston.format

export default winston.createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.json(),
	),
	transports: [
		new winston.transports.Console({
			level: 'info',
			format: format.combine(
				format.colorize(),
				format.printf(
					(info: any) => `${info.timestamp} ${info.level}: ${info.message}`,
				),
			),
		}),
	],
})
