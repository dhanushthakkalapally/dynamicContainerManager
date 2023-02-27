import React, {useEffect, useState} from 'react';
// import makeStyles from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button} from "@mui/material";

// const useStyles = makeStyles({
//     table: {
//         minWidth: 650,
//     },
// });

function MaterialTable() {
    // const classes = useStyles();
    const [data, setData] = useState([]);

    const getData = () => {
        fetch('http://localhost:8000/api/runs')
            .then(response => response.json())
            .then(data => setData(data));
    }

    const handleStopRun = (runId) => {
        fetch(`http://localhost:8000/api/runs/${runId}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: "please stop run"})}).then(console.log);
    }

    useEffect(() => {
        getData()
        setInterval(getData, 1000);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Snippet</TableCell>
                        <TableCell>Container Name</TableCell>
                        <TableCell>Container ID</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell>Run Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">{row.id}</TableCell>
                            <TableCell>{row.status} {row.status === "started" && <Button onClick={() => handleStopRun(row.id)} variant="contained" color="secondary">
                    Stop
                </Button>}</TableCell>
                            <TableCell>{row.snippet}</TableCell>
                            <TableCell>{row.containerName}</TableCell>
                            <TableCell>{row.containerId}</TableCell>
                            <TableCell>{row.createdAt}</TableCell>
                            <TableCell>{row.updatedAt}</TableCell>
                            <TableCell>{row.duration}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MaterialTable;
