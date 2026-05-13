import nextConfig from 'eslint-config-next';

const config = [
  { ignores: ['android/**', 'ios/**', 'out/**', '.next/**'] },
  ...nextConfig,
];

export default config;
