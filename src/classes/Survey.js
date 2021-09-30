import nj from 'networkjs'
import { multiply } from 'mathjs'
import { sortAlphaNum, arrayObjGroup } from "./Helper";


export default class Survey {
	static emptyCriteria = {
		id: null,
		symbol: '',
		desc: ''
	}


	constructor(init) {
		this.id = init.id || null;
		this.date = init.date || '';
		this.criterias = init.criterias || [];
		this.responses = init.responses || [];
		this.score = init.score || {};
	}

	criteriasSort = () => this.criterias.sort((a, b) => sortAlphaNum(a.symbol, b.symbol))
	responsesSort = () => this.responses.sort((a, b) => sortAlphaNum(a.symbol, b.symbol))


	// SETTER GETTER GOES HERE
	//
	//
	//
	//
	isNew = () => this.id === null

	getCriteriaById = id => this.criterias.find(cr => cr.id === id) || undefined
	getCriteriaIndexById = id => this.criterias.findIndex(cr => cr.id === id)
	getResponseIndexById = id => this.responses.findIndex(res => res.id === id)


	getCriteriaSymbolById = id => {
		const temp = this.getCriteriaById(id)

		return temp ? temp.symbol : 'Not Found'
	}

	getCriteriaDescById = id => {
		const temp = this.getCriteriaById(id)

		return temp ? temp.desc : 'Not Found'
	}


	getEmptyCriteria = () => Survey.emptyCriteria

	getEmptyResponse = () => {
		const responseVal = []

		this.criterias.map(criteria =>
			responseVal.push({
				isActive: false,
				criteriaId: criteria.id,
				expectation: 0,
				reality: 0
			})
		)

		return {
			id: null,
			group: '',
			role: '',
			symbol: '',
			age: '',
			edu: '',
			exp: '',
			response: responseVal
		}
	}






	// GRAPH DATA GOES HERE
	//
	//
	//
	//
	toNetworkGraphData() {
		
		const getColor = (gap) => {
			let color = '#9e9e9e'

			if (gap > 0) {
				color = '#ff1744'
			} else if (gap < 0) {
				color = '#26a69a'
			}

			return color
		}

		let data = []

		this.criterias.map(criteria => {
			let lineIndex = 0;
			let text = ''
			const score = criteria.score && criteria.score.expectationTotal ? 5 - criteria.score.gap : 0

			for (let i = 0; i < criteria.desc.length; i++) {

				if (lineIndex > 20 && criteria.desc.charAt(i) === ' ') {
					text += '\n'
					lineIndex = 0
				} else {
					text += criteria.desc.charAt(i)
				}

				lineIndex++
			}

			return data.push({
				id: criteria.id,
				name: criteria.symbol,
				text: text + '\n\nSkor: [bold]' + (score ? score.toFixed(2) : '-') + '[/]',
				impact: criteria.weight * criteria.score.gap * (criteria.score.gap < 0 ? -1 : 1),
				impactPure: criteria.weight * criteria.score.gap,
				color: getColor(criteria.score.gap),
				childrens: [],

				//for ranking
				gap: criteria.score.gap,
				weight: criteria.weight,
			})
		})


		data.sort((a, b) => (a.impactPure < b.impactPure) ? 1 : ((b.impactPure < a.impactPure) ? -1 : 0))
		data.map((d, i) => {
			d.rank = i + 1
			return d.text = '[bold]#' + d.rank + '[/]\n\n' + d.text
		})

		// #b2102f
		// #ff1744
		// #ff4569

		// #2a3eb1
		// #3d5afe
		// #637bfe

		// #1a746b
		// #26a69a
		// #51b7ae

		// #9e9e9e

		this.responses.map(response => {

			let lineIndex = 0;
			let role = ''

			for (var i = 0; i < response.role.length; i++) {

				if (lineIndex > 20 && response.role.charAt(i) === ' ') {
					role += '\n'
					lineIndex = 0
				} else {
					role += response.role.charAt(i)
				}

				lineIndex++
			}

			return response.response.filter(res => res.isActive).map(res => {

				const text = 'Ekspektasi: [bold]' + res.expectation + '[/]\nRealita: [bold]' + res.reality + '[/]';

				const temp = data.find(d => d.id === res.criteriaId);

				return temp ? data.find(d => d.id === res.criteriaId).childrens.push({
					text: role + '\n\n' + text,
					name: response.symbol,
					color: res.expectation === res.reality ? '#9e9e9e' : res.expectation > res.reality ? '#ff1744' : '#26a69a'
				}) : 0
			})
		})

		return data
	}

	getPieChartData(field) {
		const catList = [
			'Sangat Rendah',
			'Rendah',
			'Sedang',
			'Baik',
			'Sangat Baik',
		]

		if (this.score[field]) {
			return this.score[field].map((scoreVal, index) => {
				return {
					category: catList[index],
					value: scoreVal
				}
			})
		}

		return []
	}


	getPieChartData2(field) {
		// const catList = [
		// 	'Sangat Rendah',
		// 	'Rendah',
		// 	'Sedang',
		// 	'Baik',
		// 	'Sangat Baik',
		// ]

		let addText = '';

		if (field === 'age' || field === 'exp') {
			addText = ' Tahun'
		}

		const groupped = arrayObjGroup(this.responses, field)

		return Object.keys(groupped).map(groupName => {

			return {
				category: groupName + addText,
				value: groupped[groupName].length
			}
		})
	}


