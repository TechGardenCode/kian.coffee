export interface WorkRole {
  /** Chapter title — the *frame* for this era. Narrative, not HR. */
  readonly chapter: string;
  readonly company: string;
  readonly title: string;
  readonly range: string;
  /** Short narrative — paraphrased from the CV with no embellishment.
   *  If the CV doesn't say it, it doesn't go here. */
  readonly narrative: string;
  /** Domain tags — the shape of the work, sourced from the CV bullets. */
  readonly domains: readonly string[];
}

/**
 * Work timeline — newest first. Every line below is paraphrased from
 * /projects/kian-coffee/docs/cv.md. Stat placeholders stay as `[HEADLINE STAT]`
 * markers on the page, filled in during a later content pass.
 */
export const WORK: readonly WorkRole[] = [
  {
    chapter: 'The breadth chapter',
    company: 'Mastercard',
    title: 'Lead Software Engineer',
    range: '2023 — present',
    narrative: `Architected AI-first foundations for the engineering org — reusable
skills, MCP servers, agent patterns, and a knowledge-base pipeline rolling
out across teams. In the same stretch: led planning and rollout of an
enterprise design system adopted across global programs, delivered a
customer-facing AI-empowered product end-to-end (design → executive pitch
→ integration), and led the AI platform POC that set the foundation for
compound AI systems across the org.`,
    domains: [
      'AI Platform',
      'Design System',
      'Org Design',
    ],
  },
  {
    chapter: 'The depth chapter',
    company: 'Mastercard',
    title: 'Senior Software Engineer',
    range: '2020 — 2023',
    narrative: `Designed and delivered a highly available, event-driven data pipeline
on Kafka, Spark, and Hadoop — millions of transactions per hour, concept
to production in three months. Also implemented RBAC unifying access
across fifteen microservices, led the modernization to a micro-frontend
architecture, and built the retry + circuit-breaker patterns that keep
burst traffic from becoming incidents.`,
    domains: [
      'Data · Streaming',
      'Distributed Systems',
      'Frontend Architecture',
      'Access Control',
    ],
  },
  {
    chapter: 'The full-stack chapter',
    company: 'Conseqta Technology',
    title: 'Software Engineer',
    range: '2019 — 2020',
    narrative: `Modernization work at an eight-person startup. Migrated AngularJS to
Angular, broke a monolith into Spring Boot microservices, and stood up a
GitOps pipeline on GitLab that shipped to both on-prem and cloud
Kubernetes. Owned features across infrastructure, backend, and UI.`,
    domains: [
      'Full-stack',
      'Kubernetes',
      'CI/CD',
    ],
  },
  {
    chapter: 'The first chapter',
    company: 'IBM Watson',
    title: 'Software Engineer Intern',
    range: 'Summer 2018',
    narrative: `[INTERNSHIP NARRATIVE — 1–2 sentences. The CV has no detail here; fill
in what was memorable: what you built, what you learned, what it was like
shipping at IBM's scale as an intern.]`,
    domains: ['Backend'],
  },
];
