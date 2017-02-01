import { logMethod } from './decorators';
import 'reflect-metadata/Reflect.js';

class Class {
	@logMethod
	method() {
		console.log('in method');
	}
}

const c = new Class();
c.method();

console.log('Go');

c.method();
