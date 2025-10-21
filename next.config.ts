import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',

  // GitHub Pages использует поддиректорию username.github.io/repo-name
  basePath: isProd && isGitHubPages ? '/test-antropic-cloud' : '',

  // Отключаем оптимизацию изображений для статического экспорта
  images: {
    unoptimized: true,
  },

  // Отключаем trailing slash для GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
