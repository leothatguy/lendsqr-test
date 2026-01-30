import { create } from 'zustand';
import { User, fetchUsers } from './api';

interface UserState {
	users: User[];
	isLoading: boolean;
	error: string | null;
	fetchUsers: () => Promise<void>;
	blacklistUser: (userId: string) => void;
	activateUser: (userId: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,

	fetchUsers: async () => {
		// Avoid re-fetching if we already have data
		if (get().users.length > 0) return;

		set({ isLoading: true, error: null });
		try {
			const users = await fetchUsers();
			set({ users, isLoading: false });
		} catch (error) {
			set({ error: 'Failed to fetch users', isLoading: false });
		}
	},

	blacklistUser: (userId: string) => {
		set((state) => {
			const updatedUsers = state.users.map((user) =>
				user.id === userId ? { ...user, status: 'Blacklisted' as const } : user,
			);
			return { users: updatedUsers };
		});
	},

	activateUser: (userId: string) => {
		set((state) => {
			const updatedUsers = state.users.map((user) =>
				user.id === userId ? { ...user, status: 'Active' as const } : user,
			);
			return { users: updatedUsers };
		});
	},
}));

// Auth Store
interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: { email: string } | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	isLoading: false,
	user: null,

	login: async (email: string, password: string) => {
		set({ isLoading: true });
		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Simple validation (any non-empty email/password is valid for demo)
		if (email && password) {
			const user = { email };
			localStorage.setItem('lendsqr_auth', JSON.stringify(user));
			set({ isAuthenticated: true, user, isLoading: false });
			return true;
		}
		set({ isLoading: false });
		return false;
	},

	logout: () => {
		localStorage.removeItem('lendsqr_auth');
		set({ isAuthenticated: false, user: null });
	},

	checkAuth: () => {
		const storedAuth = localStorage.getItem('lendsqr_auth');
		if (storedAuth) {
			try {
				const user = JSON.parse(storedAuth);
				set({ isAuthenticated: true, user });
			} catch {
				localStorage.removeItem('lendsqr_auth');
			}
		}
	},
}));
