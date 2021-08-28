import { Checkbox, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import FormDialog from "../../../component/FormDialog";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

export default function ResponseForm(props) {

	const { projectHelper, project, survey, response, setResponse } = props

	const [responseTemp, setResponseTemp] = useState({ ...response })

	let responseVal = []
	survey.criterias.map(criteria =>
		responseVal.push({
			isActive: false,
			criteriaSymbol: criteria.symbol,
			criteriaDesc: criteria.desc,
			criteriaId: criteria.id,
			expectation: 0,
			reality: 0
		})
	)

	const clear = {
		id: null,
		group: '',
		role: '',
		symbol: '',
		age: '',
		edu: '',
		exp: '',
		response: responseVal
	}

	const { _isOpenForm, _setIsOpenForm } = props;

	const [_isSubmitDisabled, _setisSubmitDisabled] = useState(true);
	const [_isOpenCancelDialog, _setIsOpenCancelDialog] = useState(false)

	let isDirty = responseTemp.id === null && (responseTemp.role !== '' || responseTemp.symbol !== '')
	let isChanged = responseTemp.id !== null && (responseTemp.role !== response.desc || responseTemp.symbol !== response.symbol)
	let isFulfill = responseTemp.role !== '' && responseTemp.symbol !== '' && responseTemp.group !== '' && responseTemp.age !== ''

	useEffect(() => {

		setResponseTemp({ ...response })
	}, [response])


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
			_setIsOpenForm(false)
		}
	}

	const _handleCancel = (isCanceled) => {
		_setIsOpenCancelDialog(false)

		if (isCanceled) {
			_setIsOpenForm(false)
			setResponseTemp({ ...response })
		}
	}

	const _handleSubmit = () => {

		if (responseTemp.id === null) {
			responseTemp.id = new Date()
			survey.responses.push(responseTemp)
		} else {
			const index = survey.getResponseIndex(responseTemp.id)
			survey.responses[index] = responseTemp
		}

		survey.responses.sort((a, b) => (parseInt(a.symbol.substring(1)) < parseInt(b.symbol.substring(1)) ? -1 : 1))
		survey.calcAndSetRSB()

		const surveyIndex = project.getSurveyIndex(survey.id)

		if (surveyIndex !== -1) {
			project.surveys[surveyIndex] = survey

			project.setThis(project)

			projectHelper.unshift(project)
			projectHelper.allToLs()

			setResponse(clear)
			_setIsOpenForm(false)
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
			_width="md"
			_title={response.id === null ? 'Tambah Kriteria' : 'Ubah ' + response.symbol}
			_itemName='kriteria'
			_dataName={response.symbol || responseTemp.symbol || 'kriteria'}
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
				label="Kelompok"
				value={responseTemp.group}
				fullWidth
				onChange={(e) => {
					responseTemp.group = e.target.value
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

			<FormControl fullWidth style={{ marginTop: '8px' }}>
				<InputLabel id="select-label">Usia</InputLabel>
				<Select
					labelId="select-label"
					value={responseTemp.age}
					onChange={(e) => {
						responseTemp.age = e.target.value
						setResponseTemp({ ...responseTemp })
					}}
				>
					{[
						'18-25 Tahun',
						'26-33 Tahun',
						'34-41 Tahun',
						'42-49 Tahun'
					].map((opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)}
				</Select>
			</FormControl>

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

			<FormControl fullWidth style={{ marginTop: '8px' }}>
				<InputLabel id="select-label">Pengalaman</InputLabel>
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
			</FormControl>


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
							}}>{row.criteriaDesc}</TableCell>
							<TableCell>{row.criteriaSymbol}</TableCell>
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