import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import FormDialog from "../FormDialog";


export default function SurveyForm(props) {

	const { projectHelper, project, survey } = props
	const oldValues = project.getSurvey(survey.id)

	const { _isOpenForm, _setIsOpenForm } = props


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

		if ((isDirty) || (isChanged)) {
			_setIsOpenCancelDialog(true)
		} else {
			_setIsOpenForm(false)
		}
	}

	const _handleCancel = (isCanceled) => {
		_setIsOpenCancelDialog(false)

		if (isCanceled) {
			_setIsOpenForm(false)

			if (survey.isNew()) {
				survey.clearValue()
			} else {
				survey.setThis(oldValues)
			}
		}
	}

	const _handleSubmit = () => {

		if(survey.isNew()) {
			survey.id = new Date()
			project.surveys.unshift(survey)
		} else {
			const i = project.surveys.findIndex(s => s.id === survey.id)
			project.surveys[i] = survey
		}

		project.surveys.sort((a, b) => (a.date < b.date) ? 1 : -1)
		projectHelper.unshift(project)
		projectHelper.allToLs()

		_setIsOpenForm(false)
	}


	return (
		<FormDialog
			// _title={project.isNew() ? 'Tambah Survei' : 'Ubah ' + oldValues.name}
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
				onChange={(e) => survey.setDate(e.target.value)}

				fullWidth
				required

				InputLabelProps={{
					shrink: true,
				}}
			/>
		</FormDialog>
	)
}