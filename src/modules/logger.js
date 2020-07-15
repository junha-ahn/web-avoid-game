const winston = require('winston')
const format = winston.format

module.exports = winston.createLogger({
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
					(info) => `${info.timestamp} ${info.level}: ${info.message}`,
				),
			),
		}),
	],
})
