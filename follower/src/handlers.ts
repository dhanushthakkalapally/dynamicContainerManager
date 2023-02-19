import {BrokerAsPromised} from "rascal";

const getPreparedSnippet = (snippets: string) => {
    return `(async() => {
    try {
        ${snippets}
        await main();
        resolve();
    } catch (err) {
        throw new Error(err);
    }
    })();
    `
}

export const createRunHandler = (runId: string, snippets: string, broker: BrokerAsPromised) => {
    console.log(`Running the snippets for runId ${runId}`);

    new Promise((resolve, reject) => {
        setImmediate(async () => {
            const publication = await broker.publish("p1", {message: "successfully started run execution :)"}, {routingKey: `run.${runId}.started`});
            publication.on("success", () => {
                console.log("Successfully finished run execution");
            })
            const startTime = performance.now();
            try {
                await new Promise(async (resolve) => {
                    await eval(getPreparedSnippet(snippets));
                });
                console.log("Successfully finished execution of the code")
                resolve(performance.now() - startTime);
            } catch (e: any) {
                console.error("something went wrong while running the run and the error is", e);
                const publication = await broker.publish("p1", {message: JSON.stringify(e.stack)}, {routingKey: `run.${runId}.failed`});
                publication.on("success", () => {
                    console.log("Successfully published failed message execution");
                    process.exit(0);
                })
            }

        })
    }).then(async (runDuration) => {
        const publication = await broker.publish("p1", {
            message: "successfully finished run execution :)",
            runDuration
        }, {routingKey: `run.${runId}.finished`});
        publication.on("success", () => {
            console.log("Successfully finished run execution");
            process.exit(0);
        })
    });
}