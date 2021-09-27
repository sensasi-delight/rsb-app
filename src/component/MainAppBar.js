import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";

import HomeIcon from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";
import { Link, useLocation } from "react-router-dom";


export default function MainAppBar() {

	const projectName = useLocation().pathname.split("/")[2];

	return (
		<>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						edge="start"
						color="inherit"
						aria-label="menu"
					>
						<HomeIcon />
					</IconButton>
					<Container maxWidth="md" disableGutters>

						<Typography variant="h6">
							{projectName}
						</Typography>
					</Container>
				</Toolbar>
			</AppBar>
		</>
	);
}
