import React, {useRef} from 'react';
import {Button, Grid} from "@mui/material";
import Editor from "@monaco-editor/react";

function Snippet() {
    const editorRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:8000/api/runs', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({snippet: editorRef.current.getValue()})
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Handle successful response
        }).catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }


    return (
        <form onSubmit={handleSubmit}>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                // justifyContent="center"
                // style={{minHeight: '100vh'}}
            >
                <Editor
                    height="50vh"
                    width="50vh"
                    defaultLanguage="javascript"
                    defaultValue="function main() {}"
                    theme={"vs-dark"}
                    onMount={handleEditorDidMount}
                />
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Grid>

        </form>
    );
}

export default Snippet;
