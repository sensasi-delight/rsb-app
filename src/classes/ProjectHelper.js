import Project from "./Project"


export default class ProjectHelper {
	static LsKey = 'projects'

	constructor(all, setAll) {
		this.all = all
		this.setAll = setAll
	}

	allToLs() {
		localStorage.setItem(ProjectHelper.LsKey, JSON.stringify(this.all))
	}

	unshift(project) {
		if (!project.id) {
			project.id = Date.now()
		}
		
		this.popById(project.id)
		this.all.unshift({...project})
		this.setAll(this.all)
	}

	popById(id) {
		const project = this.getProjectById(id)
		this.all = this.all.filter(project => project.id !== id)
		this.setAll(this.all)

		return project
	}

	stateToProjectClass(useState) {
		return new Project(useState[0], useState[1])
	}

	getProjectByName = (name) => this.all.find(project => project.name === name)
	getProjectById = (id) => this.all.find(project => project.id === id)
	
	getEmptyProject = () => {
		return {
			id: '',
			name: '',
			desc: '',
			date: ''
		}
	}

	nameValidator(id, newName) {
		const isNameEmpty = newName === ""

		const filtered = this.all.filter(project => project.id !== id)
		const index = filtered.findIndex(project => project.name === newName)
		const isDuplicated = !(index === -1)

		let isValid = true
		let msg = ''

		if (isNameEmpty) {
			msg = 'Nama tidak boleh kosong'
			isValid = false
		} else if (isDuplicated) {
			msg = 'Nama sudah digunakan'
			isValid = false
		}

		return {isValid, msg}
	}
}