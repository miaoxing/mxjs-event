import hoook from 'hoook';
import ucfirst from 'ucfirst';

const DEFAULT_PRIORITY = 100;
const ee = hoook();

class EventApi {
  configs = {
    events: {},
    plugins: {},
    pluginIds: [],
  };
  loaded = {};

  on = ee.hook;
  off = ee.unhook;

  setConfigs(configs) {
    this.configs = Object.assign(this.configs, configs);
  }

  trigger(...args) {
    this.loadEvent(args[0], () => {
      ee.fire(...args);
    });
  }

  loadEvent(event, fn) {
    if (this.loaded[event]) {
      fn();
      return;
    }
    this.loaded[event] = true;

    if (typeof this.configs.events[event] === 'undefined') {
      fn();
      return;
    }

    const promises = [];
    Object.keys(this.configs.events[event]).forEach(priority => {
      this.configs.events[event][priority].forEach(pluginId => {
        if (!this.configs.pluginIds.includes(pluginId)) {
          return;
        }

        const promise = this.configs.plugins[pluginId]();
        promises.push(promise);
        promise.then(fns => {
          priority = parseInt(priority, 10);
          const method = 'on' + ucfirst(priority === DEFAULT_PRIORITY ? event : (event + priority));
          this.on(event, fns.default[method], priority);
        });
      });
    });
    Promise.all(promises).then(fn);
  }
}

export default new EventApi;
