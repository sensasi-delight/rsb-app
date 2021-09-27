import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';


import AddCircleIcon from '@material-ui/icons/AddCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import PrintIcon from '@material-ui/icons/Print';

//CLASSSES
import Survey from '../../classes/Survey';
import Project from '../../classes/Project';
import { getEmptySurvey, print } from '../../classes/Helper';

import SurveyForm from '../../component/survey/SurveyForm';
import FullscreenDialog from '../../component/FullscreenDialog';
import ProjectForm from './List/ProjectForm';
import CriteriaForm from './Detail/CriteriaForm';
import ResponseForm from './Detail/ResponseForm';
import SurveyListTable from './Detail/SurveyListTable';
import ResponseListTable from './Detail/ResponseListTable';
// import RsbGraph from './Detail/RsbGraph';
import NetworkChart from './Detail/NetworkChart';
import PieChart from './Detail/PieChart';
import DetailTable from './Detail/DetailTable';
import CritertiaGraph from './Detail/CriteriaGraph';
import TitleGrid from '../../component/TitleGrid';
import CriteriaTable2 from './Detail/CriteriaTable2';
import TabPanel from './Detail/TabPanel';
import RsbGraph2 from './Detail/RsbGraph2';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';



const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	informationCard: {
		marginTop: theme.spacing(4),
		padding: theme.spacing(4),
		paddingBottom: theme.spacing(3),
		backgroundColor: "rgb(0 0 255 / 8%)"
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},

	content: {
		flexGrow: 1,
		// height: '100vh',
		// overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 350,
	},
}));




let varResponse = undefined
let varCriteria = undefined

