import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function Notification(props) {
	return (
		<Snackbar
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			open={true}
			autoHideDuration={6000}
			message={props.msg}
			action={
				<IconButton
					size="small"
					aria-label="close"
					color="inherit"
					// onClick={handleClose}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			}
		/>
	);
}
