module.exports = {
  reactStrictMode: true,
  transpilePackages: ["mdg-nar"],
  experimental: {
    appDir: true,
  },
  env: {
    MUI_X_LICENSE_KEY: process.env.MUI_X_LICENSE_KEY,
  }
};
