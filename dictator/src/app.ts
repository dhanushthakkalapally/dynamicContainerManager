import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";
import Run from "../db/run";

(async () => {
  try {
    const broker = await Broker.create(withDefaultConfig(config));
    console.log("Connected!");
    broker.on('error', (err) => {
      console.log("here is the error");
      console.error()
    });

    // Consume a message
    const subscription = await broker.subscribe('s1');
    subscription
      .on('message', (message, content, ackOrNack) => {
        console.log(content);
        ackOrNack();
      })
      .on('error', (err) => {
      console.log("here is the error");
      console.error()
    });
  } catch (err) {
    console.log("here is the error");
    console.error(err);
  }
})();