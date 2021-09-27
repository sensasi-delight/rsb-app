import { useEffect, useState } from "react";

import TextField from "@material-ui/core/TextField";
import FormDialog from "../FormDialog";

import PropTypes from 'prop-types';
import { getEmptySurvey } from '../../classes/Helper';


SurveyForm.propTypes = {
	closeForm: PropTypes.func.isRequired
};

export default function SurveyForm(props) {

	const { projectHelper, project } = props

	const [oldValues, setOldValues] = useState({...props.survey})
	const [survey, setSurvey] = useState({...props.survey})

	useEffect(() => {
		if (props.survey) {
			setOldValues({...props.survey})
			setSurvey({...props.survey})
		}
	}, [props.survey])

	const { _isOpenForm, closeForm } = props


	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true);
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

	useEffect(() => {
		if (survey.date === '') {
			return _setisSubmitDisabled(true)
		} else {
			return _setisSubmitDisabled(false)
		}
	}, [survey.date])


	const _handleCloseForm = () => {
		// bug note: !dirty harusnya tidak ada notif
		const isDirty = survey.date !== '';
		const isChanged = survey.date !== oldValues.date

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

			if (survey.id) {
				setSurvey({...oldValues})
			} else {
				setSurvey(getEmptySurvey())
			}
		}
	}

	const _handleSubmit = () => {

		if(!survey.id) {
			survey.id = new Date()
			project.surveys.unshift(survey)
		} else {
			const i = project.surveys.findIndex(s => s.id === survey.id)
			project.surveys[i] = {...survey}
		}

		project.surveys.sort((a, b) => (a.date < b.date) ? 1 : -1)
		projectHelper.unshift(project)
		projectHelper.allToLs()

		props.setProject(project)

		closeForm()
	}


	return (
		<FormDialog
			_title={!survey.id ? 'Tambah Survei' : 'Ubah ' + oldValues.date}
			_itemName='survei'
			_dataName='survei'
			_isOpenForm={_isOpenForm}
			_isSubmitDisabled={_isSubmitDisabled}
			_isOpenCancelDialog={_isOpenCancelDialog}

			_handleSubmit={_handleSubmit}
			_handleCancel={_handleCancel}
			_handleCloseForm={_handleCloseForm}
		>
			<TextField
				autoComplete="off"
				id="date"
				label="Tanggal"
				type="date"
				value={survey.date}
				onChange={(e) => {
					setSurvey({...survey, date: e.target.value})
				}}

				fullWidth
				required

				InputLabelProps={{
					shrink: true,
				}}
			/>
		</FormDialog>
	)
}