import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";
import {createRun} from "./dao/runDAO";
import cors from "cors";

import express from "express";
const app = express();
app.use(express.json());

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post("/api/runs", async (req, res) => {
  const { snippet } = req.body;

  await createRun("initiated", snippet);

  // TODO: Here we need to start the follower container in the k8s and send the snippets that is just received.

  res.status(201).send("Successes fully initiated the run");
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});


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