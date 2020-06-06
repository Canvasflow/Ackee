'use strict'

const Record = require('../schemas/Record')
const intervals = require('../constants/intervals')
const aggregateViewsActive = require('../aggregations/aggregateViewsActive')
const aggregateViewsAverage = require('../aggregations/aggregateViewsAverage')
const aggregateDurationsAverage = require('../aggregations/aggregateDurationsAverage')
const aggregateViewsCount = require('../aggregations/aggregateViewsCount')

const getViewsActive = async (id) => {

	return Record.aggregate(
		aggregateViewsActive(id)
	)

}

const getViewsAverage = async (id) => {

	return Record.aggregate(
		aggregateViewsAverage(id, true)
	)

}

const getDurationsAverage = async (id) => {

	return Record.aggregate(
		aggregateDurationsAverage(id)
	)

}

const getViewsToday = async (id) => {

	return Record.aggregate(
		aggregateViewsCount(id, true, intervals.INTERVALS_DAILY)
	)

}

const getViewsMonth = async (id) => {

	return Record.aggregate(
		aggregateViewsCount(id, true, intervals.INTERVALS_MONTHLY)
	)

}

const getViewsYear = async (id) => {

	return Record.aggregate(
		aggregateViewsCount(id, true, intervals.INTERVALS_YEARLY)
	)

}

const get = async (id) => {

	const [
		viewsActive,
		viewsAverage,
		durationsAverage,
		viewsToday,
		viewsMonth,
		viewsYear
	] = await Promise.all([
		getViewsActive(id),
		getViewsAverage(id),
		getDurationsAverage(id),
		getViewsToday(id),
		getViewsMonth(id),
		getViewsYear(id)
	])

	return {
		viewsActive,
		viewsAverage,
		durationsAverage,
		viewsToday,
		viewsMonth,
		viewsYear
	}

}

module.exports = {
	get
}