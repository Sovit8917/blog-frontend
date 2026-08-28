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
  meta: { nextCursor: string | null; hasMore: boolean; limit: number };
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

export interface JobSkillLink {
  skill: Skill;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  companyId: string;
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
  isFeatured: boolean;
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
  company: CompanySummary;
  postedBy: { id: string; username: string; name: string };
  skills: JobSkillLink[];
}

export type JobCard = Job;

export interface ListJobsParams {
  cursor?: string;
  limit?: number;
  search?: string;
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
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
    company: { name: string; slug: string; logoUrl?: string | null };
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
    company: { name: string; slug: string; logoUrl?: string | null };
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
