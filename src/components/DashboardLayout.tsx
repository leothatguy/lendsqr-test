'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="dashboard-layout">
			<Header onMenuClick={() => setIsSidebarOpen(true)} />
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			{/* Main Content */}
			<main className="dashboard-layout__main">
				<div className="dashboard-layout__content">{children}</div>
			</main>
		</div>
	);
}
