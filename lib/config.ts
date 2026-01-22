/**
 * Site configuration and constants
 */
export const siteConfig = {
  name: "Openrise",
  description: "We build software tools designed to solve real problems for the open-source community.",
  url: "https://openrise.dev",
  links: {
    github: "https://github.com/openrise-hub",
    linkedin: "https://www.linkedin.com/company/openrise-dev",
  },
} as const;

export type SiteConfig = typeof siteConfig;
