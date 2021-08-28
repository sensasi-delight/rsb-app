import { Drawer, ListItem, ListItemText, makeStyles, Toolbar, List, Typography } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},

	drawerPaper: {
		width: drawerWidth,
        padding: theme.spacing(4)
	},

	drawerContainer: {
		overflow: "auto",
	}
}));

export default function Outline(props) {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <Typography variant='button'>
                Daftar Isi
            </Typography>
            <div className={classes.drawerContainer}>
                <List dense>
                    {props.items.map((text, index) => (
                        <ListItem key={text} button component="a" href={"#" + text}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    )
}