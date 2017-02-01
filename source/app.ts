import { log, logMethod, logProperty, logParameter, logMethodParameters, logClass } from './decorators';
import 'reflect-metadata/Reflect.js';

@log
class Class {
	@log prop: string;

	@log
	method() {
		console.log('in method');
	}

	@log
	methodWithParam(@log param: string, param2: number) {
		console.log('Param1', param);
		console.log('Param2', param2);
	}
}

const c = new Class();
c.method();
c.methodWithParam('Nice!', 5);
c.prop = '123';
console.log(c.prop);
