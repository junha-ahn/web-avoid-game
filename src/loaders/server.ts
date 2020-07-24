import * as express from 'express'
import * as path from 'path'

export default (app: express.Application) => {
	app.use(express.static(path.join(__dirname, '../public')))

	app.get('/', (req, res) => {
		res.render('../public/index.html')
	})
}
