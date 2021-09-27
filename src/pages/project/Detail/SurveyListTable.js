import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import TableRow from '@material-ui/core/TableRow';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
	tableRow: {
		"&$selected, &$selected:hover": {
			backgroundColor: "rgb(0 0 255 / 8%)"
		}
	},
	hover: {},
	selected: {}
}));



SurveyListTable.propTypes = {
	idSelected: PropTypes.string
};

export default function SurveyListTable(props) {
	const classes = useStyles()
	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>TGL</TableCell>
					<TableCell >Kriteria</TableCell>
					<TableCell>Responden</TableCell>
					<TableCell>Total Kesenjangan</TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{props.rows.map((row) => (
					<TableRow
						className={classes.tableRow}
						classes={{ selected: classes.selected }}
						key={row.id}
						selected={row.id === props.idSelected}
					>
						<TableCell className={classes.tableRow}>{row.date}</TableCell>

						<TableCell >
							{row.criterias ? row.criterias.length : '-'}
						</TableCell>

							<TableCell >
								{row.responses ? row.responses.length : '-'}
							</TableCell>

							<TableCell>{row.score && row.score.gap ? row.score.gap.toFixed(2) : '-'}</TableCell>

							<TableCell>
								<Tooltip title="Ubah Informasi">
									<span>

									<IconButton size="small" color="primary"
										disabled={!(row.id === props.idSelected)}
										onClick={() => props._handleSurveyEdit(row)}
										>
										<EditIcon />
									</IconButton>
										</span>
								</Tooltip>
							</TableCell>

							<TableCell>
								<Tooltip title="Pengaturan">
									<span>
									<IconButton size="small" color="primary"
										disabled={!(row.id === props.idSelected)}

										onClick={() => props.openSettingForm()}
									>
										<SettingsIcon />
									</IconButton>
									</span>

								</Tooltip>
							</TableCell>

							<TableCell>
								<Tooltip title="Lihat Hasil">
									<IconButton size="small"
										onClick={() => props.setSelected(row)}
										color="primary">

										<FindInPageIcon />
									</IconButton>
								</Tooltip>

							</TableCell>


					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}