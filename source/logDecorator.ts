import { decorate, IDecoratorFactory } from './decoratorHelper';

export const log: IDecoratorFactory = decorate({
	classDecorator: () => logClass,
	propertyDecorator: () => logProperty,
	parameterDecorator: () => logParameter,
	methodDecorator: () => logMethodParameters,
});

export function logMethod(target: any, key: string, value: any) {
	return {
		value: function (...args: any[]) {
			const a = args.map(a => JSON.stringify(a)).join();
			const result = value.value.apply(this, args);
			const r = JSON.stringify(result);
			console.log(`Call: ${key}(${a}) => ${r}`);
			return result;
		}
	};
}

export function logProperty(target: any, key: string) {
	// property value
	let _val = target[key];

	// property getter
	const getter = function () {
		console.log(`Get: ${key} => ${_val}`);
		return _val;
	};

	// property setter
	const setter = function (newVal) {
		console.log(`Set: ${key} => ${newVal}`);
		_val = newVal;
	};

	// Delete property.
	if (delete target[key]) {

		// Create new property with getter and setter
		Object.defineProperty(target, key, {
			get: getter,
			set: setter,
			enumerable: true,
			configurable: true
		});
	}
}

export function logParameter(target: any, key : string, index : number) {
	const metadataKey = `__log_${key}_parameters`;
	const indices = Reflect.getMetadata(metadataKey, target, key) || [];
	indices.push(index);
	Reflect.defineMetadata(metadataKey, indices, target, key);
}

export function logMethodParameters(target: any, key: string, descriptor: any) {
	const originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		const metadataKey = `__log_${key}_parameters`;
		const indices = Reflect.getMetadata(metadataKey, target, key);

		if (Array.isArray(indices)) {

			for (let i = 0; i < args.length; i++) {

				if (indices.indexOf(i) !== -1) {

					const arg = args[i];
					const argStr = JSON.stringify(arg) || arg.toString();
					console.log(`${key} arg[${i}]: ${argStr}`);
				}
			}
			const result = originalMethod.apply(this, args);
			return result;
		}
		else {

			const a = args.map(a => (JSON.stringify(a) || a.toString())).join();
			const result = originalMethod.apply(this, args);
			const r = JSON.stringify(result);
			console.log(`Call: ${key}(${a}) => ${r}`);
			return result;
		}
	}
	return descriptor;
}

export function logClass(target: any) {

	// save a reference to the original constructor
	const original = target;

	// a utility function to generate instances of a class
	function construct(constructor, args) {
		const c : any = function () {
			return constructor.apply(this, args);
		}
		c.prototype = constructor.prototype;
		return new c();
	}

	// the new constructor behaviour
	const f : any = function (...args) {
		console.log("New: " + original.name);
		return construct(original, args);
	}

	// copy prototype so intanceof operator still works
	f.prototype = original.prototype;

	// return new constructor (will override original)
	return f;
}
