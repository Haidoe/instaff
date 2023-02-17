class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callbacks) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callbacks);
  }

  unsubscribe(eventName, callbacks) {
    //remove an event function by name
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (f) => f !== callbacks
      );
    }
  }

  publish(eventName, data) {
    if (this.events[eventName]) {
      //Run all subscribed callbacks
      this.events[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }
}

const pubsub = new PubSub();

export default pubsub;
