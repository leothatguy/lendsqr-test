'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
	BriefcaseIcon,
	HomeIcon,
	UsersMenuIcon,
	GuarantorsIcon,
	SackIcon,
	HandshakeIcon,
	PiggyBankIcon,
	LoanRequestIcon,
	UserCheckIcon,
	UserTimesIcon,
	BankIcon,
	CoinsIcon,
	TransactionIcon,
	GalaxyIcon,
	UserCogIcon,
	ScrollIcon,
	ChartBarIcon,
	SlidersIcon,
	BadgePercentIcon,
	ClipboardListIcon,
	DropdownIcon,
	LogoutIcon,
	SystemsMessagesIcon,
} from './icons';

interface MenuItem {
	label: string;
	href: string;
	icon: React.ReactNode;
}

interface MenuSection {
	title?: string;
	items: MenuItem[];
}

const menuSections: MenuSection[] = [
	{
		items: [{ label: 'Switch Organization', href: '#', icon: <BriefcaseIcon /> }],
	},
	{
		items: [{ label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> }],
	},
	{
		title: 'CUSTOMERS',
		items: [
			{ label: 'Users', href: '/users', icon: <UsersMenuIcon /> },
			{ label: 'Guarantors', href: '/dashboard/guarantors', icon: <GuarantorsIcon /> },
			{ label: 'Loans', href: '/dashboard/loans', icon: <SackIcon /> },
			{ label: 'Decision Models', href: '/dashboard/decision-models', icon: <HandshakeIcon /> },
			{ label: 'Savings', href: '/dashboard/savings', icon: <PiggyBankIcon /> },
			{ label: 'Loan Requests', href: '/dashboard/loan-requests', icon: <LoanRequestIcon /> },
			{ label: 'Whitelist', href: '/dashboard/whitelist', icon: <UserCheckIcon /> },
			{ label: 'Karma', href: '/dashboard/karma', icon: <UserTimesIcon /> },
		],
	},
	{
		title: 'BUSINESSES',
		items: [
			{ label: 'Organization', href: '/dashboard/organization', icon: <BankIcon /> },
			{ label: 'Loan Products', href: '/dashboard/loan-products', icon: <LoanRequestIcon /> },
			{ label: 'Savings Products', href: '/dashboard/savings-products', icon: <BankIcon /> },
			{ label: 'Fees and Charges', href: '/dashboard/fees-charges', icon: <CoinsIcon /> },
			{ label: 'Transactions', href: '/dashboard/transactions', icon: <TransactionIcon /> },
			{ label: 'Services', href: '/dashboard/services', icon: <GalaxyIcon /> },
			{ label: 'Service Account', href: '/dashboard/service-account', icon: <UserCogIcon /> },
			{ label: 'Settlements', href: '/dashboard/settlements', icon: <ScrollIcon /> },
			{ label: 'Reports', href: '/dashboard/reports', icon: <ChartBarIcon /> },
		],
	},
	{
		title: 'SETTINGS',
		items: [
			{ label: 'Preferences', href: '/dashboard/preferences', icon: <SlidersIcon /> },
			{ label: 'Fees and Pricing', href: '/dashboard/fees-pricing', icon: <BadgePercentIcon /> },
			{ label: 'Audit Logs', href: '/dashboard/audit-logs', icon: <ClipboardListIcon /> },
			{ label: 'Systems Messages', href: '/dashboard/systems-messages', icon: <SystemsMessagesIcon /> },
		],
	},
];

interface SidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
	const pathname = usePathname();

	// Treat /users and /users/* as /users for active state
	const getActivePath = () => {
		if (pathname === '/users') return '/users';
		if (pathname.startsWith('/users/')) return '/users';
		return pathname;
	};
	const activePath = getActivePath();

	return (
		<>
			{/* Mobile Overlay */}
			{isOpen && <div className="sidebar__overlay" onClick={onClose} aria-hidden="true" />}

			<aside className={`sidebar__container ${isOpen ? 'sidebar__container--open' : ''}`}>
				<nav className="sidebar__nav">
					{menuSections.map((section, sectionIndex) => (
						<div key={sectionIndex} className="sidebar__section">
							{/* Section Title */}
							{section.title && <h3 className="sidebar__section-title">{section.title}</h3>}

							{/* Menu Items */}
							<ul className="sidebar__menu-list">
								{section.items.map((item, itemIndex) => {
									const isActive = activePath === item.href;
									const isSwitchOrg = item.label === 'Switch Organization';

									return (
										<li key={itemIndex} className="sidebar__menu-item">
											<Link
												href={item.href}
												onClick={onClose}
												className={`sidebar__menu-link ${isActive ? 'sidebar__menu-link--active' : ''} ${isSwitchOrg ? 'sidebar__menu-link--switch-org' : ''}`}>
												<span className={`sidebar__menu-icon ${isActive ? 'sidebar__menu-icon--active' : ''}`}>
													{item.icon}
												</span>
												<span className="sidebar__menu-label">{item.label}</span>
												{isSwitchOrg && (
													<span className="sidebar__menu-dropdown">
														<DropdownIcon />
													</span>
												)}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}

					{/* Logout Section */}
					<div className="sidebar__logout-section">
						<button
							onClick={() => {
								useAuthStore.getState().logout();
								window.location.href = '/login';
							}}
							className="sidebar__logout-button">
							<LogoutIcon />
							<span>Logout</span>
						</button>
					</div>

					{/* Version */}
					<p className="sidebar__version">v1.2.0</p>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
