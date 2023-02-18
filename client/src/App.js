import './App.css';
import {AppBar, CssBaseline, Toolbar, Typography} from "@mui/material";

function App() {
    return (
        <>
            <CssBaseline/>
            <AppBar position="relative" color="primary" enableColorOnDark>
                <Toolbar>
                    <Typography variant="h6">Dashboard</Typography>
                </Toolbar>
            </AppBar>
            <Typography variant={"h4"}>Welcome! </Typography>
        </>
    );
}

export default App;
