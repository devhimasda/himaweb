export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  published: boolean;
  views: number;
  authorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    name: string;
    image: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
