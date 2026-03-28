import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    // Custom ignores (in addition to the ones provided by the Next.js config)
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];
