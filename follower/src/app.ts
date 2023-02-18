import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";

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

if (!process.env["TEST"]) {
    (async () => {
        try {
            const broker = await Broker.create(withDefaultConfig(config));
            console.log("Process created and connected to the broker successfully! 🚀🚀");
            broker.on('error', (err) => {
                console.log("here is the error");
                console.error(err);
            });
            if (run_id) {
                await publishReadyMessage(run_id, broker);
            } else {
                throw new Error("run id must be provided");
            }
        } catch (err) {
            console.log("here is the error");
            console.error(err);
        }
    })();
}