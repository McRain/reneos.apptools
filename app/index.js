const _data = {}

const _events = {}

const _subs = (event, once, handler) => {
	if (_events[event] == null)
		_events[event] = [];
	_events[event].push({ handler, once });
}

class App{

	static Add(obj) {
		for (const [key, value] of Object.entries(obj)) {
			_data[key] = value;
			App.Emit('add', key, value);
		}
	}

	static Remove(key) {
		if (!_data[key])
			return
		const data = _data[key]
		delete _data[key]
		App.Emit("remove", key, data)
	}

	static Init(models) {
		if (models)
			App.Add(models)
		App.Emit("init")
		return _proxy
	}

	static On(event, handler) {
		_subs(event, false, handler);
	}
	static Once(event, handler) {
		_subs(event, true, handler);
	}
	static Off(event, handler) {
		const evt = _events[event];
		if (!evt)
			return;
		const l = evt.length;
		for (let i = l - 1; i >= 0; i--) {
			if (evt[i].handler === handler)
				evt.splice(i, 1);
		}
		if (evt.length === 0)
			delete _events[event];
	}
	static async Emit(event, ...args) {
		const evs = _events[event];
		if (evs == null) return;
		const proms = []
		const l = evs.length;
		for (let i = l - 1; i >= 0; i--) {
			const ev = evs[i];
			proms.push(ev.handler.apply(null, args))
			if (!ev.once)
				continue;
			evs.splice(i, 1);
		}
		await Promise.allSettled(proms)
	}
}

const _proxy = new Proxy(App, {
	get(target, prop) {
		if (prop in target)
			return target[prop]
		return _data[prop]
	}
})
export default _proxy