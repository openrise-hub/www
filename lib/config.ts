export const siteConfig = {
  name: "Openrise",
  description: "We build open-source software tools designed to solve real problems for everyone.",
  url: "https://openrise.dev",
  links: {
    github: "https://github.com/openrise-hub",
    linkedin: "https://www.linkedin.com/company/openrise-dev",
  },
} as const;

export type SiteConfig = typeof siteConfig;
