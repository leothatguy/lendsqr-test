import Link from 'next/link';
import { User, UserStatus, formatDate } from '@/lib/api';

interface UserCardProps {
	user: User;
}

const UserCard = ({ user }: UserCardProps) => {
	const statusClass = `user-card__status user-card__status--${user.status.toLowerCase()}`;

	return (
		<div className="user-card">
			{/* Header: Org & Status */}
			<div className="user-card__header">
				<span className="user-card__org">{user.organization}</span>
				<span className={statusClass}>{user.status}</span>
			</div>

			{/* User Info */}
			<div className="user-card__info">
				<h3 className="user-card__name">{user.username}</h3>
				<p className="user-card__email">{user.email}</p>
				<p className="user-card__phone">{user.phoneNumber}</p>
			</div>

			{/* Footer: Date & Link */}
			<div className="user-card__footer">
				<div>
					<span className="user-card__date-label">Date Joined</span>
					<span className="user-card__date-value">{formatDate(user.dateJoined)}</span>
				</div>

				<Link href={`/users/${user.id}`} className="user-card__view-link">
					View Details
				</Link>
			</div>
		</div>
	);
};

export default UserCard;
