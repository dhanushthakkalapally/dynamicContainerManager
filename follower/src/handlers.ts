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
        setImmediate(() => {
            newTempFunc();
            console.log("Successfully finished execution of the code")
            resolve("Finished execution successfully");
        })
    }).then(async () => {
        const publication = await broker.publish("p1", {message: "successfully finished run execution :)"}, {routingKey: `run.${runId}.finished`});
        publication.on("success", () => {
            console.log("Successfully finished run execution");
        })
    });
}