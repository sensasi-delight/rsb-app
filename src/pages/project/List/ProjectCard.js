import {
	Button,
	Card,
	CardActions,
	CardContent,
	Typography
} from "@material-ui/core";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
	card: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	
	cardContent: {
		flexGrow: 1,
	}
}));



export default function ProjectCard(props) {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardContent className={classes.cardContent}>
				<Typography gutterBottom variant="h5" component="h2">
					{props.title}
				</Typography>
				<Typography>{props.desc}</Typography>
			</CardContent>
			<CardActions>
				<Button component={Link} size="small" color="primary" to={props.to}>
					View
				</Button>
			</CardActions>
		</Card>
	);
};