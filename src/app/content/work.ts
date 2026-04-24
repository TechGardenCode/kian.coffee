export interface WorkRole {
  readonly company: string;
  readonly title: string;
  readonly range: string;
}

export const WORK: readonly WorkRole[] = [
  { range: '2023 — present', company: 'Mastercard',          title: 'Lead Software Engineer' },
  { range: '2020 — 2023',    company: 'Mastercard',          title: 'Senior Software Engineer' },
  { range: '2019 — 2020',    company: 'Conseqta Technology', title: 'Software Engineer' },
  { range: 'Summer 2018',    company: 'IBM Watson',          title: 'Software Engineer Intern' },
];
