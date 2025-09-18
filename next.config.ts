/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_API_URL_GRAPHQL: process.env.NEXT_PUBLIC_API_URL_GRAPHQL,
		NEXT_PUBLIC_API_WS: process.env.NEXT_PUBLIC_API_WS,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '*.coupang.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '*.naver.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '*.11st.co.kr',
				port: '',
				pathname: '/**',
			},
		],
	},
};

module.exports = nextConfig;