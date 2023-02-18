import * as chai from "chai";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import {v4} from "uuid"
import {BrokerAsPromised, withTestConfig} from "rascal";
import _ from "lodash";
import {getConfig} from "../src/app";
import {createRunHandler} from "../src/handlers";

const {expect} = chai;
chai.use(sinonChai)
chai.use(chaiAsPromised);


describe("handlers", () => {
    let broker: BrokerAsPromised;

    const testConfig = {
        "vhosts": {
            "/": {
                namespace: v4(),
                "queues": {
                    "run_start_finish_queue": {
                        "assert": true,
                        "options": {
                            "durable": false
                        }
                    }
                },
                "subscriptions": {
                    "run_start_finish_queue_subscription": {
                        "queue": "run_start_finish_queue"
                    }
                },
                "bindings": {
                    "run_start_finish_queue_binding": {
                        "source": "notifications",
                        "destination": "run_start_finish_queue",
                        "bindingKeys": ["run.*.started", "run.*.finished"]
                    }
                }
            }
        }
    }

    // before(async function () {
    //     broker = await BrokerAsPromised.create(withTestConfig(testConfig));
    // });

    beforeEach(async function () {
        if (!broker) return;
        await broker.purge();
    });

    after(async function () {
        if (!broker) return;
        await broker.nuke();
    });

    describe("Create Run Handler", async () => {
        it('should run the provided snippet code and raise run start and run finished event', async function () {
            const runId = "dummy_run_id";

            const snippet = `
            function main() {
               let count = 100;
               while (count > 0) {
                   console.log("Dhanush I Love you 😘😘😘😘😘, I think it will work");
                   count--;
               }
            }
        `
            broker = await BrokerAsPromised.create(withTestConfig(_.defaultsDeep(testConfig, getConfig(runId))));

            const subscription = await broker.subscribe("run_start_finish_queue_subscription");

            setTimeout(() => createRunHandler(runId, snippet, broker), 100);

            await new Promise((resolve) => {
                let count = 2;
                subscription.on("message", (message, content, ackOrNackFn) => {
                    const receivedRunId = message.fields.routingKey.split(".")[1]
                    expect(runId).to.be.equal(receivedRunId);
                    count--;
                    if (count == 0) resolve("finished");
                    ackOrNackFn();
                })
            })
        });
    })
})