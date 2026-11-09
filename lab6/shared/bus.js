export const CHANNEL_NAME = "lab6-channel";

export class Bus {
  constructor(self) {
    this.self = self;
    this.handlers = new Set();
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = (e) => {
      const m = e.data;
      if (m.to !== this.self && m.to !== "*") return;
      for (const handler of [...this.handlers]) handler(m);
    };
  }

  send(to, type, payload = {}) {
    this.channel.postMessage({ from: this.self, to, type, ...payload });
  }

  on(handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  waitFor(type, match = () => true, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const off = this.on((m) => {
        if (m.type === type && match(m)) {
          clearTimeout(timer);
          off();
          resolve(m);
        }
      });
      const timer = setTimeout(() => {
        off();
        reject(new Error('Не дочекались відповіді "' + type + '"'));
      }, timeout);
    });
  }
}
