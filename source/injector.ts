export const injectMetadataKey = 'inject-metadata';

export class Injector {
	constructor(providers: any[]) {
		providers = providers || [];
		providers.forEach(provider => {
			Reflect.defineMetadata(injectMetadataKey, provider, provider);
		});
	}

	get(target: any): any {
		const result = Reflect.getMetadata(injectMetadataKey, target);
		return new result();
	}
}