import { REFLECTION_CATEGORIES } from './constants';

export interface AreaOfInterestItem {
  title: string;
  description: string;
}

export const AUTHENTIC_FALLBACK_PROFILE = {
  id: 'authentic-profile',
  fullName: 'Faryal',
  title: 'BS English Student | Aspiring English Language Educator',
  tagline: 'Learning Through Language, Growing Through Creativity.',
  location: 'Rawalpindi, Pakistan',
  email: 'faryalgull042@hotmail.com',
  phone: '+92 331 5407441',
  summary:
    'A dedicated and enthusiastic BS English student at Air University with strong communication, writing, critical thinking, and creative skills. Interested in English language, literature, education, and continuous learning. Has completed professional training in Digital Marketing and Graphic Design through DigiSkills.pk and aims to develop professionally while contributing positively to the educational field.',
  bio:
    'Currently pursuing a Bachelor of English at Air University (2023–Present), I am building a foundation in English language, literary analysis, academic writing, and communicative competence. Alongside university coursework, I completed six-month training programs in Digital Marketing and Graphic Design through DigiSkills.pk, strengthening my skills in visual communication, structured layout, and digital content creation. My goal is to bridge strong linguistic foundations with thoughtful, modern educational approaches as an aspiring English Language Educator.',
  teachingPhilosophy:
    'As an aspiring English Language Educator, I am exploring student-centred learning, Communicative Language Teaching (CLT), Task-Based Language Teaching (TBLT), interactive classroom activities, and technology-enhanced language learning. I believe language education flourishes when learners are encouraged to express ideas clearly, think critically, and engage creatively with authentic texts and real-world communication tasks. These represent my developing academic interests and future teaching goals.',
  personalValues: [
    'Continuous Learning & Intellectual Curiosity',
    'Clarity and Empathy in Communication',
    'Academic Integrity & Reflective Practice',
    'Creativity & Adaptability',
    'Collaborative Growth & Responsibility',
  ],
  futureGoals: [
    'Complete the Bachelor of English at Air University with strong academic standing',
    'Develop practical expertise in English Language Teaching (ELT) methodologies',
    'Design accessible, student-centred instructional materials and digital learning resources',
    'Contribute meaningfully to language education and communication development',
  ],
  professionalVision:
    'To grow into a thoughtful, creative, and reflective English Language Educator who combines strong foundations in English language and literature with modern communication, visual design, and educational technology.',
  languages: ['English', 'Urdu', 'Pashto'],
  profileImageUrl: null as string | null,
  profileImageId: null as string | null,
  cvDocumentUrl: '/assets/aistudio/Faryal_CV_5771404d.pdf',
};

export const AUTHENTIC_FALLBACK_SETTINGS = {
  id: 'authentic-settings',
  siteTitle: 'Faryal | Academic & Professional E-Portfolio',
  tagline: 'Learning Through Language, Growing Through Creativity.',
  metaDescription:
    'Academic and professional e-portfolio of Faryal, Bachelor of English student at Air University and aspiring English Language Educator.',
  footerText: 'Faryal — Academic & Professional E-Portfolio. Rawalpindi, Pakistan.',
  contactEmail: 'faryalgull042@hotmail.com',
  contactPhone: '+92 331 5407441',
  location: 'Rawalpindi, Pakistan',
  linkedinUrl: null as string | null,
  githubUrl: null as string | null,
  twitterUrl: null as string | null,
  instagramUrl: null as string | null,
  showResumeDownload: true,
};

export const AUTHENTIC_FALLBACK_HOME = {
  id: 'authentic-home',
  heroHeadline: "Hello, I'm Faryal",
  heroTitle: 'BS English Student | Aspiring English Language Educator',
  heroTagline: 'Learning Through Language, Growing Through Creativity.',
  heroIntro:
    'Pursuing a Bachelor of English at Air University while building skills in communication, creative writing, digital marketing, and graphic design—preparing for a future in thoughtful, student-centred English language education.',
  aboutPreviewTitle: 'Academic Foundation & Creative Growth',
  aboutPreviewText:
    'As an undergraduate student of English at Air University, I combine critical reading and writing with visual communication and digital literacy developed through DigiSkills.pk.',
  areasOfInterest: [
    {
      title: 'English Language & Literature',
      description:
        'Exploring linguistic structure, literary expression, critical reading, and textual interpretation.',
    },
    {
      title: 'English Language Teaching',
      description:
        'Studying foundational ELT principles, learner engagement, and communicative competence.',
    },
    {
      title: 'Creative Writing',
      description:
        'Developing narrative voice, structured prose, and reflective academic composition.',
    },
    {
      title: 'Communication Skills',
      description:
        'Strengthening interpersonal clarity, presentation delivery, and collaborative dialogue.',
    },
    {
      title: 'Educational Technology',
      description:
        'Examining how digital tools and multimedia can enrich modern language classrooms.',
    },
    {
      title: 'Digital Learning',
      description:
        'Designing accessible digital graphics and structured online learning experiences.',
    },
    {
      title: 'Modern Teaching Strategies',
      description:
        'Researching student-centred, task-based, and interactive approaches to language instruction.',
    },
  ] as AreaOfInterestItem[],
  academicActivitiesTitle: 'Continuing Academic Development',
  academicActivitiesText:
    'This e-portfolio documents my ongoing coursework, webinars, academic symposiums, and developing teaching practicum materials as they are completed.',
  contactCtaTitle: 'Connect & Collaborate',
  contactCtaText:
    'Open to academic correspondence, educational initiatives, collaborative learning opportunities, and professional inquiries.',
};

