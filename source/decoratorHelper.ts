export interface IDecoratorOptions {
	classDecorator?: IDecoratorFactory<IClassDecorator>;
	propertyDecorator?: IDecoratorFactory<IPropertyDecorator>;
	parameterDecorator?: IDecoratorFactory<IParameterDecorator>;
	methodDecorator?: IDecoratorFactory<IMethodDecorator>;
}

export interface IDecoratorFactory<T extends IDecorator> {
	(...args: any[]): T;
}

export interface IDecorator {
	(...args: any[]): any;
}

export interface IClassDecorator {
	(target: any): any;
}

export interface IPropertyDecorator {
	(target: any, key: string, empty: undefined): any;
}

export interface IParameterDecorator {
	(target: any, key: string, index: number): any;
}

export interface IMethodDecorator {
	(target: any, key: string, method: Function): any;
}

export function decorate(options: IDecoratorOptions): IDecoratorFactory<IDecorator> {
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

function callIfAvailable(decorator: IDecoratorFactory<IDecorator>, decoratorType: string, decoratorConfig: any[], decoratorArgs: any[]): any {
	if (decorator) {
		return decorator.apply(this, decoratorConfig).apply(this, decoratorArgs);
	}
	throw new Error(`This decorator is not allowed for ${decoratorType}`)
}
