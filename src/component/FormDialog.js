import { forwardRef } from 		"react";

import { makeStyles } from 		"@material-ui/core";
import AppBar from				"@material-ui/core/AppBar";
import Container from			"@material-ui/core/Container";
import Grid from				"@material-ui/core/Grid";
import IconButton from			"@material-ui/core/IconButton";
import Toolbar from 			"@material-ui/core/Toolbar";
import Typography from 			"@material-ui/core/Typography";
import Button from 				"@material-ui/core/Button";
import Dialog from 				"@material-ui/core/Dialog";
import DialogActions from 		"@material-ui/core/DialogActions";
import DialogContent from 		"@material-ui/core/DialogContent";
import DialogContentText from 	"@material-ui/core/DialogContentText";
import DialogTitle from 		"@material-ui/core/DialogTitle";
import Slide from 				"@material-ui/core/Slide";

import CloseIcon from 			"@material-ui/icons/Close";



const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},

	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},

	content: {
		paddingTop: theme.spacing(4)
	},

	btnBox: {
		marginTop: theme.spacing(2)
	}
}));

export default function FormDialog(props) {
	const classes = useStyles();

	const { _itemName, _title, _dataName } = props
	const { _isOpenForm, _isOpenCancelDialog, _isSubmitDisabled } = props
	const { _handleSubmit, _handleCloseForm, _handleCancel } = props

	return (
		<>
			<Dialog fullScreen
				open={_isOpenForm}
				onClose={_handleCloseForm}
				aria-labelledby="form-dialog-title"
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							{_title}
						</Typography>
						<IconButton color="inherit" onClick={_handleCloseForm} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<DialogContent  className={classes.content}>
					<Container maxWidth={props._width || "sm"}>
						<DialogContentText>
							Silahkan masukkan data {_itemName} pada kolom yang telah sediakan.
						</DialogContentText>

						{props.children}

						<Grid container className={classes.btnBox} justifyContent="flex-end">
							<Button
								disabled={_isSubmitDisabled}
								onClick={_handleSubmit}
								color="primary"
								variant="contained"
							>
								Simpan
							</Button>
						</Grid>
					</Container>
				</DialogContent>
			</Dialog>

			<Dialog
				open={_isOpenCancelDialog}
				TransitionComponent={Transition}
				fullWidth={true}
				maxWidth='sm'
				onClose={() => _handleCancel(false)}
			>
				<DialogTitle>{"Apa anda yakin ingin membatalkan perubahan?"}</DialogTitle>
				<DialogContent>
					<DialogContentText >
						Data <strong>{_dataName}</strong> tidak akan disimpan.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => _handleCancel(false)} color="primary" variant="text">
						Tidak
					</Button>
					<Button onClick={() => _handleCancel(true)} color="secondary" variant="text">
						Iya
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
