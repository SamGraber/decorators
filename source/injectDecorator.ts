import { decorate, IDecoratorFactory, IDecorator } from './decoratorHelper';

export const Injectable: IDecoratorFactory<IDecorator> = decorate({
	classDecorator: () => injectableClass,
});

function injectableClass(target: any) {
	console.log(target.name);
	// const metadataKey = `__log_${key}_parameters`;
	// const indices = Reflect.getMetadata(metadataKey, target, ) || [];
	// indices.push(index);
	// Reflect.defineMetadata(metadataKey, indices, target, key);
}
