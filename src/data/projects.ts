export type Project = {
  title: string;
  tag: string;
  kind: "website" | "video" | "photo";
  siteUrl?: string;
  description?: string;
};

export const projects: Project[] = [
  {
    title: "SRCERER.IO",
    tag: "Data Sources • Web",
    kind: "website",
    siteUrl: "https://www.srcerer.io/",
    description:
      "A data source integration platform connecting apps to verified databases and APIs with secure access and community ratings.",
  },
  {
    title: "PAJU",
    tag: "Restaurant • Web",
    kind: "website",
    siteUrl: "https://www.pajurestaurant.com/",
    description:
      "Contemporary Korean cuisine in Seattle—philosophy, menu, hours, and reservations in a clean, modern experience.",
  },
  {
    title: "CivicStream",
    tag: "Plan Compliance • Web",
    kind: "website",
    siteUrl: "https://civicstream.ai/",
    description:
      "An AI-powered plan review workspace that turns plan uploads into code-aware findings, reviewer-ready summaries, and smart routing.",
  },
  {
    title: "James Mongrain Glass",
    tag: "Artist Portfolio • Web",
    kind: "website",
    siteUrl: "https://jamesmongrainglass.com/",
    description:
      "A focused portfolio showcasing glasswork series with simple navigation, high-impact imagery, and clear contact paths.",
  },
  {
    title: "Faster Production",
    tag: "AI Ops • Web",
    kind: "website",
    siteUrl: "https://www.fasterproduction.com/",
    description:
      "An AI layer for ERP workflows—turning questions into one-click actions, suggested tasks, and composable dashboard blocks.",
  },
  {
    title: "iSushi Issaquah",
    tag: "Menu • Web",
    kind: "website",
    siteUrl: "https://www.issaquahisushi.com/",
    description:
      "A straightforward restaurant site with a full menu, specials, ordering info, and clear hours/location details.",
  },
];


