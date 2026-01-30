'use client';

import Image from 'next/image';
import { SearchIcon, BellIcon, DropdownIcon, MenuIcon } from './icons';

interface HeaderProps {
	onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
	return (
		<header className="header">
			{/* Left Section */}
			<div className="header__left">
				{/* Hamburger Menu (Mobile/Tablet) */}
				<button onClick={onMenuClick} className="header__mobile-toggle" aria-label="Toggle menu">
					<MenuIcon />
				</button>

				<Image src="/logo.svg" alt="Lendsqr" width={145} height={30} className="header__logo" />

				{/* Search Bar (Desktop) */}
				<div className="header__search">
					<input type="text" placeholder="Search for anything" className="header__search-input" />
					<button className="header__search-button">
						<SearchIcon />
					</button>
				</div>
			</div>

			{/* Right Section */}
			<div className="header__right">
				{/* Docs Link */}
				<a href="#" className="header__docs-link">
					Docs
				</a>

				{/* Notification Bell */}
				<button className="header__notification">
					<BellIcon />
				</button>

				{/* User Profile */}
				<div className="header__profile">
					<div className="header__avatar">
						<span className="header__avatar-initial">A</span>
					</div>
					<button className="header__profile-button">
						<span className="header__username">Adedeji</span>
						<DropdownIcon />
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
