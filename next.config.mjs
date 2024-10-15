import withSvgr from 'next-svgr';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
  webpack(config) {
    // Configuración existente
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // ... otras configuraciones que puedas tener
};

export default withSvgr(nextConfig);
