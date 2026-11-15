import { z } from 'zod';
import { PublicationStatus, MessageStatus } from '@prisma/client';
import { isValidSafeUrl } from '../sanitize';

const optionalSafeUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine((val) => !val || isValidSafeUrl(val), {
    message: 'URL must start with https://, http://, or /',
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters.')
      .max(128, 'New password is too long.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmPassword'],
  });

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(160),
  subject: z.string().trim().min(3, 'Please enter a subject.').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(4000),
  website: z.string().optional(), // honeypot
  startedAt: z.number().optional(), // timing anti-spam
});

export const homeContentSchema = z.object({
  heroHeadline: z.string().trim().min(2).max(160),
  heroTitle: z.string().trim().min(2).max(200),
  heroTagline: z.string().trim().min(2).max(240),
  heroIntro: z.string().trim().min(10).max(1500),
  aboutPreviewTitle: z.string().trim().min(2).max(160),
  aboutPreviewText: z.string().trim().min(10).max(1500),
  areasOfInterest: z.array(
    z.object({
      title: z.string().trim().min(2).max(120),
      description: z.string().trim().min(4).max(400),
    })
  ),
  academicActivitiesTitle: z.string().trim().min(2).max(160),
  academicActivitiesText: z.string().trim().min(10).max(1000),
  contactCtaTitle: z.string().trim().min(2).max(160),
  contactCtaText: z.string().trim().min(10).max(1000),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  tagline: z.string().trim().min(2).max(240),
  location: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  phone: z.string().trim().min(5).max(40),
  summary: z.string().trim().min(10).max(3000),
  bio: z.string().trim().min(10).max(5000),
  teachingPhilosophy: z.string().trim().min(10).max(4000),
  personalValues: z.array(z.string().trim().min(1)).default([]),
  futureGoals: z.array(z.string().trim().min(1)).default([]),
  professionalVision: z.string().trim().min(10).max(2500),
  languages: z.array(z.string().trim().min(1)).default([]),
  profileImageUrl: optionalSafeUrl,
  profileImageId: z.string().trim().optional().nullable(),
  cvDocumentUrl: optionalSafeUrl,
});

export const educationSchema = z.object({
  institution: z.string().trim().min(2).max(200),
  degree: z.string().trim().min(2).max(200),
  fieldOfStudy: z.string().trim().max(200).optional().nullable(),
  startYear: z.string().trim().min(2).max(20),
  endYear: z.string().trim().max(20).optional().nullable(),
  isCurrent: z.boolean().default(false),
  location: z.string().trim().max(160).optional().nullable(),
  description: z.string().trim().max(1500).optional().nullable(),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.PUBLISHED),
});

export const skillSchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300).optional().nullable(),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.PUBLISHED),
});

export const trainingSchema = z.object({
  title: z.string().trim().min(2).max(200),
  provider: z.string().trim().min(2).max(160),
  duration: z.string().trim().min(2).max(80),
  period: z.string().trim().max(100).optional().nullable(),
  description: z.string().trim().min(5).max(2000),
  highlights: z.array(z.string().trim().min(1)).default([]),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.PUBLISHED),
});

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(220),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().min(10).max(10000),
  category: z.string().trim().min(2).max(120),
  projectDate: z.string().optional().nullable(),
  thumbnailUrl: optionalSafeUrl,
  thumbnailId: z.string().trim().optional().nullable(),
  tools: z.array(z.string().trim().min(1)).default([]),
  learningOutcomes: z.array(z.string().trim().min(1)).default([]),
  externalUrl: optionalSafeUrl,
  documentUrl: optionalSafeUrl,
  documentName: z.string().trim().max(200).optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
  galleryUrls: z.array(z.string().trim().min(1)).default([]),
});

export const webinarSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  organizer: z.string().trim().min(2).max(200),
  speaker: z.string().trim().max(200).optional().nullable(),
  eventDate: z.string().optional().nullable(),
  duration: z.string().trim().max(80).optional().nullable(),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(8000),
  thumbnailUrl: optionalSafeUrl,
  thumbnailId: z.string().trim().optional().nullable(),
  topicsDiscussed: z.array(z.string().trim().min(1)).default([]),
  knowledgeGained: z.array(z.string().trim().min(1)).default([]),
  certificateUrl: optionalSafeUrl,
  certificateId: z.string().trim().optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
  whatText: z.string().trim().max(4000).optional().default(''),
  soWhatText: z.string().trim().max(4000).optional().default(''),
  nowWhatText: z.string().trim().max(4000).optional().default(''),
});

