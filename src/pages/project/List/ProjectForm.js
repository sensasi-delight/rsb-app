import TextField from "@material-ui/core/TextField";
import { useEffect, useMemo, useRef, useState } from "react";
import FormDialog from "../../../component/FormDialog";

import PropTypes from 'prop-types';


ProjectForm.propTypes = {
	closeForm: PropTypes.func.isRequired
};

export default function ProjectForm(props) {

	const { projectHelper } = props

	const oldValues = useMemo(() => {return {...props.project}}, [props.project])
	const [project, setProject] = useState({...props.project})

	const { _isOpenForm, closeForm } = props;

	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true)
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

	const [_isNameError, _setisNameError] = useState(false);
	const [_helperText, _sethelperText] = useState('');

	const _isInitialRender = useRef(true)

	const [isDirty, setIsDirty] = useState(false)
	const [isChanged, setIsChanged] = useState(false)



	useEffect(() => {
		if (_isInitialRender.current) {
			_setisSubmitDisabled(true)
			_isInitialRender.current = false
		} else {
			const timeOutId = setTimeout(() => {
				const isDirty = !project.id && (project.name !== '' || project.desc !== '' || project.date !== '')
				const isChanged = project.id && (project.name !== oldValues.name || project.desc !== oldValues.desc || project.date !== oldValues.date)

				setIsDirty(isDirty)
				setIsChanged(isChanged)

				const { isValid, msg } = projectHelper.nameValidator(project.id, project.name)
				setNameError(!isValid, msg, (!isDirty && !isChanged) || !isValid)
			}, 500);

			return () => {
				clearTimeout(timeOutId)
			}
		}

	}, [project, projectHelper, oldValues])


	


	const _handleCloseForm = () => {
		if (isDirty || isChanged) {
			_setIsOpenCancelDialog(true)
		} else {
			closeForm()
			clearNameError()
			_isInitialRender.current = true
		}

	}


	const _handleCancel = (isCanceled) => {
		_setIsOpenCancelDialog(false)

		if (isCanceled) {
			_isInitialRender.current = true
	        closeForm()
	        clearNameError()

	        if (project.id) {
				setProject({...oldValues})
	        } else {
				setProject(projectHelper.getEmptyProject())
	        }
		}
	}

	const _handleSubmit = () => {
		const { isValid, msg } = projectHelper.nameValidator(project.id, project.name) //just a double protectiton

		if (isValid) {
			projectHelper.unshift(project)
			projectHelper.allToLs()

			if (props._setProject) {
				props._setProject(project)
			}
			
			_isInitialRender.current = true
			closeForm()
		} else {
			setNameError(!isValid, msg)
		}
	}


	// -> just ui helper / not logical
	const setNameError = (isInvalid, msg, isSubmitDisabled) => {
		_setisSubmitDisabled(isSubmitDisabled)
		_setisNameError(isInvalid)
		_sethelperText(msg)
	}

	const clearNameError = () => {
		setNameError(false, '')
	}
	// <- just ui helper / not logical

	return (
		<FormDialog
			_title={!project.id ? 'Tambah Proyek' : 'Ubah ' + oldValues.name}
			_itemName='proyek'
			_dataName={!project.id ? project.name : oldValues.name}
			_isOpenForm={_isOpenForm}
			_isSubmitDisabled={_isSubmitDisabled}
			_isOpenCancelDialog={_isOpenCancelDialog}

			_handleSubmit={_handleSubmit}
			_handleCancel={_handleCancel}
			_handleCloseForm={_handleCloseForm}
		>
			<TextField
				required
				autoComplete="off"
				autoFocus
				margin="dense"
				id="name"
				label="Nama"
				value={project.name}
				fullWidth
				onChange={(e) => setProject({ ...project, name: e.target.value })}
				error={_isNameError}
				helperText={_helperText}
			/>

			<TextField
				autoComplete="off"
				id="date"
				label="Tanggal"
				type="date"
				value={project.date}
				onChange={(e) => setProject({...project, date: e.target.value})}

				fullWidth
				required

				InputLabelProps={{
					shrink: true,
				}}
			/>

			<TextField
				autoComplete="off"
				margin="dense"
				id="desc"
				value={project.desc}
				label="Keterangan"
				fullWidth
				onChange={(e) => setProject({...project, desc: e.target.value})}
			/>
		</FormDialog>
	)
}