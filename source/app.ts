import { log, logMethod, logProperty, logParameter, logMethodParameters, logClass } from './logDecorator';
import { Injector } from './injector';
import 'reflect-metadata/Reflect.js';

@log()
class Class {
	@log() prop: string;

	@log()
	method() {
		console.log('in method');
	}

	@log()
	methodWithParam(@log() param: string, param2: number) {
		console.log('Param1', param);
		console.log('Param2', param2);
	}
}


@Injectable()
class Other {
	constructor() {
		console.log('Other initialized');
	}
}

// Reflect.defineMetadata('design:class', {}, Class);
// console.log(Reflect.getMetadata('design:class', Class));

const injector = new Injector([Other]);

const other = injector.get(Other);
// const o = new Other();
// const c = new Class();
// c.method();
// c.methodWithParam('Nice!', 5);
// c.prop = '123';
// console.log(c.prop);
