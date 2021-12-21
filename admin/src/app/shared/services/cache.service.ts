import * as SecureLS from 'secure-ls';

const secureLocalStorage = new SecureLS();

export abstract class CacheService {
	
	protected getItem<T>(key: string): T {
		const data = secureLocalStorage.get(key);
		if (data && data !== 'undefined') {
			return data;
		}
		return null;
	}

	protected setItem(key: string, data: object | string) {
		if (typeof data === 'string') {
			secureLocalStorage.set(key, data);
		}
		secureLocalStorage.set(key, data);
	}

	protected removeItem(key: string) {
		secureLocalStorage.remove(key);
	}

	protected clear() {
		secureLocalStorage.clear();
	}
	
}
