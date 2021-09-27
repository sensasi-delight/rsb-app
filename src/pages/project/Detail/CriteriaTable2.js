import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';


export default function CriteriaTable2(props) {

	return (
		<Table size="small" id={props.id}>
			<TableHead>
				<TableRow>
					<TableCell>Simbol</TableCell>
					<TableCell>Kriteria</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{props.rows.map((row) => (
					<TableRow key={row.id}>
						<TableCell>{row.symbol}</TableCell>
						<TableCell>{row.desc}</TableCell>
						<TableCell>
							<Tooltip title="Ubah">
								<IconButton size="small" onClick={() => props._handleCriteriaEdit(row)} color="primary">
									<EditIcon />
								</IconButton>

							</Tooltip>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}