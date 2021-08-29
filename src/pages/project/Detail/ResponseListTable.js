import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';

export default function ResponseListTable(props) {
	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>Kelompok</TableCell>
					<TableCell>Peran</TableCell>
					<TableCell>Simbol</TableCell>
					<TableCell>Pengetahuan</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{props.rows.map((row) => (
					<TableRow key={row.id}>
						<TableCell>{row.group}</TableCell>
						<TableCell>{row.role}</TableCell>
						<TableCell>{row.symbol}</TableCell>
						<TableCell>{row.exp}</TableCell>
						<TableCell>
							<Tooltip title="Ubah">
							<IconButton color="primary" size="small" onClick={() => props._handleResponseEdit(row)}>
								<EditIcon  />
							</IconButton>
							</Tooltip>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}