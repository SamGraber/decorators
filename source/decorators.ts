export function logMethod(target: any, key: string, value: any) {
	return {
		value: function (...args: any[]) {
			const a = args.map(a => JSON.stringify(a)).join();
			const result = value.value.apply(this, args);
			const r = JSON.stringify(result);
			console.log(`Call: ${key}(${a}) => ${r}`);
			return result;
		}
	};
}

export function logParameter(target: any, key : string, index : number) {
	const metadataKey = `__log_${key}_parameters`;
	if (Array.isArray(target[metadataKey])) {
		target[metadataKey].push(index);
	}
	else {
		target[metadataKey] = [index];
	}
}

export function logMethodParameters(target: any, key: string, descriptor: any) {
	const originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		const metadataKey = `__log_${key}_parameters`;
		const indices = target[metadataKey];

		if (Array.isArray(indices)) {

			for (let i = 0; i < args.length; i++) {

				if (indices.indexOf(i) !== -1) {

					const arg = args[i];
					const argStr = JSON.stringify(arg) || arg.toString();
					console.log(`${key} arg[${i}]: ${argStr}`);
				}
			}
			const result = originalMethod.apply(this, args);
			return result;
		}
		else {

			const a = args.map(a => (JSON.stringify(a) || a.toString())).join();
			const result = originalMethod.apply(this, args);
			const r = JSON.stringify(result);
			console.log(`Call: ${key}(${a}) => ${r}`);
			return result;
		}
	}
	return descriptor;
}
