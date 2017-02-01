import { logMethod, logParameter, logMethodParameters, logClass } from './decorators';
import 'reflect-metadata/Reflect.js';

@logClass
class Class {
	@logMethod
	method() {
		console.log('in method');
	}

	@logMethodParameters
	methodWithParam(@logParameter param: string, param2: number) {
		console.log('Param1', param);
		console.log('Param2', param2);
	}
}

const c = new Class();
c.method();
c.methodWithParam('Nice!', 5);
