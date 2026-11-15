-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'PDF', 'DOCUMENT', 'PRESENTATION', 'VIDEO');

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "adminId" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "teachingPhilosophy" TEXT NOT NULL,
    "personalValues" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "futureGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "professionalVision" TEXT NOT NULL,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "profileImageUrl" TEXT,
    "profileImageId" TEXT,
    "cvDocumentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" UUID NOT NULL,
    "siteTitle" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "footerText" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "showResumeDownload" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeContent" (
    "id" UUID NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroTagline" TEXT NOT NULL,
    "heroIntro" TEXT NOT NULL,
    "aboutPreviewTitle" TEXT NOT NULL,
    "aboutPreviewText" TEXT NOT NULL,
    "areasOfInterest" JSONB NOT NULL DEFAULT '[]',
    "academicActivitiesTitle" TEXT NOT NULL,
    "academicActivitiesText" TEXT NOT NULL,
    "contactCtaTitle" TEXT NOT NULL,
    "contactCtaText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" UUID NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT,
    "startYear" TEXT NOT NULL,
    "endYear" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Core',
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "period" TEXT,
    "description" TEXT NOT NULL,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProject" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "projectDate" TIMESTAMP(3),
    "thumbnailUrl" TEXT,
    "thumbnailId" TEXT,
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalUrl" TEXT,
    "documentUrl" TEXT,
    "documentName" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMedia" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webinar" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "speaker" TEXT,
    "eventDate" TIMESTAMP(3),
    "duration" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "thumbnailId" TEXT,
    "topicsDiscussed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "knowledgeGained" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "certificateUrl" TEXT,
    "certificateId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webinar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebinarReflection" (
    "id" UUID NOT NULL,
    "webinarId" UUID NOT NULL,
    "whatText" TEXT NOT NULL,
    "soWhatText" TEXT NOT NULL,
    "nowWhatText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebinarReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symposium" (
    "id" UUID NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "formatOrLocation" TEXT NOT NULL,
    "presentationTitle" TEXT NOT NULL,
    "presentationTopic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "participationRole" TEXT NOT NULL,
    "slidesUrl" TEXT,
    "slidesName" TEXT,
    "externalVideoUrl" TEXT,
    "feedback" TEXT,
    "learningOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "personalReflection" TEXT,
    "certificateUrl" TEXT,
    "certificateId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Symposium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymposiumMedia" (
    "id" UUID NOT NULL,
    "symposiumId" UUID NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "title" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymposiumMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingLessonPlan" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subjectTopic" TEXT NOT NULL,
    "targetLevel" TEXT NOT NULL,
    "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duration" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,
    "requiredResources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "warmUpActivity" TEXT NOT NULL,
    "lessonDevelopment" TEXT NOT NULL,
    "studentActivities" TEXT NOT NULL,
    "assessment" TEXT NOT NULL,
    "homework" TEXT,
    "teacherReflection" TEXT,
    "documentUrl" TEXT,
    "documentName" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeachingLessonPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingDemonstration" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT,
    "externalVideoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailId" TEXT,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "demonstrationDate" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeachingDemonstration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingResource" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetLevel" TEXT,
    "fileUrl" TEXT,
    "fileId" TEXT,
    "fileType" TEXT,
    "externalUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeachingResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingReflection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "whatText" TEXT NOT NULL,
    "soWhatText" TEXT NOT NULL,
    "nowWhatText" TEXT NOT NULL,
    "methodologyStudied" TEXT,
    "reflectionDate" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeachingReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "issuingOrg" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "verificationUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "issuingOrg" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "fileUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "fileType" TEXT NOT NULL DEFAULT 'IMAGE',
    "verificationUrl" TEXT,
    "category" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "achievementId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "featuredImageUrl" TEXT,
    "featuredImageId" TEXT,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" UUID,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorName" TEXT NOT NULL DEFAULT 'Faryal',
    "readingTimeMinutes" INTEGER NOT NULL DEFAULT 3,
    "publishedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
    "ipHash" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "format" TEXT,
    "bytes" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "folder" TEXT NOT NULL DEFAULT 'faryal-portfolio',
    "category" TEXT NOT NULL DEFAULT 'General',
    "uploadedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentActivity" (
    "id" UUID NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityTitle" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "summary" TEXT,
    "adminId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_adminId_idx" ON "Session"("adminId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Education_status_sortOrder_idx" ON "Education"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Skill_status_sortOrder_idx" ON "Skill"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Training_status_sortOrder_idx" ON "Training"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");

-- CreateIndex
CREATE INDEX "PortfolioProject_status_featured_sortOrder_idx" ON "PortfolioProject"("status", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioProject_category_idx" ON "PortfolioProject"("category");

-- CreateIndex
CREATE INDEX "PortfolioProject_deletedAt_idx" ON "PortfolioProject"("deletedAt");

-- CreateIndex
CREATE INDEX "ProjectMedia_projectId_sortOrder_idx" ON "ProjectMedia"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Webinar_slug_key" ON "Webinar"("slug");

-- CreateIndex
CREATE INDEX "Webinar_status_featured_sortOrder_idx" ON "Webinar"("status", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "Webinar_category_idx" ON "Webinar"("category");

-- CreateIndex
CREATE INDEX "Webinar_deletedAt_idx" ON "Webinar"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebinarReflection_webinarId_key" ON "WebinarReflection"("webinarId");

-- CreateIndex
CREATE UNIQUE INDEX "Symposium_slug_key" ON "Symposium"("slug");

-- CreateIndex
CREATE INDEX "Symposium_status_featured_sortOrder_idx" ON "Symposium"("status", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "Symposium_deletedAt_idx" ON "Symposium"("deletedAt");

-- CreateIndex
CREATE INDEX "SymposiumMedia_symposiumId_sortOrder_idx" ON "SymposiumMedia"("symposiumId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingLessonPlan_slug_key" ON "TeachingLessonPlan"("slug");

-- CreateIndex
CREATE INDEX "TeachingLessonPlan_status_featured_sortOrder_idx" ON "TeachingLessonPlan"("status", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "TeachingLessonPlan_deletedAt_idx" ON "TeachingLessonPlan"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingDemonstration_slug_key" ON "TeachingDemonstration"("slug");

-- CreateIndex
CREATE INDEX "TeachingDemonstration_status_featured_sortOrder_idx" ON "TeachingDemonstration"("status", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "TeachingDemonstration_deletedAt_idx" ON "TeachingDemonstration"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingResource_slug_key" ON "TeachingResource"("slug");

-- CreateIndex
CREATE INDEX "TeachingResource_status_category_sortOrder_idx" ON "TeachingResource"("status", "category", "sortOrder");

-- CreateIndex
CREATE INDEX "TeachingResource_deletedAt_idx" ON "TeachingResource"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingReflection_slug_key" ON "TeachingReflection"("slug");

-- CreateIndex
CREATE INDEX "TeachingReflection_status_sortOrder_idx" ON "TeachingReflection"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "TeachingReflection_deletedAt_idx" ON "TeachingReflection"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");

-- CreateIndex
CREATE INDEX "Achievement_status_category_featured_sortOrder_idx" ON "Achievement"("status", "category", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "Achievement_deletedAt_idx" ON "Achievement"("deletedAt");

-- CreateIndex
CREATE INDEX "Certificate_status_category_sortOrder_idx" ON "Certificate"("status", "category", "sortOrder");

-- CreateIndex
CREATE INDEX "Certificate_achievementId_idx" ON "Certificate"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_featured_publishedAt_idx" ON "BlogPost"("status", "featured", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_categoryId_idx" ON "BlogPost"("categoryId");

-- CreateIndex
CREATE INDEX "BlogPost_deletedAt_idx" ON "BlogPost"("deletedAt");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");

-- CreateIndex
CREATE INDEX "MediaAsset_mediaType_category_idx" ON "MediaAsset"("mediaType", "category");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

-- CreateIndex
CREATE INDEX "ContentActivity_createdAt_idx" ON "ContentActivity"("createdAt");

-- CreateIndex
CREATE INDEX "ContentActivity_entityType_idx" ON "ContentActivity"("entityType");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMedia" ADD CONSTRAINT "ProjectMedia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarReflection" ADD CONSTRAINT "WebinarReflection_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymposiumMedia" ADD CONSTRAINT "SymposiumMedia_symposiumId_fkey" FOREIGN KEY ("symposiumId") REFERENCES "Symposium"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentActivity" ADD CONSTRAINT "ContentActivity_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

