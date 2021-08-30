import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LaunchIcon from '@material-ui/icons/Launch';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	tableRow: {
		"&$selected, &$selected:hover": {
			backgroundColor: "rgb(0 0 255 / 8%)"
		}
	},
	hover: { },
	selected: { }
}));

export default function SurveyListTable(props) {
	const classes = useStyles()
	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>TGL</TableCell>
					<TableCell>Kesenjangan</TableCell>
					<TableCell>Jumlah Responden</TableCell>
					<TableCell>Jumlah Kriteria</TableCell>
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
						selected={row.id === props.survey.id}
					>
						<TableCell className={classes.tableRow}>{row.date}</TableCell>
						<TableCell>{row.score && row.score.gap ? row.score.gap.toFixed(2) : '-'}</TableCell>
						<TableCell>{row.responses.length}</TableCell>
						<TableCell>{row.criterias.length}</TableCell>


						<TableCell>
							<Tooltip title="Ubah">
								<IconButton size="small" color="primary" onClick={() => props._handleSurveyEdit(row)}>
									<EditIcon />
								</IconButton>
							</Tooltip>
						</TableCell>

						<TableCell>
							<Tooltip title="Detail">
								<IconButton size="small" onClick={() => props.survey.setThis(row)} color="primary">
									<LaunchIcon />
								</IconButton>
							</Tooltip>

						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}