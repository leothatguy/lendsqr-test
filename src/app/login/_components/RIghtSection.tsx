import Image from 'next/image';

const RIghtSection = () => {
	return (
		<section className="login__illustration-section">
			<div className="login__logo-wrapper">
				<Image src={'/logo.svg'} alt="logo" width={200} height={40} className="login__logo" />
			</div>
			<Image
				src={'/auth-illustration.png'}
				alt="Auth Illustration"
				height={340}
				width={600}
				className="login__illustration"
			/>
		</section>
	);
};
export default RIghtSection;
