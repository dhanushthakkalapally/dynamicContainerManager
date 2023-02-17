export default {
  "vhosts": {
    "/": {
      "connection": {
        "url": "amqp://localhost:5672/",
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
        "q1": {
          "assert": true,
          "options": {
            "durable": true
          }
        }
      },
      "bindings": {
        "b1": {
          "source": "commands",
          "destination": "q1",
          "destinationType": "queue",
        }
      },
      "subscriptions": {
        "s1": {
          "queue": "q1",
          "contentType": "application/json"
        }
      }
    }
  }
}