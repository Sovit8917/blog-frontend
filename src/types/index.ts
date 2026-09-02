// Mirrors the Nest/Prisma backend contracts (blog-backend phase 2).
// Keep field names identical to the API response so no mapping layer is needed.

export type PostStatus = 'DRAFT' | 'IN_REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
export type AdPlacement = 'HEADER' | 'SIDEBAR' | 'IN_CONTENT' | 'FOOTER' | 'BETWEEN_POSTS' | 'POPUP';
export type SponsorTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'PARTNER';
export type CommentStatus = 'PENDING' | 'APPROVED' | 'SPAM' | 'REJECTED';

export interface AuthorSummary {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

/** GET /users/search — public author search result (search page "People" section). */
export interface AuthorSearchResult extends AuthorSummary {
  _count: { posts: number; followers: number };
}

/** Computed on the fly from published-post engagement — see UsersService.getAuthorReputation. */
export interface AuthorReputation {
  score: number;
  tier: 'Newcomer' | 'Rising' | 'Established' | 'Expert' | 'Elite';
  label: string;
  publishedPostCount: number;
  totalViews: number;
  totalLikes: number;
  nextTier: { tier: string; scoreNeeded: number } | null;
}

/** GET /users/:username — public profile, incl. follow counts. */
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role: string;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  reputation: AuthorReputation;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface SponsoredContent {
  id: string;
  disclosure: string;
  sponsor: {
    id: string;
    name: string;
    logoUrl?: string | null;
    website?: string | null;
    tier: SponsorTier;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string; // markdown
  coverImageUrl?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  isFeatured: boolean;
  isSponsored: boolean;
  readingTimeMins: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author: AuthorSummary;
  category?: Category | null;
  tags: Tag[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  noIndex: boolean;
  sponsoredContent?: SponsoredContent | null;
  createdAt: string;
  updatedAt: string;
  /**
   * Editorially-curated "Article -> Job" picks (P1) — an editor hand-picking
   * specific open roles to feature on this article, distinct from the
   * auto-matched jobs from GET /jobs/related-to-post/:id. Empty unless the
   * author/editor explicitly linked jobs on this post.
   */
  linkedJobs?: JobCard[];
}

export type PostCard = Pick<
  Post,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'coverImageUrl'
  | 'publishedAt'
  | 'isFeatured'
  | 'isSponsored'
  | 'readingTimeMins'
  | 'viewCount'
  | 'likeCount'
  | 'commentCount'
  | 'author'
  | 'category'
  | 'tags'
>;

export interface CursorPage<T> {
  items: T[];
  meta: { nextCursor: string | null; hasMore: boolean; limit: number; total?: number };
}

export interface OffsetPage<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListPostsParams {
  cursor?: string;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'featured' | 'latest' | 'trending';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  status: CommentStatus;
  createdAt: string;
  user: AuthorSummary;
  replies?: Comment[];
}

export interface Advertisement {
  id: string;
  title: string;
  placement: AdPlacement;
  imageUrl: string;
  targetUrl: string;
  advertiser?: string | null;
}

export interface AffiliateLink {
  id: string;
  title: string;
  slug: string; // resolved via GET /go/:slug (redirect + click tracking)
  program?: string | null;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  tier: SponsorTier;
}

export interface NewsletterSponsorSlot {
  id: string;
  headline: string;
  body: string;
  url: string;
  issueDate: string;
  sponsor: { id: string; name: string; logoUrl?: string | null };
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type EmployerRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface EmployerRequest {
  id: string;
  userId: string;
  companyName: string;
  message?: string | null;
  status: EmployerRequestStatus;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: UserProfile;
  reviewedBy?: { id: string; name: string; username: string } | null;
}

// =========================================================
// JOBS / COMPANIES / SKILLS (Phase 1 frontend)
// =========================================================

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type RemoteType = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type ExperienceLevel =
  | 'INTERNSHIP'
  | 'ENTRY_LEVEL'
  | 'MID_LEVEL'
  | 'SENIOR_LEVEL'
  | 'LEAD'
  | 'EXECUTIVE';
export type JobStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'EXPIRED';
export type ApplicationStatus =
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'HIRED'
  | 'WITHDRAWN';

export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  isVerified: boolean;
}

export interface Company extends CompanySummary {
  website?: string | null;
  description?: string | null;
  location?: string | null;
  createdById: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  noIndex: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { jobs: number };
  jobs?: JobCard[];
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: { jobs: number };
}

export type ResourceType = 'TOOL' | 'LIBRARY' | 'TUTORIAL' | 'COURSE' | 'DOCUMENTATION' | 'COMMUNITY' | 'OTHER';

/** GET /developer-resources — curated tools/tutorials/docs, editorially ordered. */
export interface DeveloperResource {
  id: string;
  title: string;
  slug: string;
  url: string;
  description?: string | null;
  resourceType: ResourceType;
  tags: string[];
  iconUrl?: string | null;
  isFeatured: boolean;
  clickCount: number;
  /** Editorially-curated "Resource -> Job" picks (P1) — see Post.linkedJobs. */
  linkedJobs?: JobCard[];
}

export interface ListDeveloperResourcesParams {
  page?: number;
  limit?: number;
  search?: string;
  resourceType?: ResourceType;
  tag?: string;
  isFeatured?: boolean;
}

// ---- Learning paths (P2) — curated, ordered sequences of DeveloperResource steps ----
export interface LearningPathStep {
  id: string;
  order: number;
  note?: string | null;
  resource: DeveloperResource;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  steps: LearningPathStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ListLearningPathsParams {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
}

// ---- Candidate ATS / resume analysis (P2) ----
export interface ResumeAnalysisResult {
  resumeScore: number;
  extractedSkillSlugs: string[];
  suggestions: string[];
  updatedAt: string;
}

export interface ResumeJobMatch {
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  resumeScore: number;
  jobMatchScore: number;
  matchingSkills: { name: string; slug: string }[];
  missingSkills: { name: string; slug: string }[];
  suggestions: string[];
}

export interface ResumeRecommendedJob {
  id: string;
  slug: string;
  title: string;
  company: { id: string; name: string; slug: string; logoUrl?: string | null; isVerified: boolean } | null;
  location?: string | null;
  remoteType: string;
  matchScore: number;
  matchingSkillCount: number;
  requiredSkillCount: number;
}

/** GET /search — one call across every pillar of the ecosystem. */
export interface UnifiedSearchResult {
  query: string;
  posts: PostCard[];
  jobs: JobCard[];
  companies: Company[];
  skills: Skill[];
  developerResources: DeveloperResource[];
  authors: AuthorSearchResult[];
}

export interface JobSkillLink {
  skill: Skill;
}

export type JobVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'FLAGGED';

export interface Job {
  id: string;
  title: string;
  slug: string;
  companyId?: string | null;
  companyName?: string | null;
  companyLogoUrl?: string | null;
  // Structured "job board" fields for the jobcode.in-style Job Details
  // table. role/category/externalJobId are common ones with their own
  // columns; additionalDetails holds any other label/value rows the
  // poster added (Database Skills, Version Control, Primary Skill...).
  role?: string | null;
  category?: string | null;
  externalJobId?: string | null;
  additionalDetails?: { label: string; value: string }[];
  // Gallery of extra images the poster/admin attached (office/team photos,
  // banners). images[0] doubles as the default share/OG image server-side
  // when ogImageUrl isn't explicitly set.
  images?: string[];
  tags?: string[];
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  location?: string | null;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel?: ExperienceLevel | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  applyUrl?: string | null;
  allowInternalApply: boolean;
  status: JobStatus;
  postedById: string;
  viewCount: number;
  applicationCount: number;
  externalApplyCount?: number;
  isFeatured: boolean;
  verificationStatus?: JobVerificationStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  noIndex: boolean;
  publishedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Present when the job links to a real Company record. When absent, fall
  // back to companyName/companyLogoUrl (see lib/jobs/format.ts#getJobCompany).
  company?: CompanySummary | null;
  postedBy: { id: string; username: string; name: string };
  skills: JobSkillLink[];
  // Only present on GET /jobs/recommended results (P1 "Skill-based
  // matching") — 0-100 fit score against the current user's preferences.
  matchScore?: number;
}

export type JobCard = Job;

export interface ListJobsParams {
  page?: number;
  cursor?: string;
  limit?: number;
  search?: string;
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  // Multi-select experience filter — "Freshers" quick chip and any custom
  // combination of INTERNSHIP/ENTRY_LEVEL/etc checkboxes both go through
  // this (see JobFilters).
  experienceLevels?: ExperienceLevel[];
  freshersOnly?: boolean;
  verifiedOnly?: boolean;
  skill?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedAfter?: string;
  postedBefore?: string;
  sort?: 'relevance' | 'newest' | 'salary';
}

export interface ListCompaniesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl?: string | null;
  coverLetter?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
    slug: string;
    status: JobStatus;
    companyName?: string | null;
    companyLogoUrl?: string | null;
    company?: { name: string; slug: string; logoUrl?: string | null } | null;
  };
}

export interface SavedJob {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    location?: string | null;
    remoteType: RemoteType;
    employmentType: EmploymentType;
    status: JobStatus;
    companyName?: string | null;
    companyLogoUrl?: string | null;
    company?: { name: string; slug: string; logoUrl?: string | null } | null;
  };
}

// ---- Job alerts (#19) ----

export type AlertFrequency = 'INSTANT' | 'DAILY' | 'WEEKLY';

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  keywords?: string | null;
  location?: string | null;
  remoteType?: RemoteType | null;
  employmentType?: EmploymentType | null;
  experienceLevel?: ExperienceLevel | null;
  skillSlugs: string[];
  frequency: AlertFrequency;
  isActive: boolean;
  lastRunAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobAlertInput {
  name: string;
  keywords?: string;
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  skillSlugs?: string[];
  frequency?: AlertFrequency;
  isActive?: boolean;
}

// ---- Saved resume (#17) ----

export interface ResumeInfo {
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  resumeUpdatedAt?: string | null;
}

// ---- Personalized jobs (#20) ----

export interface RecommendedJobs {
  items: JobCard[];
  personalized: boolean;
}

// ---- Candidate profile/preferences (P1) ----
// Soft matching signal only — powers RecommendedJobs' matchScore above and
// pre-fills the job board filters. Nothing here gates applying to a job.

export interface CandidatePreferences {
  preferredLocation?: string | null;
  preferredRemoteType?: RemoteType | null;
  preferredEmploymentType?: EmploymentType | null;
  preferredExperienceLevel?: ExperienceLevel | null;
  expectedSalaryMin?: number | null;
  expectedSalaryMax?: number | null;
  preferredSkillSlugs: string[];
}

export interface UpdateCandidatePreferencesInput {
  preferredLocation?: string;
  preferredRemoteType?: RemoteType;
  preferredEmploymentType?: EmploymentType;
  preferredExperienceLevel?: ExperienceLevel;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  preferredSkillSlugs?: string[];
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// ---- Growth features: reading history, collections, topic follows, feed ----

export interface ReadingHistoryEntry {
  id: string;
  progressPct: number;
  readAt: string;
  post: PostCard;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { items: number };
}

export interface CollectionDetail extends Collection {
  items: Array<{ id: string; addedAt: string; post: PostCard }>;
}

export interface CollectionMembership {
  id: string;
  name: string;
  slug: string;
  contains: boolean;
}

export interface TopicFollowEntry {
  id: string;
  createdAt: string;
  category: Category;
}

export type MostReadPost = PostCard & { weeklyViews?: number };

