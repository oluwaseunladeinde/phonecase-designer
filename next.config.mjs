/** @type {import('next').NextConfig} */
const nextConfig = {
    crossOrigin: 'anonymous',
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "utfs.io",
            },
        ],
    },
};

export default nextConfig;
