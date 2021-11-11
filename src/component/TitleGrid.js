import PropTypes from 'prop-types';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
// import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import CloseIcon from '@material-ui/icons/Close';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';


TitleGrid.propTypes = {
	title: PropTypes.string.isRequired,
};

export default function TitleGrid(props) {
	return (
		<Grid container>
			<Grid item xs={8}>
				<Typography component="h2" variant="h6" color="primary" gutterBottom>
					{props.title}
				</Typography>

			</Grid>

			<Grid container item xs={4} justifyContent="flex-end">
				{props.icon &&
					<Tooltip title={props.tooltip}>
						<IconButton
							style={{ marginBottom: 7 }}
							color='primary'
							onClick={props._onClick}
						>
							{props.icon}
						</IconButton>
					</Tooltip>
				}

				{props.fullS &&
					<Tooltip title={props.isFullS ? "Tutup Halaman" : "Layar Penuh"}>
						<IconButton
							style={{ marginBottom: 7 }}
							color='primary'
							onClick={props._onClickFullS}
						>
							{props.isFullS ? <CloseIcon /> : <FullscreenIcon />}
						</IconButton>
					</Tooltip>
				}

			</Grid>
		</Grid>
	)
}