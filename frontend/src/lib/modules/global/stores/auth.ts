import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type AuthUser = {
	id?: string;
	email: string;
	full_name?: string | null;
	is_active?: boolean;
	is_superuser?: boolean;
};

type AuthState = {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
};

const STORAGE_TOKEN = 'authToken';
const STORAGE_USER = 'currentUser';

function clearStorage() {
	if (!browser) return;
	localStorage.removeItem(STORAGE_TOKEN);
	localStorage.removeItem(STORAGE_USER);
}

function saveToStorage(token: string, user: AuthUser) {
	if (!browser) return;
	localStorage.setItem(STORAGE_TOKEN, token);
	localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function loadFromStorage(): AuthState {
	if (!browser) {
		return { user: null, token: null, isAuthenticated: false, isLoading: false };
	}

	const token = localStorage.getItem(STORAGE_TOKEN);
	const raw = localStorage.getItem(STORAGE_USER);

	if (token && raw) {
		try {
			const user = JSON.parse(raw) as AuthUser;
			return { user, token, isAuthenticated: true, isLoading: false };
		} catch {
			clearStorage();
		}
	}

	return { user: null, token: null, isAuthenticated: false, isLoading: false };
}

const { subscribe, set, update } = writable<AuthState>({
	...loadFromStorage(),
	isLoading: browser
});

export const authStore = {
	subscribe,

	initialize() {
		if (!browser) return;
		set({ ...loadFromStorage(), isLoading: false });
	},

	login(token: string, user: AuthUser) {
		saveToStorage(token, user);
		set({ user, token, isAuthenticated: true, isLoading: false });
	},

	setUser(user: AuthUser) {
		if (browser) {
			localStorage.setItem(STORAGE_USER, JSON.stringify(user));
		}
		update((state) => ({ ...state, user }));
	},

	logout() {
		clearStorage();
		set({ user: null, token: null, isAuthenticated: false, isLoading: false });
	},

	getToken(): string | null {
		if (!browser) return null;
		return localStorage.getItem(STORAGE_TOKEN);
	}
};

if (browser) {
	authStore.initialize();
}
