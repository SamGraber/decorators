import * as uuid from 'uuid';

export const injectMetadataKey = 'inject-metadata';

interface IProviderLifetime {
	class: (new () => any);
	instance?: any;
}

export class Injector {
	guid: string = uuid.v4();

	constructor(providers: any[]) {
		providers = providers || [];
		providers.forEach(provider => {
			Reflect.defineMetadata(`${injectMetadataKey}_${this.guid}`, { class: provider }, provider);
		});
	}

	get(target: any): any {
		const result: IProviderLifetime = Reflect.getMetadata(`${injectMetadataKey}_${this.guid}`, target);

		if (!result) {
			throw new Error(`No provider found for ${target.name}!`);
		}

		if (!result.instance) {
			result.instance = new result.class();
		}

		return result.instance;
	}
}