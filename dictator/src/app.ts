import {BrokerAsPromised as Broker, withDefaultConfig} from "rascal";
import Docker from "dockerode";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import config from "../rascalConfig.ts";
import {
  createRun,
  getRunById,
  getRuns,
  updateContainerNameAndContainerId,
  updateStatus,
  updateStatusAndDuration
} from "./dao/runDAO";
import cors from "cors";

import express from "express";
import Run from "../db/run";

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
  const containerName = `follower_${run.id}`;
  const config = {
    Image: 'dynamiccontainermanager_follower',
    name: containerName,
    HostConfig: {
      PortBindings: {'80/tcp': [{HostPort: '8080'}]},
      NetworkMode: "dynamiccontainermanager_default"
    },
    Env: env
  };

  docker.createContainer(config, function (err, container) {
    if (err || !container) {
      console.error(err);
    } else {
      // Start the container
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      container.start(async function (err, data) {
        if (err) {
          console.error(err);
        } else {
          await updateContainerNameAndContainerId(run.id, containerName, container.id);
          console.log("update container name and container id");
          console.log('Container started successfully');
        }
      });
    }
  });

  res.status(201).send("Successes fully initiated the run");
});

app.put("/api/runs/:run_id", async (req, res) => {
  const run = await getRunById(req.params.run_id);
  // const duration = content["runDuration"] || 0
  if (run.status === "started") {
    try {
      const container = docker.getContainer(run.containerId);
      await container.stop();
      console.log('Container stopped');
      await container.remove();
      console.log('Container removed');
      await updateStatusAndDuration(run.id, "stopped", 0);
      res.status(200).send({message: "Stopped the run successfully"});

    } catch (err) {
      console.log('Error stopping or removing container:', err);
    }
  } else {
    res.status(400).send({message: "Cannot stop a not running run"});
  }
})

app.get("/api/runs", async (req, res) => {
  const runs = await getRuns();
  res.status(200).send(runs);
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});


(async () => {
  try {
    const broker = await Broker.create(withDefaultConfig(config));
    console.log("Connected!");
    broker.on('error', (err) => {
      console.error(err)
    });

    // Consume a message
    const subscription = await broker.subscribe('run_subscription');
    subscription
        .on('message', async (message, content, ackOrNack) => {
          const [_, runId, eventType] = message.fields.routingKey.split(".");
          let run: Run;
          switch (eventType) {
            case "ready":
              //    now the container is ready now let's start the container and run the run
              run = await getRunById(runId);
              const publication = await broker.publish("run_publication", {"snippets": run.snippet}, {routingKey: `${runId}.createRun`});
              publication.on("success", async () => {
                await updateStatus(runId, "started");
                console.log("Successfully started the run");
              });
              break;
            case "finished":
            case "failed":
                 // now the run is done; we need to delete the container.
              run = await getRunById(runId);
              const duration = content["runDuration"] || 0
              try {
                const container = docker.getContainer(run.containerId);
                await container.stop();
                console.log('Container stopped');
                await container.remove();
                console.log('Container removed');
                 await updateStatusAndDuration(run.id, eventType, parseFloat(duration));
              } catch (err) {
                console.log('Error stopping or removing container:', err);
              }
              break;

            default:
              console.warn("Unknown error")
          }
          ackOrNack();
        })
      .on('error', (err) => {
        console.log("here is the error");
        console.error(err)
      });
  } catch (err) {
    console.log("here is the error");
    console.error(err);
  }
})();