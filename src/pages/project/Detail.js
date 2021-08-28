import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import Survey from 				'../../classes/Survey';
import SurveyForm from 			'../../component/survey/SurveyForm';
import FullscreenDialog from 	'../../component/FullscreenDialog';
import ProjectForm from 		'./List/ProjectForm';
import CriteriaForm from 		'./Detail/CriteriaForm';
import ResponseForm from 		'./Detail/ResponseForm';
import Title from 				'./Detail/Title';
import CriteriaTable from 		'./Detail/CriteriaTable';
import SurveyListTable from 	'./Detail/SurveyListTable';
import ResponseListTable from 	'./Detail/ResponseListTable';
import RsbGraph from 			'./Detail/RsbGraph';
import NetworkChart from 		'./Detail/NetworkChart';



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
		height: '100vh',
		overflow: 'auto',
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

export default function Detail(props) {
	const classes = useStyles();

	const [_isOpenProjectForm, _setIsOpenProjectForm] = useState(false);
	const [_isOpenSurveyForm, _setIsOpenSurveyForm] = useState(false);
	const [_isOpenCriteriaForm, _setIsOpenCriteriaForm] = useState(false);
	const [_isOpenResponseForm, _setIsOpenResponseForm] = useState(false);

	const location = useLocation();

	const projectHelper = props.projectHelper;
	const project = projectHelper.stateToProjectClass(
		useState(
			projectHelper.getProjectByName(
				location.pathname.split('/')[2]
			)
		)
	)






	const surveyState = useState(project.surveys[0] || { })
	const survey = new Survey(surveyState[0], surveyState[1])

	const _handleSurveyNew = () => {
		survey.clearValue()
		_setIsOpenSurveyForm(true)
	}

	const _handleSurveyEdit = (row) => {
		survey.setThis(row)
		_setIsOpenSurveyForm(true)
	}



	const emptyCriteria = {
		id: null,
		symbol: '',
		desc: ''
	}
	const [criteria, setCriteria] = useState(emptyCriteria)

	const _handleCriteriaNew = () => {
		setCriteria(emptyCriteria)
		_setIsOpenCriteriaForm(true)
	}

	const _handleCriteriaEdit = (row) => {
		setCriteria(row)
		_setIsOpenCriteriaForm(true)
	}








	const RenderCriteriaTable = () => (
		<>
			<TitleGrid title='Daftar Kriteria' icon={<AddCircleIcon />} _onClick={() => _handleCriteriaNew()} fullChild="CriteriaTable" />
			<CriteriaTable rows={survey.criterias} _handleCriteriaEdit={_handleCriteriaEdit} totalGap={survey.score.gap || 0} />
		</>
	)

	const RenderResponseListTable = () => (
		<>
			<TitleGrid title='Daftar Responden' icon={<AddCircleIcon />} _onClick={() => _handleResponseNew()} fullChild="ResponseListTable" />
			<ResponseListTable rows={survey.responses} _handleResponseEdit={_handleResponseEdit} />
		</>
	)

	const RenderRsbGraph = (props) => (
		<>
			<TitleGrid title='Diagram Skor RSB' fullChild="RsbGraph" />
			<RsbGraph data={project.toRsbGraphData()} chartId={props.chartId} />
		</>
	)

	const RenderSurveyListTable = () => (
		<>
			<TitleGrid
				title='Daftar Survei'
				icon={<AddCircleIcon />}
				_onClick={() => _handleSurveyNew()}
				fullChild="SurveyListTable"
			/>
			<SurveyListTable rows={project.surveys} survey={survey} _handleSurveyEdit={_handleSurveyEdit} />
		</>
	)

	const RenderNetworkGraph = (props) => (
		<>
			<TitleGrid title='Visualisasi'
			// fullChild="NetworkChart"
			/>
			<NetworkChart data={survey.toNetworkGraphData()} chartId={props.chartId}/>
		</>
	)
	



	const RenderFullscreenChild = () => {
		let el = '';
		switch (fullChild) {

			case 'CriteriaTable':
				el = <RenderCriteriaTable />
				break;

			case 'ResponseListTable':
				el = <RenderResponseListTable />
				break;

			case 'RsbGraph':
				el = <RenderRsbGraph chartId="rsb2" />
				break;

			case 'SurveyListTable':
				el = <RenderSurveyListTable />
				break;

			// case 'NetworkChart':
			// 	el = <RenderNetworkGraph chartId="net2" />
			// 	break;

			default:
				el = (<></>)
				break;
		}

		return el
	}


	const [openFull, setOpenFull] = useState(false)
	const [fullChild, setFullChild] = useState()


	const TitleGrid = (props) => {
		return (
			<Grid container>
				<Grid item xs={8}>

					<Title>{props.title}</Title>
				</Grid>

				<Grid container item xs={4} justifyContent="flex-end">
					{props.icon &&
						<IconButton
							style={{
								// padding: 0,
								marginBottom: 7
							}}
							color='primary'
							onClick={props._onClick}
						>
							{props.icon}
						</IconButton>
					}

					{props.fullChild &&
						<IconButton
							style={{
								// padding: 0,
								marginBottom: 7
							}}
							color='primary'

							onClick={(e) => {
								setOpenFull(!openFull)
								setFullChild(props.fullChild)
							}}
						>
							{openFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
						</IconButton>
					}

				</Grid>
			</Grid>
		)

	}


	let responseVal = []
	survey.criterias.map(criteria =>
		responseVal.push({
			isActive: false,
			criteriaSymbol: criteria.symbol,
			criteriaId: criteria.id,
			criteriaDesc: criteria.desc,
			expectation: 0,
			reality: 0
		})
	)

	const emptyResponse = {
		id: null,
		group: '',
		role: '',
		symbol: '',
		age: '',
		edu: '',
		exp: '',
		response: responseVal
	}

	const [response, setResponse] = useState(emptyResponse)

	const _handleResponseNew = () => {
		setResponse(emptyResponse)
		_setIsOpenResponseForm(true)
	}

	const _handleResponseEdit = (row) => {
		setResponse(row)
		_setIsOpenResponseForm(true)
	}

	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<div className={classes.root}>
			{/* <Outline items={[
				"Ringkasan",
				"Kriteria",
				"Pemangku Kepentingan",
				"Visualisasi Jaringan",
				"TRSB & ARSB",
				"Hasil",
			]} /> */}
			<main className={classes.content}>
				<Toolbar />
				<Container maxWidth="lg" className={classes.container}>
					<Grid container spacing={3}>

						<Grid item xs={12} md={6}>
							<Paper className={classes.paper} >
								<RenderRsbGraph chartId="rsb1" />
							</Paper>
						</Grid>

						<Grid container item xs={12} md={6}>
							<Grid item xs={12}  >
								<Paper className={classes.paper}>
									<TitleGrid title='Deskripsi' icon={<EditIcon />} _onClick={() => _setIsOpenProjectForm(true)} />
									<Typography variant="h6">
										{project.name}
									</Typography>

									<Typography paragraph>
										{project.desc}
									</Typography>
								</Paper>

							</Grid>

							<Grid item xs={12} style={{ marginTop: '24px' }}>
								<Paper className={fixedHeightPaper}>
									<RenderSurveyListTable />
								</Paper>

							</Grid>
						</Grid>

						{!survey.isNew() &&
							<>
								<Grid item md={6} xs={12}>
									<Paper className={fixedHeightPaper}>
										<RenderCriteriaTable />
									</Paper>
								</Grid>
								<Grid item md={6} xs={12}>
									<Paper className={fixedHeightPaper}>
										<RenderResponseListTable />
									</Paper>
								</Grid>
								<Grid item md={12} xs={12}>
									<Paper className={classes.paper}>
										<RenderNetworkGraph chartId="net1" />
									</Paper>
								</Grid>
							</>
						}



					</Grid>
				</Container>
			</main>


			<SurveyForm
				projectHelper={props.projectHelper}
				project={project}
				survey={survey}
				_isOpenForm={_isOpenSurveyForm}
				_setIsOpenForm={_setIsOpenSurveyForm}
			/>

			<CriteriaForm
				projectHelper={props.projectHelper}
				project={project}
				survey={survey}
				criteria={criteria}
				setCriteria={setCriteria}
				_isOpenForm={_isOpenCriteriaForm}
				_setIsOpenForm={_setIsOpenCriteriaForm}
			/>

			<ResponseForm
				projectHelper={props.projectHelper}
				project={project}
				survey={survey}
				response={response}
				setResponse={setResponse}
				_isOpenForm={_isOpenResponseForm}
				_setIsOpenForm={_setIsOpenResponseForm}
			/>

			<ProjectForm
				projectHelper={props.projectHelper}
				project={project}
				_isOpenForm={_isOpenProjectForm}
				_setIsOpenForm={_setIsOpenProjectForm}
			/>

			<FullscreenDialog isOpen={openFull} child={
				<>
					<Toolbar />
					<RenderFullscreenChild />
					<Toolbar />
					<Toolbar />
				</>
			} />
		</div>
	);
}


