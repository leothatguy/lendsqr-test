'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import { User } from '@/lib/api';

// Icons
const BackArrowIcon = () => (
	<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M1.94997 15.3564C1.9945 15.4712 2.0613 15.5767 2.14684 15.6658L6.89684 20.4157C7.07263 20.5962 7.31285 20.6984 7.56248 20.6984C7.81211 20.6984 8.05232 20.5962 8.22812 20.4157C8.40346 20.2399 8.50185 20.0022 8.50185 19.7548C8.50185 19.5075 8.40346 19.2697 8.22812 19.0939L5.07187 15.9376H27.5625C28.0803 15.9376 28.5 15.518 28.5 15.0001C28.5 14.4823 28.0803 14.0626 27.5625 14.0626H5.07187L8.22812 10.9064C8.5961 10.5384 8.5961 9.96181 8.22812 9.59384C7.86014 9.22586 7.28353 9.22586 6.91556 9.59384L2.16556 14.3438C2.07148 14.4379 1.99695 14.551 1.94997 14.6751C1.85119 14.9215 1.85119 15.1951 1.94997 15.4415V15.3564Z"
			fill="#545F7D"
		/>
	</svg>
);

const UserAvatarIcon = () => (
	<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" r="50" fill="#213F7D" fillOpacity="0.1" />
		<path
			d="M50 51.5625C56.4893 51.5625 61.75 46.3018 61.75 39.8125C61.75 33.3232 56.4893 28.0625 50 28.0625C43.5107 28.0625 38.25 33.3232 38.25 39.8125C38.25 46.3018 43.5107 51.5625 50 51.5625Z"
			stroke="#213F7D"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M32.25 73.0625V67.5625C32.25 64.6462 33.4081 61.8492 35.4679 59.7894C37.5277 57.7296 40.3248 56.5625 43.25 56.5625H56.75C59.6752 56.5625 62.4723 57.7296 64.5321 59.7894C66.5919 61.8492 67.75 64.6462 67.75 67.5625V73.0625"
			stroke="#213F7D"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const StarFilledIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M8.00008 1.33334L10.0601 5.50668L14.6667 6.18001L11.3334 9.42668L12.1201 14.0133L8.00008 11.8467L3.88008 14.0133L4.66675 9.42668L1.33341 6.18001L5.94008 5.50668L8.00008 1.33334Z"
			fill="#E9B200"
			stroke="#E9B200"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const StarEmptyIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M8.00008 1.33334L10.0601 5.50668L14.6667 6.18001L11.3334 9.42668L12.1201 14.0133L8.00008 11.8467L3.88008 14.0133L4.66675 9.42668L1.33341 6.18001L5.94008 5.50668L8.00008 1.33334Z"
			stroke="#E9B200"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const tabs = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'];

const UserDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const router = useRouter();
	const [id, setId] = useState<string>('');

	useEffect(() => {
		const unwrapParams = async () => {
			const resolvedParams = await params;
			setId(resolvedParams.id);
		};
		unwrapParams();
	}, [params]);

	const { users, fetchUsers, isLoading: storeLoading, blacklistUser, activateUser } = useUserStore();
	const [user, setUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState('General Details');

	useEffect(() => {
		// Ensure users are fetched if coming directly to this page
		if (users.length === 0) {
			fetchUsers();
		}
	}, [users.length, fetchUsers]);

	useEffect(() => {
		if (users.length > 0) {
			const foundUser = users.find((u) => u.id === id);
			setUser(foundUser || null);
		}
	}, [users, id]);

	const handleBlacklist = () => {
		if (user) {
			blacklistUser(user.id);
		}
	};

	const handleActivate = () => {
		if (user) {
			activateUser(user.id);
		}
	};

	if (storeLoading || (users.length === 0 && !user)) {
		return (
			<div className="user-details user-details--loading">
				<LoadingSpinner message="Loading user details" size="lg" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="user-details user-details--not-found">
				<p className="user-details__not-found-text">User not found</p>
				<button onClick={() => router.push('/users')} className="user-details__not-found-button">
					Back to Users
				</button>
			</div>
		);
	}

	const getActionButtonClass = (isDisabled: boolean, variant: 'blacklist' | 'activate') => {
		const base = 'user-details__action-button';
		const variantClass = `${base}--${variant}`;
		return `${base} ${variantClass}${isDisabled ? ` ${base}--disabled` : ''}`;
	};

	return (
		<div className="user-details">
			{/* Back Button */}
			<Link href="/users" className="user-details__back-link">
				<BackArrowIcon />
				Back to Users
			</Link>

			{/* Page Header */}
			<div className="user-details__header">
				<h1 className="user-details__title">User Details</h1>

				<div className="user-details__actions">
					<button
						onClick={handleBlacklist}
						disabled={user.status === 'Blacklisted'}
						className={getActionButtonClass(user.status === 'Blacklisted', 'blacklist')}>
						{user.status === 'Blacklisted' ? 'Blacklisted' : 'Blacklist User'}
					</button>
					<button
						onClick={handleActivate}
						disabled={user.status === 'Active'}
						className={getActionButtonClass(user.status === 'Active', 'activate')}>
						{user.status === 'Active' ? 'Activated' : 'Activate User'}
					</button>
				</div>
			</div>

			{/* User Profile Card */}
			<div className="user-details__profile-card">
				<div className="user-details__profile-header">
					{/* Avatar */}
					<div className="user-details__avatar">
						<UserAvatarIcon />
					</div>

					{/* User Info */}
					<div className="user-details__profile-info">
						<div className="user-details__name-section">
							<h2 className="user-details__name">{user.username}</h2>
							<p className="user-details__user-id">{user.userId}</p>
						</div>

						{/* User Tier */}
						<div className="user-details__tier-section">
							<p className="user-details__tier-label">User&apos;s Tier</p>
							<div className="user-details__tier-stars">
								{[1, 2, 3].map((star) =>
									star <= user.tier ? <StarFilledIcon key={star} /> : <StarEmptyIcon key={star} />,
								)}
							</div>
						</div>

						{/* Balance */}
						<div className="user-details__balance-section">
							<h2 className="user-details__balance">{user.accountBalance}</h2>
							<p className="user-details__bank">{user.bank}</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="user-details__tabs">
					{tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`user-details__tab ${activeTab === tab ? 'user-details__tab--active' : ''}`}>
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Details Section */}
			<div className="user-details__details-card">
				{/* Personal Information */}
				<section className="user-details__section">
					<h3 className="user-details__section-title">Personal Information</h3>
					<div className="user-details__info-grid">
						<div className="user-details__info-item">
							<p className="user-details__info-label">Full Name</p>
							<p className="user-details__info-value">{user.username}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Phone Number</p>
							<p className="user-details__info-value">{user.profile.phoneNumber}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Email Address</p>
							<p className="user-details__info-value user-details__info-value--email">{user.email}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">BVN</p>
							<p className="user-details__info-value">{user.profile.bvn}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Gender</p>
							<p className="user-details__info-value">{user.profile.gender}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Marital Status</p>
							<p className="user-details__info-value">{user.profile.maritalStatus}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Children</p>
							<p className="user-details__info-value">{user.profile.children}</p>
						</div>
						<div className="user-details__info-item user-details__info-item--wide">
							<p className="user-details__info-label">Type of Residence</p>
							<p className="user-details__info-value">{user.profile.typeOfResidence}</p>
						</div>
					</div>
				</section>

				{/* Education and Employment */}
				<section className="user-details__section">
					<h3 className="user-details__section-title">Education and Employment</h3>
					<div className="user-details__info-grid user-details__info-grid--employment">
						<div className="user-details__info-item">
							<p className="user-details__info-label">Level of Education</p>
							<p className="user-details__info-value">{user.education.level}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Employment Status</p>
							<p className="user-details__info-value">{user.education.employmentStatus}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Sector of Employment</p>
							<p className="user-details__info-value">{user.education.sector}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Duration of Employment</p>
							<p className="user-details__info-value">{user.education.duration}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Office Email</p>
							<p className="user-details__info-value">{user.education.officeEmail}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Monthly Income</p>
							<p className="user-details__info-value">{user.education.monthlyIncome}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Loan Repayment</p>
							<p className="user-details__info-value">{user.education.loanRepayment.toLocaleString()}</p>
						</div>
					</div>
				</section>

				{/* Socials */}
				<section className="user-details__section">
					<h3 className="user-details__section-title">Socials</h3>
					<div className="user-details__info-grid">
						<div className="user-details__info-item">
							<p className="user-details__info-label">Twitter</p>
							<p className="user-details__info-value">{user.socials.twitter}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Facebook</p>
							<p className="user-details__info-value">{user.socials.facebook}</p>
						</div>
						<div className="user-details__info-item">
							<p className="user-details__info-label">Instagram</p>
							<p className="user-details__info-value">{user.socials.instagram}</p>
						</div>
					</div>
				</section>

				{/* Guarantor */}
				<section className="user-details__section">
					<h3 className="user-details__section-title">Guarantor</h3>
					{user.guarantor.map((guarantor, index) => (
						<div
							key={index}
							className={`user-details__guarantor ${index < user.guarantor.length - 1 ? '' : 'user-details__guarantor--last'}`}>
							<div className="user-details__info-grid">
								<div className="user-details__info-item">
									<p className="user-details__info-label">Full Name</p>
									<p className="user-details__info-value">
										{guarantor.firstName} {guarantor.lastName}
									</p>
								</div>
								<div className="user-details__info-item">
									<p className="user-details__info-label">Phone Number</p>
									<p className="user-details__info-value">{guarantor.phoneNumber}</p>
								</div>
								<div className="user-details__info-item">
									<p className="user-details__info-label">Email Address</p>
									<p className="user-details__info-value">{guarantor.email}</p>
								</div>
								<div className="user-details__info-item">
									<p className="user-details__info-label">Relationship</p>
									<p className="user-details__info-value">{guarantor.relationship}</p>
								</div>
							</div>
						</div>
					))}
				</section>
			</div>
		</div>
	);
};

export default UserDetailsPage;
