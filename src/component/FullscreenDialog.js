import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import Container from '@material-ui/core/Container';


const FullscreenDialog = props => {

	return (
		<Dialog
			// keepMounted
			fullScreen
			open={props.isOpen}
		>
			<Container maxWidth="lg">
				{props.children}
			</Container>
		</Dialog>
	);
}

FullscreenDialog.propTypes = {
	children: PropTypes.node,
};

export default FullscreenDialog