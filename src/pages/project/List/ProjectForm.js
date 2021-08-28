import TextField from "@material-ui/core/TextField";
import { useEffect, useRef, useState } from "react";
import FormDialog from "../../../component/FormDialog";


export default function ProjectForm(props) {

    const {projectHelper, project} = props
    const oldValues = projectHelper.getProjectById(project.id)

    
	const {_isOpenForm, _setIsOpenForm} = props;
    
	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true);
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

	const [_isNameError, _setisNameError] = useState(false);
	const [_helperText, _sethelperText] = useState('');

	const _isInitialRender = useRef(true)

    useEffect(() => {
        if (_isInitialRender.current) {
            // console.log('bug note: first render should not check')
            _isInitialRender.current = false
        } else {
            const timeOutId = setTimeout(() => {
                const { isValid, msg } = projectHelper.nameValidator(project.id, project.name)
                setNameError(!isValid, msg)
            }, 500);
            
            return () => {
              clearTimeout(timeOutId)
            }
        }

    }, [project, projectHelper])

	const _handleNameChange = (e) => {
        
        const newName = e.target.value
        project.setName(newName)
	}

	const _handleCloseForm = () => {
        const isNew = project.isNew()
        const isDirty = isNew && (project.name !== '' || project.desc !== '')
        const isChanged = !isNew && (project.name !== oldValues.name || project.desc !== oldValues.desc)

        if (isDirty || isChanged) {
            _setIsOpenCancelDialog(true)
		} else {
            _setIsOpenForm(false)
			clearNameError()
        }
	}


	const _handleCancel = (isCanceled) => {
		_setIsOpenCancelDialog(false)
		
		if (isCanceled) {
            _setIsOpenForm(false)
            clearNameError()

            if (project.isNew()) {
                project.clearValue()
            } else {
                project.setThis(oldValues)
            }
		}
	}

	const _handleSubmit = () => {
        const { isValid, msg } = projectHelper.nameValidator(project.id, project.name) //just a double protectiton
        const tempIsNew = project.isNew()

		if (isValid) {
            projectHelper.unshift(project)
            projectHelper.allToLs()
            
            if (tempIsNew) {
                project.clearValue()
            }

            _isInitialRender.current = true
            _setIsOpenForm(false)
        } else {
            setNameError(!isValid, msg)
        }
	}


    // -> just ui helper / not logical
	const setNameError = (isInvalid, msg) => {
        _setisSubmitDisabled(isInvalid)
        _setisNameError(isInvalid)
        _sethelperText(msg)
    }

    const clearNameError = () => {
        setNameError(false, '')
    }
    // <- just ui helper / not logical

	return (
		<FormDialog
			_title = {project.isNew() ? 'Tambah Proyek' : 'Ubah ' + oldValues.name}
			_itemName = 'proyek'
			_dataName = {project.isNew() ? project.name : oldValues.name}
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
				id="name"
				label="Nama"
				value={project.name}
				fullWidth
				onChange={_handleNameChange}
				error={_isNameError}
				helperText={_helperText}
			/>

            <TextField
				autoComplete="off"
				id="date"
				label="Tanggal"
				type="date"
				value={project.date}
				onChange={(e) => project.setDate(e.target.value)}

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
				onChange={(e) => project.setDesc(e.target.value)}
			/>
		</FormDialog>
	)
}