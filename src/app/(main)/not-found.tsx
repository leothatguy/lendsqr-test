import Link from 'next/link';
import { MdErrorOutline } from 'react-icons/md';

export default function NotFound() {
	return (
		<div className="not-found">
			<div className="not-found__icon-wrapper">
				<MdErrorOutline className="not-found__icon" />
			</div>

			<h2 className="not-found__title">Page Not Found</h2>

			<p className="not-found__message">
				Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
			</p>

			<Link href="/dashboard" className="not-found__link">
				BACK TO DASHBOARD
			</Link>
		</div>
	);
}
