import './App.css';
import {AppBar, CssBaseline, Grid, Toolbar, Typography} from "@mui/material";
import Snippet from "./Snippet";
import DataTable from "./DataTable";

function App() {
    return (
        <>
            <CssBaseline/>
            <AppBar position="relative" color="primary" enableColorOnDark>
                <Toolbar>
                    <Typography variant="h6">Dashboard</Typography>
                </Toolbar>
            </AppBar>
            <Grid padding={5}>
            <Snippet/>
            </Grid>
            <DataTable/>
        </>
    );
}

export default App;
