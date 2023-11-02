const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: false,
});

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

module.exports = withBundleAnalyzer({
	...proxy,
	// reactStrictMode: false,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
});
