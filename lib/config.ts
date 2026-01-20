/**
 * Site configuration and constants
 */
export const siteConfig = {
  name: "Openrise",
  description: "We build software tools designed to solve real problems for the open-source community.",
  url: "https://openrise.dev",
  links: {
    github: "https://github.com/openrise-hub",
    linkedin: "https://linkedin.com/company/openrise",
  },
} as const;

export type SiteConfig = typeof siteConfig;
