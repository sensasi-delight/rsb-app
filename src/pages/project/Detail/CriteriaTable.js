import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';


export default function CriteriaTable(props) {

	const getColor = (row) => {
		let color = 'inherit'

		if (row.score !== undefined) {
			if (row.score.gap > 0) {
				color = 'green'
			} else if (row.score.gap === 0) {
				color = 'inherit'
			} else {
				color = 'red'
			}
		}
		return color
	}


	const getSatisfaction = (row) => {
		let satis = '-'

		if (row.score !== undefined) {
			if (row.score.gap > 0) {
				satis = 'Melebihi'
			} else if (row.score.gap === 0) {
				satis = 'Sesuai'
			} else {
				satis = 'Kurang'
			}
		}

		return satis
	}


	return (

		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>Kriteria</TableCell>
					<TableCell>Simbol</TableCell>
					<TableCell>Kepuasan</TableCell>
					<TableCell>Kesenjangan</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{props.rows.map((row) => (
					<TableRow key={row.id}>
						<TableCell>{row.desc}</TableCell>
						<TableCell>{row.symbol}</TableCell>
						<TableCell style={{ color: getColor(row) }}>
							{getSatisfaction(row)
							}</TableCell>
						<TableCell style={{
							color: getColor(row)
						}}>
							{row.score !== undefined ? row.score.gap.toFixed(2) : '-'}
						</TableCell>
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