import { decorate, IDecoratorFactory, IDecorator } from './decoratorHelper';

export const Injectable: IDecoratorFactory<IDecorator> = decorate({
	classDecorator: () => injectableClass,
});

function injectableClass(target: any) {
	console.log(target.name);
	console.log(Reflect.getMetadata('design:paramtypes', target));

	// save a reference to the original constructor
	const original = target;

	function construct(constructor, args) {
		const c : any = function () {
			return constructor.apply(this, args);
		}
		c.prototype = constructor.prototype;
		return new c();
	}

	// the new constructor behaviour
	const newConstructor : any = function (...args) {
		console.log(args);
		args.forEach(arg => console.log("Dep: " + arg.name));
		return construct(original, args);
	}

	// copy prototype so intanceof operator still works
	newConstructor.prototype = original.prototype;

	// return new constructor (will override original)
	return newConstructor;

	// const metadataKey = `__log_${key}_parameters`;
	// const indices = Reflect.getMetadata(metadataKey, target, ) || [];
	// indices.push(index);
	// Reflect.defineMetadata(metadataKey, indices, target, key);
}
