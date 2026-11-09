export const LABELS = { object2: "Object2", object3: "Object3" };

export function computeLayout(screen) {
  const left = screen.availLeft ?? 0;
  const top = screen.availTop ?? 0;
  const width = Math.round(screen.availWidth * 0.55) - 10;
  const x = left + screen.availWidth - width - 10;
  const half = Math.floor(screen.availHeight / 2);
  return {
    object2: { left: x, top, width, height: half - 10 },
    object3: { left: x, top: top + half, width, height: half - 10 },
  };
}

export class Launcher {
  constructor(bus, log, urls, onStatus = () => {}) {
    this.bus = bus;
    this.log = log;
    this.urls = urls;
    this.onStatus = onStatus;
    this.refs = {};
  }

  layout() {
    return computeLayout(window.screen);
  }

  ping(app, wait = 300) {
    const answer = this.bus
      .waitFor("pong", (m) => m.from === app, wait)
      .then(
        () => true,
        () => false,
      );
    this.bus.send(app, "ping");
    return answer;
  }

  async waitAlive(app, timeout = 6000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      if (await this.ping(app, 250)) return true;
    }
    return false;
  }

  open(app) {
    const r = this.layout()[app];
    const features =
      "popup=yes,left=" +
      r.left +
      ",top=" +
      r.top +
      ",width=" +
      r.width +
      ",height=" +
      r.height;
    const url = new URL(this.urls[app], window.location.href).href;
    const ref = window.open(url, "lab6_" + app, features);
    if (!ref) {
      this.log.error(
        LABELS[app] +
          ": браузер заблокував відкриття вікна. Дозвольте спливаючі вікна для цього сайту і повторіть",
      );
      return false;
    }
    this.refs[app] = ref;
    this.log.info(LABELS[app] + ": програму запущено");
    return true;
  }

  async ensureAll(apps) {
    const alive = await Promise.all(apps.map((app) => this.ping(app)));
    const opened = apps.map((app, i) => {
      if (alive[i]) {
        this.log.info(LABELS[app] + ": уже запущено, використовую працюючий екземпляр");
        return true;
      }
      return this.open(app);
    });
    const ready = await Promise.all(
      apps.map((app, i) => (alive[i] ? true : opened[i] ? this.waitAlive(app) : false)),
    );
    const result = {};
    apps.forEach((app, i) => {
      result[app] = ready[i];
      this.onStatus(app, ready[i]);
    });
    return result;
  }

  arrangeAll() {
    const layout = this.layout();
    for (const app of Object.keys(layout)) {
      this.bus.send(app, "arrange", layout[app]);
    }
  }

  monitor(interval = 2000) {
    const tick = async () => {
      for (const app of Object.keys(this.urls)) {
        this.onStatus(app, await this.ping(app, 400));
      }
    };
    tick();
    return setInterval(tick, interval);
  }

  closeAll() {
    for (const ref of Object.values(this.refs)) {
      try {
        ref.close();
      } catch {}
    }
  }
}