export default function Detail(props) {
	// window.scrollTo(0, 0);



	// UI
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	const [selectedTab, setSelectedTab] = useState(0);
	const [uiToggle, setUiToggle] = useState({
		projectForm: false,
		surveyForm: false,
		criteriaForm: false,
		responseForm: false,
		surveySetting: false,
	})

	const toggleUi = (name) => {
		uiToggle[name] = !uiToggle[name]
		setUiToggle({ ...uiToggle })
	}




	const location = useLocation();

	const [project, setProjectTemp] = useState(new Project(props.projectHelper.getProjectByName(
		location.pathname.split('/')[2]
	) || {}))

	const setProject = project => setProjectTemp(new Project(project))

	const [rsb1chart, setRsb1Chart] = useState(undefined)
	const [pieChart1, setPieChart1] = useState(undefined)
	const [pieChart2, setPieChart2] = useState(undefined)
	const [pieChart3, setPieChart3] = useState(undefined)
	const [pieChart4, setPieChart4] = useState(undefined)


	const [selectedSurvey, setSelectedSurvey] = useState(new Survey({}))
	const [editedSurvey, setEditedSurvey] = useState(undefined)
	const [networkChart, setNetworkChart] = useState(undefined)
	const [criteriaChart, setCriteriaChart] = useState(undefined)

	const detailTableDataRows = useMemo(() => selectedSurvey.getDetailTableData(), [selectedSurvey])


	useEffect(() => {
		setSelectedSurvey(new Survey(selectedSurvey.id ? project.getSurvey(selectedSurvey.id) : {}))
	}, [project, selectedSurvey.id])

	useEffect(() => {
		if (rsb1chart) {
			// rsb1chart.data = project.getRsbGraphData()
			rsb1chart.data = project.getRsbGraph2Data()
		}

	}, [rsb1chart, project]);

	useEffect(() => {
		if (pieChart1) {
			pieChart1.data = selectedSurvey.getPieChartData2('group')
		}

		if (pieChart2) {
			pieChart2.data = selectedSurvey.getPieChartData2('edu')
		}


		if (pieChart3) {
			pieChart3.data = selectedSurvey.getPieChartData2('age')
		}

		if (pieChart4) {
			pieChart4.data = selectedSurvey.getPieChartData2('exp')
		}

	}, [pieChart1, pieChart2, pieChart3, pieChart4, selectedSurvey]);



	useEffect(() => {
		if (criteriaChart && !selectedSurvey.isNew()) {
			criteriaChart.data = selectedSurvey.getCriteriaGraphData()
		}
	}, [criteriaChart, selectedSurvey]);


	useEffect(() => {

		if (networkChart && !selectedSurvey.isNew()) {
			networkChart.data = selectedSurvey.toNetworkGraphData()
		}

	}, [networkChart, selectedSurvey]);





	const _handleCriteriaNew = () => {
		varCriteria = Survey.emptyCriteria
		toggleUi('criteriaForm')
	}

	const _handleCriteriaEdit = row => {
		varCriteria = row
		toggleUi('criteriaForm')
	}

	const _handleResponseNew = () => {
		varResponse = selectedSurvey.getEmptyResponse()
		toggleUi('responseForm')
	}

	return (
		<div className={classes.root}>

			<main className={classes.content}>
				<Container maxWidth="md" className={classes.container}>
					<Grid container spacing={3}>

						<Grid item xs={12}  >
							<Paper className={classes.paper} elevation={4}>
								<TitleGrid title='Deskripsi' icon={<EditIcon />} tooltip="Ubah" _onClick={() => toggleUi('projectForm')} />
								<Typography variant="h6">
									{project.name}
								</Typography>

								<Typography paragraph>
									{project.desc}
								</Typography>
							</Paper>

						</Grid>

						{project.surveys.length !== 0 &&
							<Grid item xs={12} md={12}>
								<Paper className={classes.paper} elevation={4}>
									{/* <TitleGrid title='Kinerja Keseluruhan' /> */}
									<TitleGrid title='Skor Keseluruhan' />
									{/* <RsbGraph chartId="rsb1" onInitialize={setRsb1Chart} /> */}
									<RsbGraph2 chartId="rsb1" onInitialize={setRsb1Chart} />
								</Paper>
							</Grid>}


						{/* DAFTAR SURVEY */}
						<Grid item xs={12}>
							<Paper className={fixedHeightPaper} elevation={4}>
								<TitleGrid
									title='Daftar Survei'
									icon={<AddCircleIcon />}
									tooltip="Tambah Survei"
									_onClick={() => {
										setEditedSurvey(getEmptySurvey())
										toggleUi('surveyForm')
									}}
								/>

								{project.surveys.length === 0 ?
									<Paper className={classes.informationCard} elevation={4}>

										<Typography variant="body1">Belum ada data survei untuk projek ini, silahkan tambahkan data survei terlebih dahulu</Typography>
										<Typography variant="body2">
											klik <IconButton
												style={{ marginBottom: 7 }}
												color='primary'
												onClick={() => {
													setEditedSurvey(getEmptySurvey())
													toggleUi('surveyForm')
												}}
											>
												<AddCircleIcon />
											</IconButton>
											untuk menambah data</Typography>

									</Paper>
									: <SurveyListTable rows={project.surveys} idSelected={selectedSurvey.id}
										setSelected={(row) => setSelectedSurvey(new Survey(row))}

										openSettingForm={() => {
											setSelectedTab(0)
											toggleUi('surveySetting')
										}}

										_handleSurveyEdit={(row) => {
											setEditedSurvey(row)
											toggleUi('surveyForm')
										}}
									/>
								}
							</Paper>

						</Grid>

						{selectedSurvey.id &&
							<Grid item md={12} xs={12}>
								<Paper className={classes.paper} elevation={4}>
									<TitleGrid
										title={'Hasil Survei ' + selectedSurvey.date}
									/>

									{selectedSurvey.criterias.length === 0 || selectedSurvey.responses.length === 0 ?
										<Paper className={classes.informationCard} elevation={4}>
											<Typography variant="body1">Belum ada data kriteria atau responden pada survei ini, silahkan melakukan pengaturan survei terlebih dahulu.</Typography>
											<Typography variant="body2">
												klik <IconButton
													style={{ marginBottom: 7 }}
													color='primary'
													onClick={() => {
														setSelectedTab(0)
														toggleUi('surveySetting')
													}}
												>
													<SettingsIcon />
												</IconButton>
												untuk melakuan pengaturan kriteria atau responden</Typography>
										</Paper>
										:
										<>
											<Tabs
												centered
												value={selectedTab}
												indicatorColor="primary"
												textColor="primary"
												onChange={(event, newValue) => {
													setSelectedTab(newValue)
												}}
												style={{ marginTop: '2em' }}
											>
												{/* <Tab label="Fuzzy" /> */}
												<Tab label="Ringkasan" />
												<Tab label="Demografi Responden" />
												<Tab label="Skor Kriteria" />
												<Tab label="Relasi Kriteria-Responden" />
												<Tab label="Rincian" />
											</Tabs>

											{/* RINGKASAN */}
											<TabPanel value={selectedTab} index={0} style={{ padding: "2em", paddingTop: '4em' }}>

												<Grid container spacing={3}>

													<Grid item xs={8}>
														<Paper className={classes.paper} elevation={4} style={{ padding: "1em" }}>
															<Typography variant="h5" align="left" style={{ paddingBottom: "1em" }} component="p">
																<strong>Rekomendasi Prioritas</strong>
															</Typography>
															<Table size="small">
																<TableHead>
																	<TableRow>
																		<TableCell>#</TableCell>
																		<TableCell>Simbol</TableCell>
																		<TableCell>Kriteria</TableCell>
																		<TableCell>Skor</TableCell>
																	</TableRow>

																</TableHead>
																<TableBody>
																	{detailTableDataRows.slice(0, 10).map(row =>
																		<TableRow key={row.id}>
																			<TableCell>{row.rank}</TableCell>
																			<TableCell>{row.symbol}</TableCell>
																			<TableCell>{row.desc}</TableCell>
																			<TableCell style={{ color: row.rate < 5 ? 'red' : 'green' }}>{row.rate.toFixed(2)}</TableCell>
																		</TableRow>
																	)}
																	{detailTableDataRows.length > 10 &&
																		<TableRow>
																			<TableCell>...</TableCell>
																			<TableCell>...</TableCell>
																			<TableCell>...</TableCell>
																			<TableCell>...</TableCell>
																		</TableRow>
																	}
																</TableBody>

															</Table>



														</Paper>

														<Button style={{ marginTop: '4em' }} variant="outlined" onClick={() => setSelectedTab(4)} color="primary">
															Liat Rincian...
														</Button>
													</Grid>



													<Grid item xs={4}>
														<Grid container spacing={3}>
															<Grid item xs={12}>
																<Paper className={classes.paper} elevation={4} style={{ padding: "1em 0em" }}>
																	<Grid container alignItems="center">
																		<Grid item xs={8} style={{ paddingLeft: "1em" }}>
																			<Typography>Jumlah Kriteria</Typography>
																		</Grid>
																		<Grid item xs={4}>
																			<Typography align="center" variant="h3" component="p">{selectedSurvey.criterias.length}</Typography>
																		</Grid>
																	</Grid>
																</Paper>
															</Grid>

															<Grid item xs={12}>
																<Paper className={classes.paper} elevation={4} style={{ padding: "1em 0em" }}>
																	<Grid container alignItems="center">
																		<Grid item xs={8} style={{ paddingLeft: "1em" }}>
																			<Typography>Jumlah Responden</Typography>
																		</Grid>
																		<Grid item xs={4}>
																			<Typography align="center" variant="h3" component="p">{selectedSurvey.responses.length}</Typography>
																		</Grid>
																	</Grid>
																</Paper>
															</Grid>

															<Grid item xs={12}>
																<Paper className={classes.paper} elevation={4} style={{ padding: "1em" }}>

																	<Typography variant="h5" align="left" gutterBottom component="p">Skor Keseluruhan: </Typography>

																	<Grid container alignItems="flex-end">
																		<Grid item xs={6}>
																			<Typography align="center" variant="h2" component="p" style={{ color: selectedSurvey.score.gap > 0 ? 'red' : 'green' }}>
																				{(5 - selectedSurvey.score.gap).toFixed(2)}
																			</Typography>
																		</Grid>
																		<Grid item xs={6}>
																			<Typography align="left" variant="h5" gutterBottom component="p">/ 5</Typography>
																		</Grid>
																	</Grid>


																</Paper>
															</Grid>


															<Grid item>
																<Paper className={classes.paper} elevation={4} style={{ padding: "1em 0em" }}>
																	<Grid container alignItems="center">
																		<Grid item xs={4}>
																			<Typography align="center" variant="h3" component="p">
																				{detailTableDataRows.filter(row => row.rate < 5).length}
																			</Typography>
																		</Grid>
																		<Grid item xs={8} style={{ paddingRight: "1em" }}>
																			<Typography>kriteria <strong style={{ color: "red" }}>belum mencapai</strong> ekspektasi responden</Typography>
																		</Grid>
																	</Grid>
																</Paper>
															</Grid>


															<Grid item>
																<Paper className={classes.paper} elevation={4} style={{ padding: "1em 0em" }}>
																	<Grid container alignItems="center">
																		<Grid item xs={4}>
																			<Typography align="center" variant="h3" component="p">
																				{detailTableDataRows.filter(row => row.rate === 5).length}

																			</Typography>
																		</Grid>
																		<Grid item xs={8} style={{ paddingRight: "1em" }}>
																			<Typography>kriteria <strong>sesuai dengan</strong> ekspektasi responden</Typography>
																		</Grid>
																	</Grid>
																</Paper>
															</Grid>


															<Grid item>
																<Paper className={classes.paper} elevation={4} style={{ padding: "1em 0em" }}>
																	<Grid container alignItems="center" >
																		<Grid item xs={4}>
																			<Typography align="center" variant="h3" component="p">
																				{detailTableDataRows.filter(row => row.rate > 5).length}

																			</Typography>
																		</Grid>
																		<Grid item xs={8} style={{ paddingRight: "1em" }}>
																			<Typography>kriteria <strong style={{ color: "green" }}>melebihi</strong> ekspektasi responden</Typography>
																		</Grid>
																	</Grid>
																</Paper>
															</Grid>
														</Grid>
													</Grid>
												</Grid>
											</TabPanel>

											<TabPanel value={selectedTab} index={1}>
												<Grid container>
													<Grid item md={6}>
														<PieChart chartId="Kelompok" onInitialize={setPieChart1}></PieChart>
													</Grid>

													<Grid item md={6}>
														<PieChart chartId="Pendidikan" onInitialize={setPieChart2}></PieChart>

													</Grid>

													<Grid item md={6}>
														<PieChart chartId="Usia" onInitialize={setPieChart3}></PieChart>

													</Grid>

													<Grid item md={6}>
														<PieChart chartId="Pengalaman" onInitialize={setPieChart4}></PieChart>

													</Grid>

												</Grid>
												{/* <CritertiaGraph chartId="crChart" onInitialize={setCriteriaChart} /> */}
											</TabPanel>

											<TabPanel value={selectedTab} index={2}>
												<CritertiaGraph chartId="crChart" onInitialize={setCriteriaChart} />
											</TabPanel>


											<TabPanel value={selectedTab} index={3}>
												<NetworkChart chartId="net1" onInitialize={setNetworkChart} />
											</TabPanel>

											<TabPanel value={selectedTab} index={4} style={{ paddingTop: "3em" }}>
												<Button
													style={{ marginBottom: "2em" }}
													variant="contained"
													color="primary"
													size="small"
													startIcon={<PrintIcon />}
													onClick={() => print('detailTableElId', 'ifPrint')}
												>
													Cetak
												</Button>
												<DetailTable id="detailTableElId" rows={detailTableDataRows}></DetailTable>
											</TabPanel>
										</>
									}
								</Paper>
							</Grid>

						}


					</Grid>
				</Container>

			</main>

			<iframe title="ifPrint" id="ifPrint" style={{ height: '0px', width: '0px', position: 'absolute' }} />


			<ProjectForm
				projectHelper={props.projectHelper}
				project={project}
				_setProject={setProject}
				_isOpenForm={uiToggle.projectForm}
				closeForm={() => toggleUi('projectForm')}
			/>


			<SurveyForm
				projectHelper={props.projectHelper}
				project={project}
				survey={editedSurvey}
				setProject={setProject}
				_isOpenForm={uiToggle.surveyForm}
				closeForm={() => {
					toggleUi('surveyForm')
				}}
			/>



			{selectedSurvey.id &&
				<>
					<FullscreenDialog isOpen={uiToggle.surveySetting}>
						<Container maxWidth="md" className={classes.container}>
							<TitleGrid title={'Pengaturan Survey: ' + selectedSurvey.date}

								fullS={true}
								isFullS={uiToggle.surveySetting}
								_onClickFullS={() => toggleUi('surveySetting')}
							/>

							<Tabs
								centered
								value={selectedTab}
								indicatorColor="primary"
								textColor="primary"
								onChange={(event, newValue) => {
									setSelectedTab(newValue);
								}}

							>

								<Tab label="Kriteria" />
								<Tab label="Responden" />
							</Tabs>

							<TabPanel value={selectedTab} index={0}>
								<TitleGrid title='Daftar Kriteria' tooltip="Tambah Kriteria" icon={<AddCircleIcon />} _onClick={_handleCriteriaNew} />

								{/* {
									selectedSurvey.criterias.length !== 0 &&
									<Button
										style={{ marginBottom: "2em" }}
										variant="contained"
										color="primary"
										size="small"
										startIcon={<PrintIcon />}
										onClick={() => print('responseForm', 'ifPrint')}
									>
										Cetak
									</Button>
								} */}

								{
									selectedSurvey.criterias.length === 0 ?

										<Paper className={classes.informationCard} elevation={4}>
											<Typography variant="body1">Belum ada kriteria untuk survei ini, silahkan tambahkan kriteria terlebih dahulu</Typography>
											<Typography variant="body2">
												klik <IconButton
													style={{ marginBottom: 7 }}
													color='primary'
													onClick={_handleCriteriaNew}
												>
													<AddCircleIcon />
												</IconButton>
												untuk menambah kriteria</Typography>
										</Paper>
										:

										<CriteriaTable2 id="criteriaTable" rows={selectedSurvey.criterias} _handleCriteriaEdit={_handleCriteriaEdit} />

								}
							</TabPanel>


							<TabPanel value={selectedTab} index={1}>
								<TitleGrid title='Daftar Responden' tooltip="Tambah Responden" icon={<AddCircleIcon />} _onClick={_handleResponseNew} />

								{
									selectedSurvey.responses.length === 0 ?

										<Paper className={classes.informationCard} elevation={4}>
											<Typography variant="body1">Belum ada responden untuk survei ini, silahkan tambahkan responden terlebih dahulu</Typography>
											<Typography variant="body2">
												klik <IconButton
													style={{ marginBottom: 7 }}
													color='primary'
													onClick={_handleResponseNew}
												>
													<AddCircleIcon />
												</IconButton>
												untuk menambah responden</Typography>
										</Paper>
										:
										<ResponseListTable rows={selectedSurvey.responses} _handleResponseEdit={row => {
											varResponse = row
											toggleUi('responseForm')
										}} />
								}

							</TabPanel>
						</Container>
					</FullscreenDialog>


					{varCriteria &&
						<CriteriaForm
							projectHelper={props.projectHelper}
							project={project}
							survey={selectedSurvey}
							criteria={varCriteria}
							setProject={setProject}
							_isOpenForm={uiToggle.criteriaForm}
							closeForm={() => {
								varCriteria = undefined
								toggleUi('criteriaForm')
							}}
						/>
					}

					{varResponse &&
						<ResponseForm
							id="responseForm"
							projectHelper={props.projectHelper}
							project={project}
							survey={selectedSurvey}
							response={varResponse}
							setProject={setProject}
							_isOpenForm={uiToggle.responseForm}
							closeForm={() => {
								varResponse = undefined
								toggleUi('responseForm')
							}}
						/>
					}
				</>
			}


		</div>
	);
}