export const AUTHENTIC_FALLBACK_EDUCATION = [
  {
    id: 'edu-air',
    institution: 'Air University',
    degree: 'Bachelor of English',
    fieldOfStudy: 'English Language & Literature',
    startYear: '2023',
    endYear: 'Present',
    isCurrent: true,
    location: 'Islamabad / Rawalpindi, Pakistan',
    description:
      'Undergraduate studies focused on English language, literature, critical thinking, academic writing, and communication.',
    sortOrder: 1,
  },
  {
    id: 'edu-fsc',
    institution: 'FBISE (Federal Board of Intermediate and Secondary Education)',
    degree: 'FSC (Medical)',
    fieldOfStudy: 'Pre-Medical Sciences',
    startYear: '2020',
    endYear: '2021',
    isCurrent: false,
    location: 'Pakistan',
    description: 'Higher Secondary School Certificate completed under FBISE.',
    sortOrder: 2,
  },
  {
    id: 'edu-matric',
    institution: 'FBISE (Federal Board of Intermediate and Secondary Education)',
    degree: 'Matric',
    fieldOfStudy: 'Secondary School Certificate',
    startYear: '2018',
    endYear: '2019',
    isCurrent: false,
    location: 'Pakistan',
    description: 'Secondary School Certificate completed under FBISE.',
    sortOrder: 3,
  },
];

export const AUTHENTIC_FALLBACK_SKILLS = [
  { id: 'skill-1', name: 'Management Skills', category: 'Professional', description: null, sortOrder: 1 },
  { id: 'skill-2', name: 'Time Management', category: 'Professional', description: null, sortOrder: 2 },
  { id: 'skill-3', name: 'Critical Thinking', category: 'Academic', description: null, sortOrder: 3 },
  { id: 'skill-4', name: 'Microsoft Word', category: 'Digital Tools', description: null, sortOrder: 4 },
  { id: 'skill-5', name: 'Microsoft Excel', category: 'Digital Tools', description: null, sortOrder: 5 },
  { id: 'skill-6', name: 'Strong Communication', category: 'Communication', description: null, sortOrder: 6 },
  { id: 'skill-7', name: 'Teamwork', category: 'Professional', description: null, sortOrder: 7 },
  { id: 'skill-8', name: 'Creative Writing', category: 'Academic', description: null, sortOrder: 8 },
  { id: 'skill-9', name: 'Presentation Skills', category: 'Communication', description: null, sortOrder: 9 },
];

export const AUTHENTIC_FALLBACK_TRAINING = [
  {
    id: 'tr-1',
    title: 'Digital Marketing Training',
    provider: 'DigiSkills.pk',
    duration: '6 Months',
    period: 'Six-Month Training Program',
    description:
      'Completed the 6-month Digital Marketing Training Program through DigiSkills.pk, developing a foundational understanding of digital communication, online brand strategy, and audience engagement.',
    highlights: [
      'Digital marketing strategies and techniques',
      'Social media marketing',
      'Search engine optimization (SEO)',
      'Content marketing',
      'Online brand promotion',
      'Digital advertising strategies',
      'Audience engagement and online marketing trends',
    ],
    sortOrder: 1,
  },
  {
    id: 'tr-2',
    title: 'Graphic Design Training',
    provider: 'DigiSkills.pk',
    duration: '6 Months',
    period: 'Six-Month Training Program',
    description:
      'Completed the 6-month Graphic Design Training Program through DigiSkills.pk, developing creative thinking, visual communication skills, and digital layout fluency.',
    highlights: [
      'Fundamental graphic design principles and techniques',
      'Colour combinations and visual harmony',
      'Typography',
      'Layouts and composition',
      'Digital graphics creation',
      'Promotional materials',
      'Visual communication and presentation',
    ],
    sortOrder: 2,
  },
];

export const AUTHENTIC_FALLBACK_BLOG_CATEGORIES = REFLECTION_CATEGORIES.map((c, idx) => ({
  id: `cat-${idx + 1}`,
  name: c.name,
  slug: c.slug,
  description: null,
  sortOrder: idx + 1,
}));