export const symposiumSchema = z.object({
  eventTitle: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  organizer: z.string().trim().min(2).max(200),
  eventDate: z.string().optional().nullable(),
  formatOrLocation: z.string().trim().min(2).max(200),
  presentationTitle: z.string().trim().min(2).max(220),
  presentationTopic: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(8000),
  participationRole: z.string().trim().min(2).max(160),
  slidesUrl: optionalSafeUrl,
  slidesName: z.string().trim().max(200).optional().nullable(),
  externalVideoUrl: optionalSafeUrl,
  feedback: z.string().trim().max(4000).optional().nullable(),
  learningOutcomes: z.array(z.string().trim().min(1)).default([]),
  personalReflection: z.string().trim().max(5000).optional().nullable(),
  certificateUrl: optionalSafeUrl,
  certificateId: z.string().trim().optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
  mediaUrls: z.array(z.string().trim().min(1)).default([]),
});

export const lessonPlanSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  subjectTopic: z.string().trim().min(2).max(200),
  targetLevel: z.string().trim().min(2).max(140),
  learningObjectives: z.array(z.string().trim().min(1)).default([]),
  duration: z.string().trim().min(2).max(80),
  methodology: z.string().trim().min(2).max(180),
  requiredResources: z.array(z.string().trim().min(1)).default([]),
  warmUpActivity: z.string().trim().min(5).max(4000),
  lessonDevelopment: z.string().trim().min(5).max(8000),
  studentActivities: z.string().trim().min(5).max(5000),
  assessment: z.string().trim().min(5).max(4000),
  homework: z.string().trim().max(3000).optional().nullable(),
  teacherReflection: z.string().trim().max(4000).optional().nullable(),
  documentUrl: optionalSafeUrl,
  documentName: z.string().trim().max(200).optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export const teachingDemoSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  topic: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(5000),
  videoUrl: optionalSafeUrl,
  externalVideoUrl: optionalSafeUrl,
  thumbnailUrl: optionalSafeUrl,
  thumbnailId: z.string().trim().optional().nullable(),
  galleryUrls: z.array(z.string().trim().min(1)).default([]),
  demonstrationDate: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export const teachingResourceSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(4000),
  targetLevel: z.string().trim().max(120).optional().nullable(),
  fileUrl: optionalSafeUrl,
  fileId: z.string().trim().optional().nullable(),
  fileType: z.string().trim().max(60).optional().nullable(),
  externalUrl: optionalSafeUrl,
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export const teachingReflectionSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  context: z.string().trim().min(2).max(200),
  whatText: z.string().trim().min(10).max(5000),
  soWhatText: z.string().trim().min(10).max(5000),
  nowWhatText: z.string().trim().min(10).max(5000),
  methodologyStudied: z.string().trim().max(180).optional().nullable(),
  reflectionDate: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  issuingOrg: z.string().trim().min(2).max(200),
  category: z.string().trim().min(2).max(120),
  issueDate: z.string().optional().nullable(),
  description: z.string().trim().min(5).max(4000),
  verificationUrl: optionalSafeUrl,
  certificateFileUrl: optionalSafeUrl,
  certificateFileType: z.string().trim().max(40).optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(240),
  featuredImageUrl: optionalSafeUrl,
  featuredImageId: z.string().trim().optional().nullable(),
  summary: z.string().trim().min(10).max(600),
  content: z.string().trim().min(20).max(50000),
  categoryId: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
  authorName: z.string().trim().min(2).max(120).default('Faryal'),
  publishedAt: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().trim().min(2).max(160),
  tagline: z.string().trim().min(2).max(240),
  metaDescription: z.string().trim().min(10).max(320),
  footerText: z.string().trim().min(2).max(300),
  contactEmail: z.string().trim().email(),
  contactPhone: z.string().trim().min(5).max(40),
  location: z.string().trim().min(2).max(160),
  linkedinUrl: optionalSafeUrl,
  githubUrl: optionalSafeUrl,
  twitterUrl: optionalSafeUrl,
  instagramUrl: optionalSafeUrl,
  showResumeDownload: z.boolean().default(true),
});

export const messageUpdateSchema = z.object({
  status: z.nativeEnum(MessageStatus),
  adminNotes: z.string().trim().max(2000).optional().nullable(),
});