	getDetailTableData() {

		const data = []

		this.criterias.map((cr, i) => {
			data[i] = JSON.parse(JSON.stringify(cr))

			data[i].gap = cr.score && cr.score.expectationTotal ? cr.score.gap : null
			data[i].impact = cr.weight * data[i].gap
			data[i].rate = cr.score && cr.score.expectationTotal ? 5 - data[i].gap : null
			data[i].responses = []

			return 0
		})


		data.sort((a, b) => (a.impact < b.impact) ? 1 : ((b.impact < a.impact) ? -1 : 0))
		data.map((d, i) => d.rank = i + 1)

		this.responses.map(response =>
			response.response.filter(res => res.isActive)
				.map(resCr => {

					const criteria = data.find(cr => cr.id === resCr.criteriaId)

					if (criteria) {
						criteria.responses.push({
							symbol: response.symbol,
							expectation: resCr.expectation,
							reality: resCr.reality
						})
					}

					return 0
				})
		)

		return data
	}



	getCriteriaGraphData() {

		const data = this.criterias.map(cr => {
			let lineIndex = 0;
			let desc = ''

			for (var i = 0; i < cr.desc.length; i++) {

				if (lineIndex > 20 && cr.desc.charAt(i) === ' ') {
					desc += '\n'
					lineIndex = 0
				} else {
					desc += cr.desc.charAt(i)
				}

				lineIndex++
			}

			const score = (cr.score && cr.score.expectationTotal ? 5 - cr.score.gap : 0)

			return {
				symbol: cr.symbol,
				desc: desc,
				score: score,
				bulletTooltip: score.toFixed(2),
				// ...cr.score
			}
		})

		return data
	}



	// RSB CORE GOES HERE
	//
	//
	//
	//
	calcAndSetRSB() {
		this.calcAndSetWeight()

		// init
		let results = []
		let crWeightMatrix = []
		this.criterias.map(cr => {

			crWeightMatrix.push(cr.weight || 0)

			results[cr.id] = {
				gap: null,

				expectationTotal: null,
				expectationDetail: [null, null, null, null, null], //likert 5 scale

				realityTotal: null,
				realityDetail: [null, null, null, null, null] //likert 5 scale
			}

			return 0
		})

		// sum weight based on their likert val
		this.responses.map(res1 =>
			res1.response.filter(ans => ans.isActive).map(ans => {
				results[ans.criteriaId].expectationDetail[ans.expectation - 1] += res1.weight
				results[ans.criteriaId].realityDetail[ans.reality - 1] += res1.weight

				return 0
			})
		)

		// normalisasi and total calc
		let crExpMatrix = []
		let crReaMatrix = []

		for (let crIndex in results) {
			const totalExp = results[crIndex].expectationDetail.reduce((a, b) => a + b, 0)
			const totalRea = results[crIndex].realityDetail.reduce((a, b) => a + b, 0)

			results[crIndex].expectationDetail.map((v, i) => results[crIndex].expectationDetail[i] = v === null ? 0 : v / totalExp)
			results[crIndex].realityDetail.map((v, i) => results[crIndex].realityDetail[i] = v === null ? 0 : v / totalRea)

			crExpMatrix.push(results[crIndex].expectationDetail)
			crReaMatrix.push(results[crIndex].realityDetail)

			results[crIndex].expectationTotal = multiply(results[crIndex].expectationDetail, [1, 2, 3, 4, 5]) // calc total score = detail * likert 5
			results[crIndex].realityTotal = multiply(results[crIndex].realityDetail, [1, 2, 3, 4, 5]) // calc total score = detail * likert 5

			results[crIndex].gap = results[crIndex].expectationTotal - results[crIndex].realityTotal
		}


		// save cr score
		this.criterias.map(cr => cr.score = results[cr.id])


		// survey overall score calc
		this.score = {
			expectationDetail: multiply(crWeightMatrix, crExpMatrix),
			realityDetail: multiply(crWeightMatrix, crReaMatrix)
		}

		this.score.expectationTotal = multiply(this.score.expectationDetail, [1, 2, 3, 4, 5])
		this.score.realityTotal = multiply(this.score.realityDetail, [1, 2, 3, 4, 5])
		this.score.gap = this.score.expectationTotal - this.score.realityTotal
	}

	calcEig() {
		const Graph = nj.datastructures.Graph
		const eigenvector_centrality = nj.algorithms.centrality.eigenvector_centrality
		let G = new Graph()

		this.criterias.map(cr => G.add_node(cr.id))
		this.responses.map(res => {
			G.add_node(res.id)
			return res.response.map(cr => cr.isActive ? G.add_edge(res.id, cr.criteriaId) : null)
		})

		return eigenvector_centrality(G)
	}

	calcAndSetWeight() {
		this.clearWeights()
		const eigs = this.calcEig()

		let total = 0
		this.criterias.map(cr => total += eigs[cr.id])
		this.criterias.map(cr => cr.weight = eigs[cr.id] / total)

		total = 0
		this.responses.map(res => total += eigs[res.id])
		this.responses.map(res => res.weight = eigs[res.id] / total)
	}

	clearWeights() {
		this.criterias.map(cr => cr.weight = null)
		this.responses.map(res => res.weight = null)
	}
}