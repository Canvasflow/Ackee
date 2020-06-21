'use strict'

const domains = require('../database/domains')
const pipe = require('../utils/pipe')
const messages = require('../utils/messages')
const requireAuth = require('../middlewares/requireAuth_new')
const blockDemo = require('../middlewares/blockDemo_new')

const response = (entry) => ({
	id: entry.id,
	title: entry.title,
	created: entry.created,
	updated: entry.updated
})

module.exports = {
	Domain: {
		statistics: (obj) => obj
	},
	Query: {
		domain: pipe(requireAuth, async (parent, { id }) => {

			const entry = await domains.get(id)

			return entry == null ? null : response(entry)

		}),
		// TODO: enhance => sort by title lowercase
		domains: pipe(requireAuth, async () => {

			const entries = await domains.all()

			return entries.map(response)

		})
	},
	Mutation: {
		createDomain: pipe(requireAuth, blockDemo, async (parent, { input }) => {

			let entry

			try {

				entry = await domains.add(input)

			} catch (err) {

				if (err.name === 'ValidationError') {
					throw new Error(messages(err.errors))
				}

				throw err

			}

			return {
				payload: response(entry),
				success: true
			}

		}),
		updateDomain: pipe(requireAuth, blockDemo, async (parent, { id, input }) => {

			let entry

			try {

				entry = await domains.update(id, input)

			} catch (err) {

				if (err.name === 'ValidationError') {
					throw new Error(messages(err.errors))
				}

				throw err

			}

			if (entry == null) {
				throw new Error('Unknown domain')
			}

			return {
				payload: response(entry),
				success: true
			}

		}),
		deleteDomain: pipe(requireAuth, blockDemo, async (parent, { id }) => {

			await domains.del(id)

			return {
				success: true
			}

		})
	}
}