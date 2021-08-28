import { IconButton } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GridOnIcon from '@material-ui/icons/GridOn';
import EditIcon from '@material-ui/icons/Edit';


export default function SurveyListTable(props) {

    

	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>TGL</TableCell>
					<TableCell>Total Skor</TableCell>
					<TableCell>Lihat</TableCell>
                    <TableCell>Ubah</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{props.rows.map((row) => (
					<TableRow key={row.id} selected={row.id===props.survey.id}>
						<TableCell>{row.date}</TableCell>
						<TableCell>{row.skor || '-'}</TableCell>
						<TableCell>
							<IconButton onClick={() => props.survey.setThis(row)} color="primary">
								<GridOnIcon />
							</IconButton>
						</TableCell>

                        <TableCell>
							<IconButton color="primary" onClick={() => props._handleSurveyEdit(row)}>
								<EditIcon />
							</IconButton>
						</TableCell>


                        
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}