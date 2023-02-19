import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";
import Docker from "dockerode";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";
import {createRun} from "./dao/runDAO";
import cors from "cors";

import express from "express";

const docker = new Docker();

const app = express();
app.use(express.json());

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post("/api/runs", async (req, res) => {
  const {snippet} = req.body;

  const run = await createRun("initiated", snippet);

  const env = [
    'AMQPURL=amqp://broker:5672/',
    `run_id=${run.id}`,
  ];

  const config = {
    Image: 'dynamiccontainermanager_follower',
    name: `follower_${run.id}`,
    HostConfig: {
      PortBindings: {'80/tcp': [{HostPort: '8080'}]},
      NetworkMode: "dynamiccontainermanager_default"
    },
    Env: env
  };

  docker.createContainer(config, function (err, container) {
    if (err) {
      console.error(err);
    } else {
      // Start the container
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      container.start(function (err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log('Container started successfully');
        }
      });
    }
  });

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