export const SITE_COLORS = {
  primaryBerry: '#BE185D',
  accentSaffron: '#F59E0B',
  deepPlum: '#4C0519',
  paper: '#FFFBF7',
  softRose: '#FCE7F3',
  text: '#271C22',
  mutedText: '#6E5A64',
} as const

export const PUBLIC_NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/webinars', label: 'Webinars' },
  { href: '/teaching-practicum', label: 'Practicum' },
  { href: '/reflections', label: 'Reflections' },
] as const;



export const ALL_PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  {
    href: '#',
    label: 'Academic Activities',
    children: [
      { href: '/webinars', label: 'Webinars' },
      { href: '/symposium', label: 'Symposium' },
      { href: '/teaching-practicum', label: 'Teaching Practicum' },
    ],
  },
  { href: '/resume', label: 'Resume / CV' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/reflections', label: 'Reflections' },
] as const;



export const PORTFOLIO_CATEGORIES = [
  'Academic Assignments',
  'Creative Writing',
  'English Language & Literature',
  'Graphic Design',
  'Digital Marketing',
  'Educational Resources',
  'Teaching Materials',
] as const;

export const WEBINAR_CATEGORIES = [
  'English Language Teaching',
  'English Language & Literature',
  'Teaching Methodologies',
  'Educational Technology',
  'Digital Learning',
  'Communication & Professional Development',
] as const;

export const TEACHING_MATERIAL_CATEGORIES = [
  'Worksheets',
  'Grammar Exercises',
  'Reading Activities',
  'Writing Exercises',
  'Vocabulary Activities',
  'Presentation Slides',
  'Classroom Handouts',
  'Assessment Materials',
  'Digital Learning Resources',
] as const;

export const ACHIEVEMENT_CATEGORIES = [
  'Academic Achievements',
  'Professional Training Certificates',
  'Awards & Recognitions',
  'Participation Certificates',
] as const;

export const REFLECTION_CATEGORIES = [
  { name: 'English Language & Literature', slug: 'english-language-literature' },
  { name: 'English Language Teaching', slug: 'english-language-teaching' },
  { name: 'Teaching Methodologies', slug: 'teaching-methodologies' },
  { name: 'Educational Technology', slug: 'educational-technology' },
  { name: 'Academic Development', slug: 'academic-development' },
  { name: 'Personal Learning Reflections', slug: 'personal-learning-reflections' },
] as const;

export const TEACHING_METHODOLOGIES = [
  {
    name: 'Communicative Language Teaching (CLT)',
    status: 'Studied Approach' as const,
    summary:
      'Focuses on authentic interaction and meaningful communication as both the means and ultimate goal of learning English.',
  },
  {
    name: 'Task-Based Language Teaching (TBLT)',
    status: 'Studied Approach' as const,
    summary:
      'Structures lessons around purposeful, real-world tasks where learners use target language to solve problems and collaborate.',
  },
  {
    name: 'Student-Centred Learning',
    status: 'Studied Approach' as const,
    summary:
      'Shifts classroom focus from passive instruction to active learner inquiry, autonomy, and reflective participation.',
  },
  {
    name: 'Collaborative Learning',
    status: 'Studied Approach' as const,
    summary:
      'Uses structured pair and group dialogue to build confidence, peer feedback habits, and shared comprehension.',
  },
  {
    name: 'Interactive Teaching',
    status: 'Studied Approach' as const,
    summary:
      'Encourages responsive questioning, open discussion, and dynamic checks for understanding throughout each lesson.',
  },
  {
    name: 'Technology-Enhanced Learning',
    status: 'Studied Approach' as const,
    summary:
      'Integrates curated multimedia, digital worksheets, and online reading resources to support diverse learning styles.',
  },
  {
    name: 'Gamification',
    status: 'Studied Approach' as const,
    summary:
      'Incorporates structured challenges, vocabulary games, and milestone feedback to sustain learner motivation.',
  },
  {
    name: 'Flipped Classroom',
    status: 'Studied Approach' as const,
    summary:
      'Introduces foundational concepts prior to class so live sessions can focus on speaking practice and guided application.',
  },
] as const;

export const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/home', label: 'Home Content' },
  { href: '/admin/about', label: 'About & Profile' },
  { href: '/admin/portfolio', label: 'Portfolio' },
  { href: '/admin/webinars', label: 'Webinars' },
  { href: '/admin/symposium', label: 'Symposium' },
  { href: '/admin/teaching-practicum', label: 'Teaching Practicum' },
  { href: '/admin/resume', label: 'Resume / CV' },
  { href: '/admin/achievements', label: 'Achievements' },
  { href: '/admin/reflections', label: 'Reflections' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/media', label: 'Media Library' },
  { href: '/admin/settings', label: 'Settings' },
] as const;
