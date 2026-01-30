import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserStatus } from '@/lib/api';

export interface FilterState {
	organization: string;
	username: string;
	email: string;
	date: string;
	phoneNumber: string;
	status: string;
}

interface FilterPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onFilter: (filters: FilterState) => void;
	onReset: () => void;
	currentFilters: FilterState;
	organizations: string[];
	position: { top: number; left: number };
}

const FilterPopup = ({
	isOpen,
	onClose,
	onFilter,
	onReset,
	currentFilters,
	organizations,
	position,
}: FilterPopupProps) => {
	const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setLocalFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFilter(localFilters);
		onClose();
	};

	const handleReset = () => {
		setLocalFilters({
			organization: '',
			username: '',
			email: '',
			date: '',
			phoneNumber: '',
			status: '',
		});
		onReset();
		onClose();
	};

	if (!isOpen || !mounted) return null;

	// Use createPortal to render outside the table container
	return createPortal(
		<>
			{/* Backdrop to close on click outside */}
			<div className="filter-popup__backdrop" onClick={onClose} />

			<div
				className="filter-popup"
				style={{
					top: position.top,
					left: position.left,
				}}>
				<form onSubmit={handleSubmit} className="filter-popup__form">
					{/* Organization */}
					<div className="filter-popup__field">
						<label htmlFor="organization" className="filter-popup__label">
							Organization
						</label>
						<select
							name="organization"
							id="organization"
							value={localFilters.organization}
							onChange={handleChange}
							className="filter-popup__select">
							<option value="">Select</option>
							{organizations.map((org) => (
								<option key={org} value={org}>
									{org}
								</option>
							))}
						</select>
					</div>

					{/* Username */}
					<div className="filter-popup__field">
						<label htmlFor="username" className="filter-popup__label">
							Username
						</label>
						<input
							type="text"
							name="username"
							id="username"
							value={localFilters.username}
							onChange={handleChange}
							placeholder="User"
							className="filter-popup__input"
						/>
					</div>

					{/* Email */}
					<div className="filter-popup__field">
						<label htmlFor="email" className="filter-popup__label">
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							value={localFilters.email}
							onChange={handleChange}
							placeholder="Email"
							className="filter-popup__input"
						/>
					</div>

					{/* Date */}
					<div className="filter-popup__field">
						<label htmlFor="date" className="filter-popup__label">
							Date
						</label>
						<input
							type="date"
							name="date"
							id="date"
							value={localFilters.date}
							onChange={handleChange}
							placeholder="Date"
							className="filter-popup__input"
						/>
					</div>

					{/* Phone Number */}
					<div className="filter-popup__field">
						<label htmlFor="phoneNumber" className="filter-popup__label">
							Phone Number
						</label>
						<input
							type="text"
							name="phoneNumber"
							id="phoneNumber"
							value={localFilters.phoneNumber}
							onChange={handleChange}
							placeholder="Phone Number"
							className="filter-popup__input"
						/>
					</div>

					{/* Status */}
					<div className="filter-popup__field">
						<label htmlFor="status" className="filter-popup__label">
							Status
						</label>
						<select
							name="status"
							id="status"
							value={localFilters.status}
							onChange={handleChange}
							className="filter-popup__select">
							<option value="">Select</option>
							<option value="Active">Active</option>
							<option value="Inactive">Inactive</option>
							<option value="Pending">Pending</option>
							<option value="Blacklisted">Blacklisted</option>
						</select>
					</div>

					{/* Actions */}
					<div className="filter-popup__actions">
						<button type="button" onClick={handleReset} className="filter-popup__button filter-popup__button--reset">
							Reset
						</button>
						<button type="submit" className="filter-popup__button filter-popup__button--filter">
							Filter
						</button>
					</div>
				</form>
			</div>
		</>,
		document.body,
	);
};

export default FilterPopup;
