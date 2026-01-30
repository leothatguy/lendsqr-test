'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const LeftSection = () => {
	const router = useRouter();
	const { login, isLoading } = useAuthStore();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError('Please enter both email and password.');
			return;
		}

		const success = await login(email, password);
		if (success) {
			router.push('/users');
		} else {
			setError('Login failed. Please try again.');
		}
	};

	return (
		<section className="login__form-section">
			<div className="login__header">
				<h1 className="login__title">Welcome!</h1>
				<p className="login__subtitle">Enter details to login.</p>
			</div>

			<form onSubmit={handleSubmit} className="login__form">
				{/* Error Message */}
				{error && <div className="login__error">{error}</div>}

				{/* Email Input */}
				<div className="login__input-wrapper">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isLoading}
						className="login__input"
					/>
				</div>

				{/* Password Input */}
				<div className="login__input-wrapper">
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isLoading}
						className="login__input login__input--password"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						disabled={isLoading}
						className="login__show-password">
						{showPassword ? 'HIDE' : 'SHOW'}
					</button>
				</div>

				{/* Forgot Password Link */}
				<a href="#" className="login__forgot-link">
					Forgot Password?
				</a>

				{/* Login Button */}
				<button type="submit" disabled={isLoading} className="login__submit-button">
					{isLoading ? (
						<>
							<svg className="login__spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="login__spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path
									className="login__spinner-fill"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Logging In...
						</>
					) : (
						'Log In'
					)}
				</button>
			</form>
		</section>
	);
};

export default LeftSection;
