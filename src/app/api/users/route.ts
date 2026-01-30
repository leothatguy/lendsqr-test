import { NextResponse } from 'next/server';

export async function GET() {
	const apiUrl = process.env.JSON_GENERATOR_URL;
	const apiToken = process.env.JSON_GENERATOR_TOKEN;

	if (!apiUrl || !apiToken) {
		console.error('Missing JSON_GENERATOR_URL or JSON_GENERATOR_TOKEN environment variables');
		return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiToken}`,
				'Content-Type': 'application/json',
			},
			// Cache for 1 hour to reduce API calls
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`);
		}

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching users from JSON Generator:', error);
		return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
	}
}
