import { Express } from 'express'
import { Server } from 'http'

import expressLoader from './server'
import socketLoader from './socket/index'
import logger from '../modules/logger'

export default async (app: Express, server: Server) => {
	expressLoader(app)
	logger.info('Express loaded')

	socketLoader(server)
	logger.info('Socket loaded')
}
