import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";

(async () => {
  try {
    const broker = await Broker.create(withDefaultConfig(config));
    console.log("Process created and connected to the broker successfully!");
    broker.on('error', (err) => {
      console.log("here is the error");
      console.error()
    });

    // Consume a message
    setInterval(async () => {
      const publication = await broker.publish("p1", {message: "Here is the message"});
      publication.on("success", () => {
        console.log("Successfully published the message!")
      })
    }, 3000)

  } catch (err) {
    console.log("here is the error");
    console.error(err);
  }
})();