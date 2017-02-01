export interface IDecoratorOptions {
	classDecorator?: IDecoratorFactory;
	propertyDecorator?: IDecoratorFactory;
	parameterDecorator?: IDecoratorFactory;
	methodDecorator?: IDecoratorFactory;
}

export interface IDecoratorFactory {
	(...args: any[]): IDecorator;
}

export interface IDecorator {
	(...args: any[]): any;
}

export function decorate(options: IDecoratorOptions): IDecoratorFactory {
	return (...decoratorConfig: any[]) => {
		return (...decoratorArgs : any[]) => {
			switch(decoratorArgs.length) {
				case 1:
					return callIfAvailable(options.classDecorator, 'class', decoratorConfig, decoratorArgs);
				case 2:
					return callIfAvailable(options.propertyDecorator, 'property', decoratorConfig, decoratorArgs);
				case 3:
					if (decoratorArgs[2] === undefined) {
						return callIfAvailable(options.propertyDecorator, 'property', decoratorConfig, decoratorArgs);
					} else if (typeof decoratorArgs[2] === "number") {
						return callIfAvailable(options.parameterDecorator, 'parameter', decoratorConfig, decoratorArgs);
					}
					return callIfAvailable(options.methodDecorator, 'method', decoratorConfig, decoratorArgs);
				default:
					throw new Error("Decorators are not valid here!");
			}
		};
	};
}

function callIfAvailable(decorator: IDecoratorFactory, decoratorType: string, decoratorConfig: any[], decoratorArgs: any[]): any {
	if (decorator) {
		return decorator.apply(this, decoratorConfig).apply(this, decoratorArgs);
	}
	throw new Error(`This decorator is not allowed for ${decoratorType}`)
}
