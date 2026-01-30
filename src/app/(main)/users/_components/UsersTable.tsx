'use client';

import { useState, useEffect, useMemo } from 'react';
import { MdFilterList } from 'react-icons/md';
import LoadingSpinner from '@/components/LoadingSpinner';
import FilterPopup, { FilterState } from './FilterPopup';
import UserCard from './UserCard';
import UserActionsMenu from './UserActionsMenu';
import { UserStatus, getPaginatedUsers, formatDate } from '@/lib/api';
import { useUserStore } from '@/lib/store';

const UsersTable = () => {
	// Global State
	const { users: allUsers, isLoading, error, fetchUsers } = useUserStore();

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	// Filter State
	const [activeFilter, setActiveFilter] = useState<{
		key: string;
		position: { top: number; left: number };
	} | null>(null);
	const [filters, setFilters] = useState<FilterState>({
		organization: '',
		username: '',
		email: '',
		date: '',
		phoneNumber: '',
		status: '',
	});

	// Fetch users on component mount
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Get unique organizations for filter
	const organizations = useMemo(() => {
		const orgs = new Set(allUsers.map((u) => u.organization));
		return Array.from(orgs).sort();
	}, [allUsers]);

	// Filter and Paginate data
	const paginationData = useMemo(() => {
		let filteredUsers = [...allUsers];

		// Apply filters
		if (filters.organization) {
			filteredUsers = filteredUsers.filter((u) => u.organization === filters.organization);
		}
		if (filters.username) {
			filteredUsers = filteredUsers.filter((u) => u.username.toLowerCase().includes(filters.username.toLowerCase()));
		}
		if (filters.email) {
			filteredUsers = filteredUsers.filter((u) => u.email.toLowerCase().includes(filters.email.toLowerCase()));
		}
		if (filters.phoneNumber) {
			filteredUsers = filteredUsers.filter((u) => u.phoneNumber.includes(filters.phoneNumber));
		}
		if (filters.status) {
			filteredUsers = filteredUsers.filter((u) => u.status === filters.status);
		}
		if (filters.date) {
			filteredUsers = filteredUsers.filter((u) => u.dateJoined.includes(filters.date));
		}

		return getPaginatedUsers(filteredUsers, currentPage, itemsPerPage);
	}, [allUsers, currentPage, itemsPerPage, filters]);

	// Generate page numbers for pagination display
	const getPageNumbers = (): (number | string)[] => {
		const { totalPages } = paginationData;
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1, 2, 3);
			if (currentPage > 4) pages.push('...');
			if (currentPage > 3 && currentPage < totalPages - 2) {
				if (currentPage > 4) pages.push(currentPage);
			}
			if (currentPage < totalPages - 3) pages.push('...');
			pages.push(totalPages - 1, totalPages);
		}

		return pages;
	};

	// Handle items per page change
	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);
	};

	// Column mapping to filter keys
	const columns = [
		{ label: 'ORGANIZATION', key: 'organization' },
		{ label: 'USERNAME', key: 'username' },
		{ label: 'EMAIL', key: 'email' },
		{ label: 'PHONE NUMBER', key: 'phoneNumber' },
		{ label: 'DATE JOINED', key: 'date' },
		{ label: 'STATUS', key: 'status' },
	];

	const handleFilterIconClick = (e: React.MouseEvent<HTMLButtonElement>, columnKey: string, index: number) => {
		const buttonRect = e.currentTarget.getBoundingClientRect();
		const isRightAligned = index >= 4;
		const POPUP_WIDTH = 270;

		setActiveFilter(
			activeFilter?.key === columnKey
				? null
				: {
						key: columnKey,
						position: {
							top: buttonRect.bottom + window.scrollY + 10,
							left: isRightAligned ? buttonRect.right + window.scrollX - POPUP_WIDTH : buttonRect.left + window.scrollX,
						},
					},
		);
	};

	if (isLoading) {
		return (
			<div className="users-table">
				<LoadingSpinner message="Fetching users" size="md" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="users-table users-table--error">
				<div className="users-table__error">{error}</div>
			</div>
		);
	}

	const getStatusClass = (status: UserStatus) => {
		return `users-table__status users-table__status--${status.toLowerCase()}`;
	};

	return (
		<>
			<div className="users-table">
				{/* Mobile Card View */}
				<div className="users-table__mobile">
					{paginationData.users.map((user) => (
						<UserCard key={user.id} user={user} />
					))}
				</div>

				{/* Desktop Table View */}
				<div className="users-table__desktop">
					<table className="users-table__table">
						<thead>
							<tr className="users-table__header-row">
								{columns.map((column, index) => (
									<th key={column.key} className="users-table__header-cell">
										<div className="users-table__header-content">
											<span>{column.label}</span>
											<button
												onClick={(e) => handleFilterIconClick(e, column.key, index)}
												className={`users-table__filter-button ${filters[column.key as keyof FilterState] ? 'users-table__filter-button--active' : ''}`}>
												<MdFilterList />
											</button>
										</div>

										{/* Filter Popup */}
										{activeFilter?.key === column.key && (
											<FilterPopup
												isOpen={true}
												onClose={() => setActiveFilter(null)}
												onFilter={(newFilters) => {
													setFilters(newFilters);
													setCurrentPage(1);
												}}
												onReset={() => {
													setFilters({
														organization: '',
														username: '',
														email: '',
														date: '',
														phoneNumber: '',
														status: '',
													});
													setCurrentPage(1);
												}}
												currentFilters={filters}
												organizations={organizations}
												position={activeFilter.position}
											/>
										)}
									</th>
								))}
								<th className="users-table__header-cell users-table__header-cell--actions"></th>
							</tr>
						</thead>
						<tbody>
							{paginationData.users.map((user) => (
								<tr key={user.id} className="users-table__row">
									<td className="users-table__cell">{user.organization}</td>
									<td className="users-table__cell">{user.username}</td>
									<td className="users-table__cell">{user.email}</td>
									<td className="users-table__cell">{user.phoneNumber}</td>
									<td className="users-table__cell">{formatDate(user.dateJoined)}</td>
									<td className="users-table__cell">
										<span className={getStatusClass(user.status)}>{user.status}</span>
									</td>
									<td className="users-table__cell">
										<UserActionsMenu userId={user.id} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			<div className="users-table__pagination">
				{/* Items per page */}
				<div className="users-table__per-page">
					<span>Showing</span>
					<select
						value={itemsPerPage}
						onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
						className="users-table__per-page-select">
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
					<span>out of {paginationData.totalUsers}</span>
				</div>

				{/* Page numbers */}
				<div className="users-table__page-numbers">
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={!paginationData.hasPrevPage}
						className="users-table__page-nav">
						<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 1L1 6L6 11" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>

					{getPageNumbers().map((page, index) => (
						<button
							key={index}
							onClick={() => typeof page === 'number' && setCurrentPage(page)}
							className={`users-table__page-button ${page === currentPage ? 'users-table__page-button--active' : ''} ${page === '...' ? 'users-table__page-button--ellipsis' : ''}`}>
							{page}
						</button>
					))}

					<button
						onClick={() => setCurrentPage((p) => Math.min(paginationData.totalPages, p + 1))}
						disabled={!paginationData.hasNextPage}
						className="users-table__page-nav">
						<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M1 1L6 6L1 11" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
			</div>
		</>
	);
};

export default UsersTable;
