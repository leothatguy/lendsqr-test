'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import StatCard from './_components/StatCard';
import UsersTable from './_components/UsersTable';
import { UsersIcon, ActiveUsersIcon, LoansIcon, SavingsIcon } from '@/components/icons';

const DashboardPage = () => {
	const { users, fetchUsers } = useUserStore();

	useEffect(() => {
		if (users.length === 0) {
			fetchUsers();
		}
	}, [users.length, fetchUsers]);

	// Calculate stats
	const totalUsers = users.length;
	const activeUsers = users.filter((u) => u.status === 'Active').length;
	// Assuming loanRepayment > 0 implies they have a loan
	const usersWithLoans = users.filter((u) => u.education.loanRepayment > 0).length;
	// Parse account balance string "₦50,000.00" -> number. Assuming balance > 0 implies savings
	const usersWithSavings = users.filter((u) => {
		const balance = parseFloat(u.accountBalance.replace(/[₦,]/g, ''));
		return balance > 0;
	}).length;

	const stats = [
		{
			icon: <UsersIcon />,
			iconVariant: 'pink' as const,
			label: 'USERS',
			value: totalUsers.toLocaleString(),
		},
		{
			icon: <ActiveUsersIcon />,
			iconVariant: 'purple' as const,
			label: 'ACTIVE USERS',
			value: activeUsers.toLocaleString(),
		},
		{
			icon: <LoansIcon />,
			iconVariant: 'orange' as const,
			label: 'USERS WITH LOANS',
			value: usersWithLoans.toLocaleString(),
		},
		{
			icon: <SavingsIcon />,
			iconVariant: 'red' as const,
			label: 'USERS WITH SAVINGS',
			value: usersWithSavings.toLocaleString(),
		},
	];

	return (
		<div className="users-page">
			{/* Page Title */}
			<h1 className="users-page__title">Users</h1>

			{/* Stats Grid */}
			<div className="users-page__stats-grid">
				{stats.map((stat, index) => (
					<StatCard key={index} icon={stat.icon} iconVariant={stat.iconVariant} label={stat.label} value={stat.value} />
				))}
			</div>

			{/* Users Table */}
			<UsersTable />
		</div>
	);
};

export default DashboardPage;
