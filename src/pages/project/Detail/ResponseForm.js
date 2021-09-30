import { useEffect, useState } from "react";

import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import FormDialog from "../../../component/FormDialog";
import { Container, InputAdornment, Typography } from "@material-ui/core";




const ResponseForm = props => {
	const { projectHelper, project, response, survey } = props

	const [responseTemp, setResponseTemp] = useState({ ...response })

	const { _isOpenForm, closeForm } = props;

	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true);
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

	let isDirty = responseTemp.id === null && (responseTemp.role !== '' || responseTemp.symbol !== '')
	let isChanged = responseTemp.id !== null && (responseTemp.role !== response.desc || responseTemp.symbol !== response.symbol)
	let isFulfill = responseTemp.role !== '' && responseTemp.symbol !== '' && responseTemp.group !== '' && responseTemp.age !== ''



	// SYNC CRITERIAS
	//
	//
	//
	useEffect(() => {

		const criteriaIds = survey.criterias.map(criteria => criteria.id)
		const responseCriteriaIds = response.response.map(resCr => resCr.criteriaId)

		if (criteriaIds.join(',') !== responseCriteriaIds.join(',')) {
			const temp = { ...response }
			temp.response = criteriaIds.map((id, i) => {
				const found = response.response.find(resCr => resCr.criteriaId === id)

				if (found) {
					return found
				} else {
					return {
						isActive: false,
						criteriaId: id,
						expectation: 0,
						reality: 0
					}
				}
			})

			setResponseTemp(temp)
		}
	}, [survey, response])
	// EOL


	useEffect(() => {

		if ((isDirty || isChanged) && isFulfill) {
			return _setisSubmitDisabled(false)
		} else {
			return _setisSubmitDisabled(true)
		}
	}, [isDirty, isChanged, isFulfill])


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
			setResponseTemp({ ...response })
		}
	}

	const _handleSubmit = () => {

		if (responseTemp.id === null) {
			responseTemp.id = Date.now()
			survey.responses.push(responseTemp)
		} else {
			const resIndex = survey.getResponseIndexById(responseTemp.id)

			if (resIndex !== -1) {
				survey.responses[resIndex] = responseTemp
			}
		}


		survey.responsesSort()
		survey.calcAndSetRSB()

		const surveyIndex = project.getSurveyIndex(survey.id)

		if (surveyIndex !== -1) {
			project.surveys[surveyIndex] = survey

			projectHelper.unshift(project)
			projectHelper.allToLs()
			
			props.setProject(project)
			closeForm()
		}
	}


	const _handleExpectClick = (index, val) => {
		responseTemp.response[index].expectation = val
		setResponseTemp({ ...responseTemp })
	}

	const _handleRealityClick = (index, val) => {
		responseTemp.response[index].reality = val
		setResponseTemp({ ...responseTemp })
	}


	const _handleIsActiveClick = (index, val) => {
		responseTemp.response[index].isActive = val
		setResponseTemp({ ...responseTemp })
	}


	return (
		<FormDialog
			id={props.id}
			_width="md"
			_title={response.id === null ? 'Tambah responden' : 'Ubah ' + response.symbol}
			_itemName='responden'
			_dataName={response.symbol || responseTemp.symbol || 'responden'}
			_isOpenForm={_isOpenForm}
			_isSubmitDisabled={_isSubmitDisabled}
			_isOpenCancelDialog={_isOpenCancelDialog}

			_handleSubmit={_handleSubmit}
			_handleCancel={_handleCancel}
			_handleCloseForm={_handleCloseForm}
		>

			<Container maxWidth="sm">
				<Typography variant="h6" color="primary" style={{marginTop: '2em', marginBottom: '1em'}}>Data Responden:</Typography>

				
				<TextField
					autoFocus
					required
					autoComplete="off"
					margin="dense"
					label="Kategori"
					value={responseTemp.group}
					fullWidth
					onChange={(e) => {
						responseTemp.group = e.target.value
						setResponseTemp({ ...responseTemp })
					}}
					style={{ paddingBottom: '2em' }}
				/>

				<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Simbol"
					value={responseTemp.symbol}
					fullWidth
					onChange={(e) => {
						responseTemp.symbol = e.target.value
						setResponseTemp({ ...responseTemp })
					}}
				/>


				<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Peran"
					value={responseTemp.role}
					fullWidth
					onChange={(e) => {
						responseTemp.role = e.target.value
						setResponseTemp({ ...responseTemp })
					}}
				/>

				<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Usia"
					value={responseTemp.age}
					fullWidth
					onChange={(e) => {
						responseTemp.age = e.target.value
						setResponseTemp({ ...responseTemp })
					}}
					type="number"
					InputProps={{
						min: 0,
						endAdornment: <InputAdornment position="start">Tahun</InputAdornment>,
					}}
				/>

				{/* <FormControl fullWidth style={{ marginTop: '8px' }}>
				<InputLabel id="select-label"></InputLabel>
				<Select
					labelId="select-label"
					value={responseTemp.age}
					onChange={(e) => {
						
					}}
				>
					{[
						'18-25 Tahun',
						'26-33 Tahun',
						'34-41 Tahun',
						'42-49 Tahun'
					].map((opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)}
				</Select>
			</FormControl> */}



				<FormControl fullWidth style={{ marginTop: '8px' }}>
					<InputLabel id="select-label">Pendidikan Terakhir</InputLabel>
					<Select
						labelId="select-label"
						value={responseTemp.edu}
						fullWidth
						onChange={(e) => {
							responseTemp.edu = e.target.value
							setResponseTemp({ ...responseTemp })
						}}
					>
						{[
							'SMP',
							'SMA/Sederajat',
							'Sarjana',
							'Magister'
						].map((opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)}
					</Select>
				</FormControl>

				<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Pengetahuan Bangunan"
					value={responseTemp.exp}
					fullWidth
					onChange={(e) => {
						responseTemp.exp = e.target.value
						setResponseTemp({ ...responseTemp })
					}}
					type="number"
					InputProps={{
						min: 0,
						endAdornment: <InputAdornment position="start">Tahun</InputAdornment>,
					}}
				/>

				{/* <FormControl fullWidth style={{ marginTop: '8px' }}>
				<InputLabel id="select-label">Pengetahuan Bangunan</InputLabel>
				<Select
					labelId="select-label"
					value={responseTemp.exp}
					fullWidth
					onChange={(e) => {
						responseTemp.exp = e.target.value
						setResponseTemp({ ...responseTemp })
					}}

				>
					{[
						'<2 Tahun',
						'2-4 Tahun',
						'4-6 Tahun',
						'6-8 Tahun'
					].map((opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)}
				</Select>
			</FormControl> */}

			<Typography variant="h6" color="primary" style={{marginTop: '2em'}}>Isian Responden:</Typography>
			</Container>




			<Table size="small" style={{ marginTop: '24px' }}>
				<TableHead>
					<TableRow>
						<TableCell>Kepentingan</TableCell>
						<TableCell>Kriteria</TableCell>
						<TableCell>Simbol</TableCell>
						<TableCell>Ekspektasi</TableCell>
						<TableCell>Realita</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{responseTemp.response.map((row, i) => (
						<TableRow key={row.criteriaId}>
							<TableCell>
								<Checkbox
									checked={row.isActive}
									color="primary"
									onClick={() => _handleIsActiveClick(i, !row.isActive)}
								/>
							</TableCell>
							<TableCell width="10%" style={{
								color: row.isActive ? "inherit" : "#AAA"
							}}>{survey.getCriteriaDescById(row.criteriaId)}</TableCell>
							<TableCell>{survey.getCriteriaSymbolById(row.criteriaId)}</TableCell>
							<TableCell >
								{row.isActive &&
									<FormControl component="fieldset">
										<RadioGroup row name="expectation"
											defaultValue="0"
											value={row.expectation}
										>
											{['1', '2', '3', '4', '5'].map(val => <FormControlLabel
												style={{ margin: '0px' }}
												key={val}
												value={val}
												control={<Radio color="primary" size="small"
													onClick={() => _handleExpectClick(i, val)}
												/>}
												label={val}
												labelPlacement="top"
											/>)}
										</RadioGroup>
									</FormControl>
								}
							</TableCell>
							<TableCell>
								{row.isActive &&
									<FormControl component="fieldset">
										<RadioGroup row name="reality"
											defaultValue="0"
											value={row.reality}
										>
											{["1", "2", "3", "4", "5"].map(val => <FormControlLabel
												style={{ margin: '0px' }}
												key={val}
												value={val}
												control={<Radio color="primary" size="small"
													onClick={() => _handleRealityClick(i, val)}
												/>}
												label={val}
												labelPlacement="top"
											/>)}
										</RadioGroup>
									</FormControl>
								}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

		</FormDialog >
	)
}



export default ResponseForm