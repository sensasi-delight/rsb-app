export default class Project {

	constructor(obj) {
		this.id = obj.id || null;
		this.name = obj.name || '';
		this.desc = obj.desc || '';
		this.date = obj.date || '';
		this.surveys = obj.surveys || [];
	}

	isNew() {
		return this.id === null
	}

	getSurvey(id) {
		return this.surveys.find(survey => survey.id === id) || {}
	}

	getSurveyIndex(id) {
		return this.surveys.findIndex(survey => survey.id === id)
	}

	pushSurvey(survey) {
		if (survey.id === null) {
			survey.id = Date.now()
		}

		this.surveys.push(survey)
	}


	getRsbGraphData() {

		const data = [{
			date: new Date(this.date),
			realityTotal: 0,
			expectationTotal: 0
		}]

		this.surveys.slice(0).reverse().map(sur =>
			data.push({
				date: new Date(sur.date),
				realityTotal: sur.score && sur.score.realityTotal ? sur.score.realityTotal : 0,
				expectationTotal: sur.score && sur.score.expectationTotal ? sur.score.expectationTotal : 0
			})
		)

		return data
	}


	getRsbGraph2Data() {

		const data = [{
			date: new Date(this.date),
			score: 0,
			bulletTooltip: 0
		}]

		this.surveys.slice(0).reverse().map(sur => {
			const score = sur.score ? 5 - sur.score.gap : 0

			return data.push({
				date: new Date(sur.date),
				score: score,
				bulletTooltip: score ? score.toFixed(2) : 0
			})
		})

		return data
	}
}