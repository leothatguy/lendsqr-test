import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MoreIcon, EyeIcon, UserTimesIcon, UserCheckIcon } from '@/components/icons';
import { useUserStore } from '@/lib/store';

interface UserActionsMenuProps {
	userId: string;
}

const UserActionsMenu = ({ userId }: UserActionsMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { blacklistUser, activateUser } = useUserStore();

	// Toggle menu visibility
	const toggleMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(!isOpen);
	};

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="user-actions-menu" ref={menuRef}>
			<button onClick={toggleMenu} className="user-actions-menu__trigger">
				<MoreIcon />
			</button>

			{isOpen && (
				<div className="user-actions-menu__dropdown">
					<div className="user-actions-menu__list">
						{/* View Details */}
						<Link href={`/users/${userId}`} className="user-actions-menu__item">
							<span className="user-actions-menu__icon">
								<EyeIcon />
							</span>
							View Details
						</Link>

						{/* Blacklist User */}
						<button
							onClick={() => {
								blacklistUser(userId);
								setIsOpen(false);
							}}
							className="user-actions-menu__item">
							<span className="user-actions-menu__icon">
								<UserTimesIcon />
							</span>
							Blacklist User
						</button>

						{/* Activate User */}
						<button
							onClick={() => {
								activateUser(userId);
								setIsOpen(false);
							}}
							className="user-actions-menu__item">
							<span className="user-actions-menu__icon">
								<UserCheckIcon />
							</span>
							Activate User
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserActionsMenu;
