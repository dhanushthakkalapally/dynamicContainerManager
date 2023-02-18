import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";
import {createRunHandler} from "./handlers";

const run_id = process.env["run_id"];

console.log(`🏃‍Run started with id ${run_id}`);
console.log("Setting up rascal config for run");
export const publishReadyMessage = async (runId: string, broker: Broker) => {
    await new Promise(async (resolve, reject) => {
        const publication = await broker.publish("p1", {message: "Here is the message"}, `run.${runId}.ready`);
        publication.on("success", resolve)
        publication.on("error", reject);
    })

}

export const getConfig = (runId: string) => {
    config.vhosts["/"].queues[runId] = {
        assert: true,
        "options": {
            durable: false
        }
    }
    config.vhosts["/"].bindings[`${runId}_binding`] = {
        source: "notifications",
        destination: runId,
        bindingKey: `${runId}.*`,
    }
    config.vhosts["/"].subscriptions[`${runId}_subscription`] = {
        "queue": runId
    }

    return {...config}
}


if (!process.env["TEST"]) {
    (async () => {
        try {
            if (run_id) {
                const runConfig = getConfig(run_id);
                const broker = await Broker.create(withDefaultConfig(runConfig));
                console.log("Process created and connected to the broker successfully! 🚀🚀");
                broker.on('error', (err) => {
                    console.log("here is the error");
                    console.error(err);
                });

                await publishReadyMessage(run_id, broker);

                const run_subscription = await broker.subscribe(`${run_id}_subscription`);

                run_subscription.on("message", async (message, content, ackOrNackFn) => {
                    const eventType = message.fields.routingKey.split(".")[1];
                    const runId = message.fields.routingKey.split(".")[0];
                    switch (eventType) {
                        case "createRun":
                            const snippets = content["snippets"];
                            await createRunHandler(runId, snippets, broker);
                            ackOrNackFn();
                            break;
                        default:
                            console.warn(`Unknown event provided ${eventType}`);
                    }
                    console.log("Hey here is the message", JSON.stringify(message));
                    ackOrNackFn();
                });

            } else {
                throw new Error("run id must be provided");
            }
        } catch (err) {
            console.log("here is the error");
            console.error(err);
        }
    })();
}