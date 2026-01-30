interface StatCardProps {
	icon: React.ReactNode;
	iconVariant: 'pink' | 'purple' | 'orange' | 'red';
	label: string;
	value: string;
}

const StatCard = ({ icon, iconVariant, label, value }: StatCardProps) => {
	return (
		<div className="stat-card">
			<div className={`stat-card__icon stat-card__icon--${iconVariant}`}>{icon}</div>
			<p className="stat-card__label">{label}</p>
			<p className="stat-card__value">{value}</p>
		</div>
	);
};

export default StatCard;
