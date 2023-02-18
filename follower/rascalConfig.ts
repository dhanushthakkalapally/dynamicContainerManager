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
        "q2": {
          "assert": true,
          "options": {
            "durable": true
          }
        }
      },
      "bindings": {
        "b1": {
          "source": "commands",
          "destination": "q2",
          "destinationType": "queue",
        }
      },
      "subscriptions": {
        "s1": {
          "queue": "q2",
          "contentType": "application/json"
        }
      },
      "publications": {
        "p1": {
         "exchange": "commands",
          "routingKey": "send_command"
        }
      }
    }
  }
}