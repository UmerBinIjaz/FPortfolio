import { PrismaClient, AdminRole, PublicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting authentic database seed for Faryal Academic E-Portfolio...');

  // 1. Seed initial administrator securely from environment variables
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword && adminPassword.length >= 8) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash,
        name: 'Faryal',
        role: AdminRole.SUPER_ADMIN,
      },
      create: {
        email: adminEmail,
        passwordHash,
        name: 'Faryal',
        role: AdminRole.SUPER_ADMIN,
      },
    });
    console.log('Administrator account synchronized securely from environment variables.');
  } else {
    console.warn(
      'Skipping administrator account creation: set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) in .env before running db:seed.'
    );
  }

  // 2. Seed SiteSettings (single record)
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteTitle: 'Faryal | Academic & Professional E-Portfolio',
        tagline: 'Learning Through Language, Growing Through Creativity.',
        metaDescription:
          'Academic and professional e-portfolio of Faryal, Bachelor of English student at Air University and aspiring English Language Educator.',
        footerText: 'Faryal — Academic & Professional E-Portfolio. Rawalpindi, Pakistan.',
        contactEmail: 'faryalgull042@hotmail.com',
        contactPhone: '+92 331 5407441',
        location: 'Rawalpindi, Pakistan',
        showResumeDownload: true,
      },
    });
  }

  // 3. Seed Profile (single record with authentic CV & prompt info only)
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
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
        cvDocumentUrl: '/assets/aistudio/Faryal_CV_5771404d.pdf',
      },
    });
  }

  // 4. Seed HomeContent (single record)
  const existingHome = await prisma.homeContent.findFirst();
  if (!existingHome) {
    await prisma.homeContent.create({
      data: {
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
        ],
        academicActivitiesTitle: 'Continuing Academic Development',
        academicActivitiesText:
          'This e-portfolio documents my ongoing coursework, webinars, academic symposiums, and developing teaching practicum materials as they are completed.',
        contactCtaTitle: 'Connect & Collaborate',
        contactCtaText:
          'Open to academic correspondence, educational initiatives, collaborative learning opportunities, and professional inquiries.',
      },
    });
  }

  // 5. Seed Education (authentic records only)
  const educationCount = await prisma.education.count();
  if (educationCount === 0) {
    await prisma.education.createMany({
      data: [
        {
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
          status: PublicationStatus.PUBLISHED,
        },
        {
          institution: 'FBISE (Federal Board of Intermediate and Secondary Education)',
          degree: 'FSC (Medical)',
          fieldOfStudy: 'Pre-Medical Sciences',
          startYear: '2020',
          endYear: '2021',
          isCurrent: false,
          location: 'Pakistan',
          description: 'Higher Secondary School Certificate completed under FBISE.',
          sortOrder: 2,
          status: PublicationStatus.PUBLISHED,
        },
        {
          institution: 'FBISE (Federal Board of Intermediate and Secondary Education)',
          degree: 'Matric',
          fieldOfStudy: 'Secondary School Certificate',
          startYear: '2018',
          endYear: '2019',
          isCurrent: false,
          location: 'Pakistan',
          description: 'Secondary School Certificate completed under FBISE.',
          sortOrder: 3,
          status: PublicationStatus.PUBLISHED,
        },
      ],
    });
  }

  // 6. Seed Skills (exact 9 supplied skills)
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        { name: 'Management Skills', category: 'Professional', sortOrder: 1, status: PublicationStatus.PUBLISHED },
        { name: 'Time Management', category: 'Professional', sortOrder: 2, status: PublicationStatus.PUBLISHED },
        { name: 'Critical Thinking', category: 'Academic', sortOrder: 3, status: PublicationStatus.PUBLISHED },
        { name: 'Microsoft Word', category: 'Digital Tools', sortOrder: 4, status: PublicationStatus.PUBLISHED },
        { name: 'Microsoft Excel', category: 'Digital Tools', sortOrder: 5, status: PublicationStatus.PUBLISHED },
        { name: 'Strong Communication', category: 'Communication', sortOrder: 6, status: PublicationStatus.PUBLISHED },
        { name: 'Teamwork', category: 'Professional', sortOrder: 7, status: PublicationStatus.PUBLISHED },
        { name: 'Creative Writing', category: 'Academic', sortOrder: 8, status: PublicationStatus.PUBLISHED },
        { name: 'Presentation Skills', category: 'Communication', sortOrder: 9, status: PublicationStatus.PUBLISHED },
      ],
    });
  }

  // 7. Seed Professional Training (DigiSkills.pk authentic records)
  const trainingCount = await prisma.training.count();
  if (trainingCount === 0) {
    await prisma.training.createMany({
      data: [
        {
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
          status: PublicationStatus.PUBLISHED,
        },
        {
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
          status: PublicationStatus.PUBLISHED,
        },
      ],
    });
  }

  // 8. Seed Blog Categories (schema categories, zero fictional posts)
  const categoryCount = await prisma.blogCategory.count();
  if (categoryCount === 0) {
    await prisma.blogCategory.createMany({
      data: [
        { name: 'English Language & Literature', slug: 'english-language-literature', sortOrder: 1 },
        { name: 'English Language Teaching', slug: 'english-language-teaching', sortOrder: 2 },
        { name: 'Teaching Methodologies', slug: 'teaching-methodologies', sortOrder: 3 },
        { name: 'Educational Technology', slug: 'educational-technology', sortOrder: 4 },
        { name: 'Academic Development', slug: 'academic-development', sortOrder: 5 },
        { name: 'Personal Learning Reflections', slug: 'personal-learning-reflections', sortOrder: 6 },
      ],
    });
  }

  console.log('Seed completed cleanly without fictional records.');
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
