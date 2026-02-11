import { LucideIcon } from 'lucide-react';

/**
 * Represents a blog post from Hashnode
 */
export interface BlogPost {
  id: string;
  type: 'blog-post';
  slug: string;
  title: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  color: 'primary' | 'secondary';
  highlights: string[];
  github: string;
  url: string;
  coverImage?: string;
  publishedAt: string;
}

/**
 * Represents a traditional project
 */
export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  color: 'primary' | 'secondary';
  highlights: string[];
  github: string;
  readme: ProjectReadme;
}

/**
 * Project README content structure
 */
export interface ProjectReadme {
  overview: string;
  features: string[];
  architecture: string[];
  techStack: string[];
}

/**
 * Union type for unified display of projects and blog posts
 */
export type ProjectItem = Project | BlogPost;

/**
 * Type guard to distinguish blog posts from projects
 * @param item - The project item to check
 * @returns true if the item is a blog post, false otherwise
 */
export function isBlogPost(item: ProjectItem): item is BlogPost {
  return 'type' in item && item.type === 'blog-post';
}

/**
 * Hashnode API response structure (new publication-based API)
 */
export interface HashnodeAPIResponse {
  data: {
    publication: {
      posts: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            brief: string;
            slug: string;
            coverImage?: {
              url: string;
              attribution?: string;
            };
            author: {
              name: string;
            };
            publishedAt: string;
            updatedAt: string;
            tags: Array<{
              name: string;
              slug: string;
            }>;
            url: string;
          };
        }>;
      };
    };
  };
}

/**
 * Cached data structure with timestamp and TTL
 */
export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
