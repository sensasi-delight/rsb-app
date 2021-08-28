import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import FormDialog from "../../../component/FormDialog";


export default function CriteriaForm(props) {

    const { projectHelper, project, survey, criteria, setCriteria } = props

    const [criteriaTemp, setCriteriaTemp] = useState({...criteria})

    const clear = {
        id: null,
        symbol: '',
        desc: ''
    }

	const { _isOpenForm, _setIsOpenForm } = props;

	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true);
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

    let isDirty = criteriaTemp.id === null && (criteriaTemp.desc !== '' || criteriaTemp.symbol !== '')
    let isChanged = criteriaTemp.id !== null && (criteriaTemp.desc !== criteria.desc || criteriaTemp.symbol !== criteria.symbol)

    useEffect(() => {
        setCriteriaTemp({...criteria})
    }, [criteria])


	useEffect(() => {
		if (isDirty || isChanged) {
            return _setisSubmitDisabled(false)
		} else {
			return _setisSubmitDisabled(true)
		}
	}, [isDirty, isChanged])


	const _handleCloseForm = () => {
		

		if (isDirty || isChanged) {
			_setIsOpenCancelDialog(true)
		} else {
			_setIsOpenForm(false)
		}
	}

	const _handleCancel = (isCanceled) => {
		_setIsOpenCancelDialog(false)

		if (isCanceled) {
			_setIsOpenForm(false)
            setCriteriaTemp({...criteria})
		}
	}

	const _handleSubmit = () => {

        if (criteriaTemp.id === null) {
            criteriaTemp.id = new Date()
            survey.criterias.push(criteriaTemp)
        } else {
            const criteriaIndex = survey.getCriteriaIndex(criteriaTemp.id)
            survey.criterias[criteriaIndex] = criteriaTemp
        }

        survey.criterias.sort((a, b) => (a.symbol < b.symbol ? -1 : (a.symbol.length - b.symbol.length) ))

        const surveyIndex = project.getSurveyIndex(survey.id)

        if (surveyIndex !== -1) {
            project.surveys[surveyIndex] = survey

            project.setThis(project)

            projectHelper.unshift(project)
            projectHelper.allToLs()

            setCriteria(clear)
            _setIsOpenForm(false)
        }

		
	}


    const _handleSymbolChange = (e) => {
        criteriaTemp.symbol = e.target.value
        setCriteriaTemp({...criteriaTemp})
	}

    const _handleDescChange = (e) => {
        criteriaTemp.desc = e.target.value
        setCriteriaTemp({...criteriaTemp})
	}

	return (
		<FormDialog
			_title = {criteria.id === null ? 'Tambah Kriteria' : 'Ubah ' + criteria.symbol}
			_itemName = 'kriteria'
			_dataName = {criteria.symbol || criteriaTemp.symbol || 'kriteria'}
			_isOpenForm={_isOpenForm}
			_isSubmitDisabled = {_isSubmitDisabled}
			_isOpenCancelDialog = {_isOpenCancelDialog}

			_handleSubmit = {_handleSubmit}
			_handleCancel = {_handleCancel}
			_handleCloseForm = {_handleCloseForm}
		>
            <TextField
				required
				autoComplete="off"
				autoFocus
				margin="dense"
				// id="symbol"
				label="Simbol"
				value={criteriaTemp.symbol}
				fullWidth
				onChange={_handleSymbolChange}
			/>

			<TextField
				required
				autoComplete="off"
				margin="dense"
				// id="name"
				label="Kriteria"
				value={criteriaTemp.desc}
				fullWidth
				onChange={_handleDescChange}
                multiline
			/>
		</FormDialog>
	)
}