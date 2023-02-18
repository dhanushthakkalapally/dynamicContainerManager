import {BrokerAsPromised} from "rascal";

const getPreparedSnippet = (snippets: string) => {
    return `
    try {
        ${snippets}
        main();
    } catch (err) {
        throw new Error(err);
    }
    `
}

export const createRunHandler = (runId: string, snippets: string, broker: BrokerAsPromised) => {
    console.log(`Running the snippets for runId ${runId}`);
    const preparedSnippet = getPreparedSnippet(snippets);

    const newTempFunc = new Function(preparedSnippet);

    new Promise((resolve, reject) => {
        setImmediate(async () => {
            const publication = await broker.publish("p1", {message: "successfully started run execution :)"}, {routingKey: `run.${runId}.started`});
            publication.on("success", () => {
                console.log("Successfully finished run execution");
            })
            try {
                newTempFunc();
                console.log("Successfully finished execution of the code")
                resolve("Finished execution successfully");
            } catch (e) {
                console.error("something went wrong while running the run and the error is", e);
            }

        })
    }).then(async () => {
        const publication = await broker.publish("p1", {message: "successfully finished run execution :)"}, {routingKey: `run.${runId}.finished`});
        publication.on("success", () => {
            console.log("Successfully finished run execution");
        })
    });
}