module.exports =  {
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
      },
      "bindings": {
      },
      "subscriptions": {
      },
      "publications": {
        "p1": {
          "exchange": "notifications",
        }
      }
    }
  }
}