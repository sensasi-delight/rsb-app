import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import HomeIcon from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";
import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},

	grow: {
		flexGrow: 1,
	},

	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	}
}));

export default function MainAppBar() {
	const classes = useStyles();

	const projectName = useLocation().pathname.split("/")[2];

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
					>
						<HomeIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{projectName}
					</Typography>
				</Toolbar>
			</AppBar>
		</div>
	);
}
