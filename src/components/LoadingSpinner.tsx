'use client';

interface LoadingSpinnerProps {
	message?: string;
	size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) => {
	const sizeClass = `loading-spinner--${size}`;

	return (
		<div className={`loading-spinner ${sizeClass}`}>
			{/* Main Spinner Container */}
			<div className="loading-spinner__container">
				{/* Outer rotating ring */}
				<div className={`loading-spinner__ring loading-spinner__ring--${size}`} />

				{/* Inner pulsing circle */}
				<div className="loading-spinner__inner">
					<div className={`loading-spinner__pulse loading-spinner__pulse--${size}`} />
				</div>

				{/* Orbiting dots */}
				<div className="loading-spinner__orbit loading-spinner__orbit--1">
					<div className={`loading-spinner__dot loading-spinner__dot--${size} loading-spinner__dot--cyan`} />
				</div>
				<div className="loading-spinner__orbit loading-spinner__orbit--2">
					<div className={`loading-spinner__dot loading-spinner__dot--${size} loading-spinner__dot--blue`} />
				</div>
				<div className="loading-spinner__orbit loading-spinner__orbit--3">
					<div className={`loading-spinner__dot loading-spinner__dot--${size} loading-spinner__dot--light`} />
				</div>
			</div>

			{/* Loading Text with animated dots */}
			<div className={`loading-spinner__message loading-spinner__message--${size}`}>
				<span>{message}</span>
				<span className="loading-spinner__dots">
					<span className="loading-spinner__bounce loading-spinner__bounce--1">.</span>
					<span className="loading-spinner__bounce loading-spinner__bounce--2">.</span>
					<span className="loading-spinner__bounce loading-spinner__bounce--3">.</span>
				</span>
			</div>

			{/* Progress bar animation */}
			<div className="loading-spinner__progress">
				<div className="loading-spinner__progress-bar" />
			</div>
		</div>
	);
};

export default LoadingSpinner;
