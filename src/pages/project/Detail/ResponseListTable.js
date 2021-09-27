import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import { arrayObjGroup } from '../../../classes/Helper';




ResponseListTable.propTypes = {
	rows: PropTypes.array.isRequired,
	_handleResponseEdit: PropTypes.func.isRequired
}

export default function ResponseListTable (props) {

	const {rows, _handleResponseEdit} = props

	const grouppedRows = arrayObjGroup(rows, 'group')

	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>Kelompok</TableCell>
					<TableCell>Simbol</TableCell>
					<TableCell>Peran</TableCell>
					<TableCell>Jumlah Kepentingan</TableCell>
					<TableCell>Usia<br />(tahun)</TableCell>
					<TableCell>Pendidikan</TableCell>
					<TableCell>Pengetahuan<br />Bangunan<br />(tahun)</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{Object.keys(grouppedRows).map(groupName => grouppedRows[groupName].map((row, i) => (
					<TableRow key={row.id}>
						{i === 0 &&
							<TableCell rowSpan={grouppedRows[groupName].length}>{row.group}</TableCell>
						}
						<TableCell>{row.symbol}</TableCell>
						<TableCell>{row.role}</TableCell>
						<TableCell>{
							row.response.filter(res => res.isActive).length + '/' +
							row.response.length
						}</TableCell>
						<TableCell>{row.age}</TableCell>
						<TableCell>{row.edu}</TableCell>
						<TableCell>{row.exp}</TableCell>
						<TableCell>
							<Tooltip title="Ubah">
							<IconButton color="primary" size="small" onClick={() => _handleResponseEdit(row)}>
								<EditIcon  />
							</IconButton>
							</Tooltip>
						</TableCell>
					</TableRow>
				)))}
			</TableBody>
		</Table>
	)
}