export type Chapter = {
  year: string;
  nav: string;
  svNav?: string;
  place: string;
  svPlace?: string;
  date?: string;
  svDate?: string;
  title?: string;
  svTitle?: string;
  role?: string;
  svRole?: string;
  points?: string[];
  svPoints?: string[];
  tech?: string[];
};

export const chapters: Chapter[] = [
  { year: 'START', nav: 'Västerås', place: 'VÄSTERÅS, SWEDEN', svPlace: 'VÄSTERÅS, SVERIGE' },
  { year: '2012', nav: 'University', svNav: 'Universitet', place: 'KARLSTAD', date: '2012 — 2015', title: 'Karlstad University', svTitle: 'Karlstads universitet', role: 'BSc, IT Design · Systems Design', svRole: 'Kandidatexamen, IT-Design · Systemdesign', points: ['Built a foundation in computer science, software architecture and algorithmic problem-solving.', 'Studied design patterns, object-oriented programming and web technologies — the starting point for a career in frontend architecture.'], svPoints: ['Byggde en grund inom datavetenskap, mjukvaruarkitektur och algoritmisk problemlösning.', 'Studerade designmönster, objektorienterad programmering och webbteknik — starten på en karriär inom frontendarkitektur.'], tech: ['System design', 'OOP', 'Web technologies'] },
  { year: '2016', nav: 'Ericsson', place: 'KARLSKRONA', date: 'JAN 2016 — JUL 2016', title: 'Ericsson', role: 'Systems Developer', svRole: 'Systemutvecklare', points: ['Worked in a team of three on a proof of concept integrating Ericsson products with Amazon Web Services.', 'Helped migrate Ericsson Adaptive Inventory, one of the company’s largest platforms, to AWS Marketplace.'], svPoints: ['Arbetade i ett team på tre personer med ett konceptprojekt för att integrera Ericssons produkter med Amazon Web Services.', 'Bidrog till att migrera Ericsson Adaptive Inventory, en av företagets största plattformar, till AWS Marketplace.'], tech: ['Java', 'HTML', 'AWS', 'Agile'] },
  { year: '2016', nav: 'Läkarleasing', place: 'STOCKHOLM', date: 'AUG 2016 — OCT 2019', svDate: 'AUG 2016 — OKT 2019', title: 'Läkarleasing / IStaff', role: 'Frontend Developer & Team Leader', svRole: 'Frontendutvecklare & teamledare', points: ['Led a three-person frontend team, training and supporting new developers.', 'Developed a staffing and recruitment platform that helped recruiters manage their candidates.', 'Rebuilt the legacy product for a cloud-based platform, modernising its interface and technology.'], svPoints: ['Ledde ett frontendteam på tre personer och utbildade och stöttade nya utvecklare.', 'Utvecklade en bemannings- och rekryteringsplattform för att hjälpa rekryterare hantera kandidater.', 'Skrev om den äldre produkten för en molnbaserad plattform och moderniserade gränssnitt och teknik.'], tech: ['React', 'Webpack', 'Node.js', 'TypeScript', 'Cypress'] },
  { year: '2019', nav: 'D. Wellington', place: 'STOCKHOLM', date: 'OCT 2019 — JUL 2022', svDate: 'OKT 2019 — JUL 2022', title: 'Daniel Wellington', role: 'Senior Frontend Developer', svRole: 'Senior frontendutvecklare', points: ['Maintained and developed the webshop, contributing to its overall structure.', 'Helped create a company-wide component library using Atomic Design.', 'Trained new developers joining the team.'], svPoints: ['Förvaltade och utvecklade webbshopen och bidrog till planeringen av dess struktur.', 'Medverkade i skapandet av ett gemensamt komponentbibliotek med Atomic Design.', 'Utbildade nya utvecklare i teamet.'], tech: ['React', 'Gatsby', 'TypeScript', 'Node.js', 'Contentful', 'Optimizely', 'Styled Components'] },
  { year: '2022', nav: 'Daresay', place: 'SOLNA, STOCKHOLM', date: 'AUG 2022 — SEP 2024', title: 'Daresay', role: 'Frontend Developer', svRole: 'Frontendutvecklare', points: ['Built an application that visualised time savings in RNA-LNP drug development.', 'Developed Cramo’s SmartControl portal for equipment rental, project budgets and sensor data.', 'Contributed to ClimateView using Next.js and Sanity, collaborating closely with designers and backend developers.'], svPoints: ['Byggde en applikation som visualiserade tidsbesparingar inom RNA-LNP-läkemedelsutveckling.', 'Utvecklade Cramos SmartControl-portal för maskinuthyrning, projektbudgetar och sensordata.', 'Bidrog till ClimateView med Next.js och Sanity i nära samarbete med designers och backendutvecklare.'], tech: ['Angular', 'TypeScript', 'Node.js', 'Azure', 'Next.js', 'Sanity'] },
  { year: '2024', nav: 'Consid / VW', place: 'VÄSTERÅS, SWEDEN', svPlace: 'VÄSTERÅS, SVERIGE', date: 'AUG 2024 — PRESENT', svDate: 'AUG 2024 — NUVARANDE', title: 'Consid / Volkswagen', role: 'Frontend Developer & UX Designer', svRole: 'Frontendutvecklare & UX-designer', points: ['Developing scalable, user-friendly web applications, primarily in Angular.', 'Designing and prototyping interfaces in Figma, taking solutions from concept to product with product owners and development teams.', 'Optimising performance, accessibility and usability.'], svPoints: ['Utvecklar skalbara och användarvänliga webbapplikationer, främst i Angular.', 'Designar och prototypar gränssnitt i Figma och tar lösningar från koncept till färdig produkt tillsammans med produktägare och utvecklingsteam.', 'Optimerar prestanda, tillgänglighet och användbarhet.'], tech: ['Angular', 'TypeScript', 'C#', 'Azure', 'Figma', 'Node.js', 'React'] },
];

// Set verified contact details here when supplied by the owner.
export const contact = { email: '', linkedin: '' };

// Background panorama per chapter (index matches `chapters`).
export const environments = [
  { file: 'vasteras-promenade.png', position: 45 },
  { file: 'karlstad.png', position: 48 },
  { file: 'karlskrona.png', position: 50 },
  { file: 'stockholm-promenade.png', position: 0 },
  { file: 'stockholm-promenade.png', position: 50 },
  { file: 'stockholm-promenade.png', position: 100 },
  { file: 'vasteras-promenade.png', position: 45 },
];

type TextKey = 'nav' | 'place' | 'date' | 'title' | 'role';
const svKeys = { nav: 'svNav', place: 'svPlace', date: 'svDate', title: 'svTitle', role: 'svRole' } as const;

/** Swedish text when available and selected, otherwise English. */
export function txt(c: Chapter, key: TextKey, sv: boolean): string {
  return (sv && c[svKeys[key]]) || c[key] || '';
}

export function points(c: Chapter, sv: boolean): string[] {
  return (sv && c.svPoints) || c.points || [];
}
