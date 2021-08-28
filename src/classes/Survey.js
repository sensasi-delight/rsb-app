import nj from 'networkjs'
import { multiply } from 'mathjs'

export default class Survey {
	constructor(init, _setState) {
		this.id = init.id || null;
		this.date = init.date || '';
		this.criterias = init.criterias || [];
		this.responses = init.responses || [];
		this.score = init.score || { };

		this._setState = _setState
	}

	isNew() {
		return this.id === null
	}

	setThis(obj) {
		this._setState(obj)
	}

	setDate(val) {
		this.date = val;
		this.setThis(this)
	}

	clearValue() {
		this.setThis({
			id: null,
			date: '',
			criterias: [],
			responses: [],
			score: { }

		})
	}

	toNetworkGraphData() {
		let getColor = (row) => {
			let color = '#9e9e9e'

			if (row.score !== undefined) {
				if (row.score.gap < 0) {
					color = '#ff1744'
				} else if (row.score.gap >= 0) {
					color = '#26a69a'
				}
			}

			return color
		}



		let data = []



		this.criterias.map(criteria => {
			let lineIndex = 0;

			let text = 'Gap: ' + (criteria.score !== undefined ? criteria.score.gap.toFixed(2) : '-') + '\n\n';

			for (var i = 0; i < criteria.desc.length; i++) {
				
				if (lineIndex > 20 && criteria.desc.charAt(i) === ' ') {
					text += '\n'
					lineIndex = 0
				} else {
					text += criteria.desc.charAt(i)
				}

				lineIndex++
			}

			return data.push({
				name: criteria.symbol,
				text: text,
				gap: criteria.score !== undefined ? criteria.score.gap.toFixed(2) : '0',
				impact: criteria.score !== undefined ? (criteria.score.gap * criteria.weight * (criteria.score.gap < 0 ?  -1 : 1)) : '0',
				color: getColor(criteria),
				link: []
			})
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
			// const link = response.response.map(res => res.isActive ? res.criteriaSymbol : null)

			const crSymbols = response.response.filter(res => res.isActive).map(cr => cr.criteriaSymbol)

			data.filter(d => crSymbols.includes(d.name)).map(d => d.link.push(response.symbol))



			return data.push({
				// icon.href = "path/to/icon.svg";
				name: response.symbol,
				text: response.role,
				// link: link,
				color: "#3d5afe"

			})
		})

		return data
	}


	getCriteriaIndex(id) {
		return this.criterias.findIndex(criteria => criteria.id === id)
	}

	getResponseIndex(id) {
		return this.responses.findIndex(response => response.id === id)
	}




	// RSB CORE GOES HERE
	calcAndSetRSB() {
		this.calcAndSetWeight()

		// init
		let results = []
		let crWeightMatrix = []
		this.criterias.map(cr => {

			crWeightMatrix.push(cr.weight)

			results[cr.symbol] = {
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
				results[ans.criteriaSymbol].expectationDetail[ans.expectation - 1] += res1.weight
				results[ans.criteriaSymbol].realityDetail[ans.reality - 1] += res1.weight

				return 0
			})
		)

		// normalisasi and total calc
		let crExpMatrix = []
		let crReaMatrix = []

		for (let crIndex in results) {
			const totalExp = results[crIndex].expectationDetail.reduce((a, b) => a + b, 0)
			const totalRea = results[crIndex].realityDetail.reduce((a, b) => a + b, 0)

			results[crIndex].expectationDetail.map((v, i) => results[crIndex].expectationDetail[i] = v / totalExp)
			results[crIndex].realityDetail.map((v, i) => results[crIndex].realityDetail[i] = v / totalRea)

			crExpMatrix.push(results[crIndex].expectationDetail)
			crReaMatrix.push(results[crIndex].realityDetail)

			results[crIndex].expectationTotal = multiply(results[crIndex].expectationDetail, [1, 2, 3, 4, 5]) // calc total score = detail * likert 5
			results[crIndex].realityTotal = multiply(results[crIndex].realityDetail, [1, 2, 3, 4, 5]) // calc total score = detail * likert 5

			results[crIndex].gap = results[crIndex].realityTotal - results[crIndex].expectationTotal
		}


		// save cr score
		this.criterias.map(cr => cr.score = results[cr.symbol])

		// survey overall score calc
		this.score = {
			expectationDetail: multiply(crWeightMatrix, crExpMatrix),
			realityDetail: multiply(crWeightMatrix, crReaMatrix)
		}

		this.score.expectationTotal = multiply(this.score.expectationDetail, [1, 2, 3, 4, 5])
		this.score.realityTotal = multiply(this.score.realityDetail, [1, 2, 3, 4, 5])
		this.score.gap = this.score.realityTotal - this.score.expectationTotal

		this.setThis(this)
	}

	calcEig() {
		const Graph = nj.datastructures.Graph
		const eigenvector_centrality = nj.algorithms.centrality.eigenvector_centrality
		let G = new Graph()

		this.criterias.map(cr => G.add_node(cr.symbol))
		this.responses.map(res => {
			G.add_node(res.symbol)
			return res.response.map(cr => cr.isActive ? G.add_edge(res.symbol, cr.criteriaSymbol) : null)
		})

		return eigenvector_centrality(G)
	}

	calcAndSetWeight() {
		this.clearWeights()
		const eigs = this.calcEig()

		let total = 0
		this.criterias.map(cr => total += eigs[cr.symbol])
		this.criterias.map(cr => cr.weight = eigs[cr.symbol] / total)

		total = 0
		this.responses.map(res => total += eigs[res.symbol])
		this.responses.map(res => res.weight = eigs[res.symbol] / total)

		this.setThis(this)
	}

	clearWeights() {
		this.criterias.map(cr => cr.weight = null)
		this.responses.map(res => res.weight = null)

		this.setThis(this)
	}
}