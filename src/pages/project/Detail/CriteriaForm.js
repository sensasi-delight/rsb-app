import { useEffect, useState } from "react";

import TextField from "@material-ui/core/TextField";

import FormDialog from "../../../component/FormDialog";



export default function CriteriaForm(props) {

    const { projectHelper, project, survey, criteria } = props

    const [criteriaTemp, setCriteriaTemp] = useState({...criteria})

	const { _isOpenForm, closeForm } = props;

	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true);
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

    let isDirty = criteriaTemp.id === null && (criteriaTemp.desc !== '' || criteriaTemp.symbol !== '')
    let isChanged = criteriaTemp.id !== null && (criteriaTemp.desc !== criteria.desc || criteriaTemp.symbol !== criteria.symbol)

    // useEffect(() => {
    //     setCriteriaTemp({...criteria})
    // }, [criteria])


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
			closeForm()
		}
	}

	const _handleCancel = (isCanceled) => {
		_setIsOpenCancelDialog(false)

		if (isCanceled) {
			closeForm()
            setCriteriaTemp({...criteria})
		}
	}

	const _handleSubmit = () => {

        if (criteriaTemp.id === null) {
            criteriaTemp.id = Date.now()
            survey.criterias.push(criteriaTemp)
        } else {
			const crIndex = survey.getCriteriaIndexById(criteriaTemp.id)

			if(crIndex !== -1) {
				survey.criterias[crIndex] = criteriaTemp
			}
        }

		survey.criteriasSort()

        const surveyIndex = project.getSurveyIndex(survey.id)

        if (surveyIndex !== -1) {
            project.surveys[surveyIndex] = survey

            props.setProject(project)

            projectHelper.unshift(project)
            projectHelper.allToLs()

			closeForm()
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