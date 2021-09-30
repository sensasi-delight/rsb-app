

export const getEmptySurvey = () => {
	return {
		id: null,
		date: ''
	}
}

const reA = /[^a-zA-Z]/g;
const reN = /[^0-9]/g;

export const sortAlphaNum = (a, b) => {
	const aA = a.replace(reA, "");
	const bA = b.replace(reA, "");
	if (aA === bA) {
		const aN = parseInt(a.replace(reN, ""), 10);
		const bN = parseInt(b.replace(reN, ""), 10);
		return aN === bN ? 0 : aN > bN ? 1 : -1;
	} else {
		return aA > bA ? 1 : -1;
	}
}


export const arrayObjGroup = (array, byProperty) => array.reduce((rv, x) => {
	(rv[x[byProperty]] = rv[x[byProperty]] || []).push(x)
	return rv
}, {})


export const print = (contentId, ifId) => {
	const style = document.getElementsByTagName("style");
	const style2 = document.querySelectorAll('[rel="stylesheet"]');

	const content = document.getElementById(contentId);
	const pri = document.getElementById(ifId).contentWindow;
	pri.document.open();
	pri.document.write(content.innerHTML);

	for (let index = 0; index < style.length; index++) {
		pri.document.body.prepend(style[index].cloneNode(true))
	}

	for (let index = 0; index < style2.length; index++) {
		pri.document.body.prepend(style2[index].cloneNode(true))
	}

	pri.document.close();
	pri.focus();
	pri.print();
}


export const getColorByGap = (gap) => {
	let color = 'inherit'

	if (gap !== '-') {
		if (gap < 0) {
			color = 'green'
		} else if (gap > 0) {
			color = 'red'
		}
	}

	return color
}


const Helper = {
	getEmptySurvey: getEmptySurvey,
	sortAlphaNum: sortAlphaNum,
}

export default Helper