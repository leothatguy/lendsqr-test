// Types for the mock API data
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';

export interface UserProfile {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	bvn: string;
	gender: string;
	maritalStatus: string;
	children: string;
	typeOfResidence: string;
}

export interface UserEducation {
	level: string;
	employmentStatus: string;
	sector: string;
	duration: string;
	officeEmail: string;
	monthlyIncome: string;
	loanRepayment: number;
}

export interface UserSocials {
	twitter: string;
	facebook: string;
	instagram: string;
}

export interface Guarantor {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	relationship: string;
}

export interface User {
	id: string;
	orgId: string;
	organization: string;
	username: string;
	email: string;
	phoneNumber: string;
	dateJoined: string;
	status: UserStatus;
	userId: string;
	tier: number;
	accountBalance: string;
	bank: string;
	profile: UserProfile;
	education: UserEducation;
	socials: UserSocials;
	guarantor: Guarantor[];
	createdAt: string;
	updatedAt: string;
}

// Cache for storing fetched users
let usersCache: User[] | null = null;

export async function fetchUsers(): Promise<User[]> {
	if (usersCache) {
		return usersCache;
	}

	try {
		// Fetch from our internal API route (which proxies to json-generator.com)
		const response = await fetch('/api/users');

		if (!response.ok) {
			throw new Error('Failed to fetch users');
		}

		const data = await response.json();

		// Handle case where API returns error object
		if (data.error) {
			throw new Error(data.error);
		}

		usersCache = data;
		return data;
	} catch (error) {
		console.error('Error fetching users:', error);
		// Return fallback data if API fails
		return generateFallbackData();
	}
}

export function getPaginatedUsers(
	users: User[],
	page: number,
	perPage: number,
): {
	users: User[];
	totalUsers: number;
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
} {
	const totalUsers = users.length;
	const totalPages = Math.ceil(totalUsers / perPage);
	const startIndex = (page - 1) * perPage;
	const endIndex = startIndex + perPage;

	return {
		users: users.slice(startIndex, endIndex),
		totalUsers,
		totalPages,
		currentPage: page,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1,
	};
}

// Format date for display
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

// Generate fallback data if API fails
function generateFallbackData(): User[] {
	const organizations = [
		'Lendsqr',
		'Irorun',
		'Lendstar',
		'Kobo360',
		'Paystack',
		'Flutterwave',
		'Kuda',
		'Carbon',
		'FairMoney',
		'PalmPay',
	];
	const statuses: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Blacklisted'];
	const genders = ['Male', 'Female'];
	const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
	const residenceTypes = ["Parent's Apartment", 'Rented Apartment', 'Personal Apartment', 'Company Provided'];
	const educationLevels = ['B.Sc', 'M.Sc', 'HND', 'OND', 'PhD', 'SSCE'];
	const employmentStatuses = ['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired'];
	const sectors = ['FinTech', 'Technology', 'Banking', 'Education', 'Healthcare', 'Agriculture', 'Oil & Gas'];
	const durations = ['Less than 1 year', '1 year', '2 years', '3 years', '4 years', '5+ years'];
	const incomeRanges = [
		'₦50,000.00- ₦100,000.00',
		'₦100,000.00- ₦200,000.00',
		'₦200,000.00- ₦400,000.00',
		'₦400,000.00- ₦600,000.00',
	];
	const relationships = ['Sister', 'Brother', 'Friend', 'Colleague', 'Parent', 'Spouse', 'Uncle', 'Aunt'];

	const firstNames = [
		'Grace',
		'John',
		'Mary',
		'David',
		'Sarah',
		'Michael',
		'Jennifer',
		'Robert',
		'Lisa',
		'William',
		'Emma',
		'James',
		'Olivia',
		'Daniel',
		'Sophia',
	];
	const lastNames = [
		'Effiom',
		'Ogana',
		'Dokunmu',
		'Adeyemi',
		'Okonkwo',
		'Bakare',
		'Adeleke',
		'Ogundimu',
		'Eze',
		'Afolabi',
		'Chukwu',
		'Bello',
		'Uche',
		'Adeola',
		'Nwosu',
	];

	const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
	const randomPhone = () =>
		'0' + randomItem(['70', '80', '81', '90', '91']) + Math.floor(1000000 + Math.random() * 9000000);
	const randomDate = (start: Date, end: Date) =>
		new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

	return Array.from({ length: 500 }, (_, i) => {
		const firstName = randomItem(firstNames);
		const lastName = randomItem(lastNames);
		const org = randomItem(organizations);

		return {
			id: `${i + 1}`,
			orgId: `ORG-${Math.floor(100 + Math.random() * 900)}`,
			organization: org,
			username: `${firstName} ${lastName}`,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${org.toLowerCase()}.com`,
			phoneNumber: randomPhone(),
			dateJoined: randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31)),
			status: randomItem(statuses),
			userId: `LSQ${randomItem(['Ff', 'Aa', 'Bb', 'Cc'])}${Math.floor(100 + Math.random() * 900)}${randomItem(['g', 'h', 'j'])}${Math.floor(10 + Math.random() * 90)}`,
			tier: Math.floor(1 + Math.random() * 3),
			accountBalance: `₦${(50000 + Math.random() * 4950000).toFixed(2)}`,
			bank: `${Math.floor(1000000000 + Math.random() * 9000000000)}/${randomItem(['Providus Bank', 'GTBank', 'Access Bank', 'First Bank', 'Zenith Bank'])}`,
			profile: {
				firstName,
				lastName,
				phoneNumber: randomPhone(),
				bvn: String(Math.floor(10000000000 + Math.random() * 90000000000)),
				gender: randomItem(genders),
				maritalStatus: randomItem(maritalStatuses),
				children: randomItem(['None', '1', '2', '3', '4', '5+']),
				typeOfResidence: randomItem(residenceTypes),
			},
			education: {
				level: randomItem(educationLevels),
				employmentStatus: randomItem(employmentStatuses),
				sector: randomItem(sectors),
				duration: randomItem(durations),
				officeEmail: `${firstName.toLowerCase()}@${org.toLowerCase()}.com`,
				monthlyIncome: randomItem(incomeRanges),
				loanRepayment: Math.floor(10000 + Math.random() * 190000),
			},
			socials: {
				twitter: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
				facebook: `${firstName} ${lastName}`,
				instagram: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
			},
			guarantor: Array.from({ length: Math.floor(1 + Math.random() * 2) }, () => ({
				firstName: randomItem(firstNames),
				lastName: randomItem(lastNames),
				phoneNumber: randomPhone(),
				email: `${randomItem(firstNames).toLowerCase()}@gmail.com`,
				relationship: randomItem(relationships),
			})),
			createdAt: randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31)),
			updatedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
		};
	});
}

// Clear cache (useful for testing or forcing refresh)
export function clearUsersCache(): void {
	usersCache = null;
}
