/** @type {import('next').NextConfig} */

const proxy = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: process.env.API + "/:path*/",
			},
		];
	},
};

module.exports = {
	...proxy,
	// reactStrictMode: false,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
};
