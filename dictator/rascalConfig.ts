export default {
  "vhosts": {
    "/": {
      "connection": {
        "url": process.env.AMQPURL || "amqp://localhost:5672/",
        "options": {
          "heartbeat": 5
        },
        "retry": {
          "min": 1000,
          "max": 5000,
          "factor": 2,
          "strategy": "linear"
        }
      },
      "exchanges": {
        "commands": {
          "type": "direct",
          "assert": true,
          "options": {

            "durable": true
          }
        },
          "notifications": {
            "type": "topic",
              "assert": true,
            "options": {
              "durable": true
            }
          }
      },
      "queues": {
        "run_queue": {
          "assert": true,
          "options": {
            "durable": true
          }
        }
      },
      "bindings": {
        "run_binding": {
          "source": "notifications",
          "destination": "run_queue",
          "destinationType": "queue",
          "bindingKey": "run.*.*"
        }
      },
      "subscriptions": {
        "run_subscription": {
          "queue": "run_queue",
          "contentType": "application/json"
        }
      },
      "publications": {
        "run_publication": {
          "exchange": "notifications"
        }
      }
    }
  }
}