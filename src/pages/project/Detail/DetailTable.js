import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { TableContainer, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { sortAlphaNum, getColorByGap } from '../../../classes/Helper';



const getColorRes = (exp, rea) => {
	let color = 'inherit'

	if (exp < rea) {
		color = 'green'
	} else if (exp > rea) {
		color = 'red'
	}

	return color
}


const getSatisfaction = (gap) => {
	let satis = '-'

	if (typeof gap === 'number') {
		if (gap > 0) {
			satis = 'Kurang'
		} else if (gap === 0) {
			satis = 'Sesuai'
		} else {
			satis = 'Melebihi'
		}
	}

	return satis
}


DetailTable.propTypes = {
	rows: PropTypes.array.isRequired
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	paper: {
		width: '100%',
		// 	marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
}));

function descendingComparator(a, b, orderBy) {

	if (orderBy === 'symbol') {
		return -sortAlphaNum(a[orderBy], b[orderBy])
	}

	if (b[orderBy] < a[orderBy]) {
		return -1;
	}

	if (b[orderBy] > a[orderBy]) {
		return 1;
	}

	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {

		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;

		return a[1] - b[1];
	});

	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{ id: 'rank', numeric: false, isSort: true, disablePadding: true, label: 'Rekomendasi Prioritas' },
	{ id: 'symbol', numeric: false, isSort: true, disablePadding: true, label: 'Simbol' },
	{ id: 'desc', numeric: false, isSort: false, rowSpan: 2, disablePadding: false, label: 'Kriteria' },
	
	
	{ id: 'responden', numeric: false, isSort: false, colSpan: 3, disablePadding: true, label: 'Responden' },
	{ id: 'weight', numeric: false, isSort: true, disablePadding: false, label: 'Pengaruh Kriteria' },
	{ id: 'rate', numeric: false, isSort: true, disablePadding: false, label: 'Skor Kriteria' },
	{ id: 'satis', numeric: false, isSort: false, rowSpan: 2, disablePadding: true, label: 'Kesuaian Kriteria' },
]

function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort } = props;

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					headCell.isSort ?
						<TableCell
							rowSpan="2"
							key={headCell.id}
							align={headCell.numeric ? 'right' : 'left'}
							padding={headCell.disablePadding ? 'none' : 'normal'}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : 'asc'}
								onClick={createSortHandler(headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<span className={classes.visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</span>
								) : null}
							</TableSortLabel>
						</TableCell> :
						<TableCell
							key={headCell.id}
							colSpan={headCell.colSpan}
							rowSpan={headCell.rowSpan}
							padding={headCell.disablePadding ? 'none' : 'normal'}
						>{headCell.label}</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell padding="none">Simbol</TableCell>
				<TableCell>Ekspektasi</TableCell>
				<TableCell padding="none">Realita</TableCell>
			</TableRow>

		</TableHead>
	);
}


export default function DetailTable({ rows, id }) {
	
	const classes = useStyles();

	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('rank');

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	return (
		<TableContainer id={id}>

			<Table className={classes.table}
				aria-labelledby="tableTitle" size="small">
				<EnhancedTableHead
					classes={classes}
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
					rowCount={rows.length}
				/>
				<TableBody>
					{stableSort(rows, getComparator(order, orderBy))
						.map((row) => {
							return (
								<TableRow key={row.id} tabIndex={-1}>
									<TableCell align="center" padding="normal" style={{ color: getColorByGap(row.gap) }}>
										{row.rank}
									</TableCell>
									<TableCell align="center" >{row.symbol}</TableCell>
									<TableCell align="left" padding="normal">{row.desc}</TableCell>
									

									<TableCell align="center" padding="none">
										{row.responses.map((res) => (
											<Typography key={res.symbol} style={{ color: getColorRes(res.expectation, res.reality) }}>
												{res.symbol}
											</Typography>
										))}
									</TableCell>

									<TableCell align="center" padding="none">
										{row.responses.map((res) => (
											<Typography key={res.symbol} style={{ color: getColorRes(res.expectation, res.reality) }}>
												{res.expectation}
											</Typography>
										))}
									</TableCell>

									<TableCell align="center" padding="none">
										{row.responses.map((res) => (
											<Typography key={res.symbol} style={{ color: getColorRes(res.expectation, res.reality) }}>
												{res.reality}
											</Typography>
										))}
									</TableCell>
									<TableCell align="left" padding="normal">
										{row.weight ? (row.weight *100).toFixed(2) : row.weight} %
									</TableCell>
									<TableCell align="left" padding="normal" style={{ color: getColorByGap(row.gap) }}>
										{ row.gap === null ? '-' : row.rate.toFixed(2) }
									</TableCell>
									
									<TableCell align="left" padding="none" style={{ color: getColorByGap(row.gap) }}>{getSatisfaction(row.gap)}</TableCell>
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</TableContainer>

	)
}