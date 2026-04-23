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
  /** Anchor stat for the chapter — the number a reader should walk away with.
   *  Optional; early-career roles may not have one worth calling out. */
  readonly stat?: {
    readonly value: string;
    readonly label: string;
  };
}

/**
 * Work timeline — newest first. Narratives paraphrase
 * /projects/kian-coffee/docs/cv.md; anchor stats are the numbers the reader
 * should walk away with for each chapter.
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
    stat: {
      value: '85%',
      label: 'context coverage on the auth rewrite, up from under 20%. No fresh hires needed.',
    },
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
    stat: {
      value: '12M+',
      label: 'transactions per hour through the pipeline. 1-hour SLA held under burst load.',
    },
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
    stat: {
      value: '8 → 2',
      label: 'Eight-person team that shipped like a pair. Owned infra, backend, and UI.',
    },
  },
  {
    chapter: 'The first chapter',
    company: 'IBM Watson',
    title: 'Software Engineer Intern',
    range: 'Summer 2018',
    narrative: `Summer internship on the Watson platform. [Kian: one sentence
here on what you shipped, or what stuck with you about working at IBM scale
before the rest of the career started.]`,
    domains: ['Backend'],
  },
];
