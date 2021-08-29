export default class Project {
    constructor(init, _setState) {
        this.id = init.id || null;
        this.name = init.name || '';
        this.desc = init.desc || '';
        this.date = init.date || '';
        this.surveys = init.surveys || [];

        this._setState = _setState
    }

    isNew() {
        return this.id === null
    }

    setThis(obj) {
        this._setState(obj)
    }

    setId(id) {
        this.id = id
        this._setState(this)
    }

    setName(newName) {
        this.name = newName
        this._setState(this)
    }

    setDesc(newDesc) {
        this.desc = newDesc
        this._setState(this)
    }

    setDate(newDate) {
        this.date = newDate
        this._setState(this)
    }

    clearValue() {
        this.setThis({})
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


    toRsbGraphData() {
        let data = [{
            date: this.date,
            actual: 0,
            targeted: 0
        }];

        this.surveys.map(sur =>        
            data.push({
                date: new Date(sur.date),
                actual: sur.score.realityTotal.toFixed(2) || 0,
                targeted: sur.score.expectationTotal.toFixed(2) || 0
            })
        )

        return data
    }
}