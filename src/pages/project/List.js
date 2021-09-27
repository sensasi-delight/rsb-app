import { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import { makeStyles } from "@material-ui/core/styles";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import SearchIcon from "@material-ui/icons/Search";

import ProjectCard from "./List/ProjectCard";
import ProjectForm from "./List/ProjectForm";

const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		// backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(8, 0, 6),
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	},
	card: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},

	cardMedia: {
		paddingTop: "56.25%", // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
}));



export default function List(props) {
	// window.scrollTo(0, 0);
	const { projectHelper } = props;

	const classes = useStyles();

	const [_isOpenForm, _setIsOpenForm] = useState(false);

	const [_query, _setQuery] = useState('')

	const [_filteredProjects, _setFilteredProjects] = useState(projectHelper.all)

	// bug note : double useffect di ProjectFrom
	useEffect(() => {
		_setFilteredProjects(projectHelper.all.filter(project => project.name.toLowerCase().includes(_query) || project.desc.toLowerCase().includes(_query)))
	}, [_query, projectHelper.all])

	return (
		<main>
			<div className={classes.heroContent}>
				<Container maxWidth="sm">
					<TextField
						autoComplete="off"
						margin="dense"
						id="search"
						label="Cari"
						fullWidth
						variant="outlined"
						value={_query}
						onChange={(e) => _setQuery(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</Container>
			</div>

			<Container className={classes.cardGrid} maxWidth="md">
				<Grid container spacing={4}>
					<Grid item xs={12} sm={6} md={4}>
						<Button
							onClick={() => _setIsOpenForm(true)}
							style={{ height: "100%" }}
							fullWidth
							variant="outlined"
							color="primary"
							size="large"
							startIcon={<AddOutlinedIcon />}
						>
							Tambah Proyek
						</Button>
					</Grid>

					{_filteredProjects.map((project) => (
						<Grid item key={project.name} xs={12} sm={6} md={4}>
							<ProjectCard
								title={project.name}
								desc={project.desc}
								to={"/project/" + project.name}
							/>
						</Grid>
					))}
				</Grid>
			</Container>


			<ProjectForm
				projectHelper={props.projectHelper}
				project={projectHelper.stateToProjectClass(useState({}))}
				_isOpenForm={_isOpenForm}
				closeForm={() => { _setIsOpenForm(false) }}
			/>
		</main>
	)
}
