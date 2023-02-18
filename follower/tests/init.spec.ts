import * as chai from "chai";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import {v4} from "uuid"
import {BrokerAsPromised, withTestConfig} from "rascal";
import _ from "lodash";
import rascalConfig from "../rascalConfig";
import {publishReadyMessage} from "../src/app";

const {expect} = chai;
chai.use(sinonChai)
chai.use(chaiAsPromised);


describe("INIT", () => {
    describe('Example rascal test', function () {
        let broker: BrokerAsPromised;

        const testConfig = _.defaultsDeep({
            "vhosts": {
                "/": {
                    namespace: v4(),
                    "queues": {
                        "ready_test_queue": {
                            "assert": true,
                            "options": {
                                "durable": false
                            }
                        }
                    },
                    "subscriptions": {
                        "ready_test_queue_subscription": {
                            "queue": "ready_test_queue"
                        }
                    },
                    "bindings": {
                        "ready_test_queue_binding": {
                            "source": "notifications",
                            "destination": "ready_test_queue",
                            "bindingKey": "run.*.ready"
                        }
                    }
                }
            }
        }, rascalConfig);

        before(async function () {
            broker = await BrokerAsPromised.create(withTestConfig(testConfig));
        });

        beforeEach(async function () {
            await broker.purge();
        });

        after(async function () {
            if (!broker) return;
            await broker.nuke();
        });

        it('should publish run ready notification', async function () {
            const runId = "dummy_run_id";

            const subscription = await broker.subscribe("ready_test_queue_subscription");

            setTimeout(async () => await publishReadyMessage(runId, broker), 400);

            await new Promise(resolve => {
                subscription.on("message", (message, content, ackOrNackFn) => {
                    const receivedRunId = message.fields.routingKey.split(".")[1];
                    expect(receivedRunId).to.be.equal(runId);
                    console.log(content);
                    ackOrNackFn();
                    resolve("passed");
                })
            })
        });
    });
})