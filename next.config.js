/* const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
}); */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: false,
});

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

module.exports = /* withPWA */({
	...proxy,
	// reactStrictMode: false,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
});
