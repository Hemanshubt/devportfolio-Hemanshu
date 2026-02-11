/**
 * Blog Post Transformation Utility
 * 
 * Transforms Hashnode API response data into BlogPost objects.
 * Handles field mapping, tag limiting, and missing data gracefully.
 */

import { BlogPost, HashnodeAPIResponse } from '../types/blog';
import { BookOpen } from 'lucide-react';

type HashnodePostNode = HashnodeAPIResponse['data']['user']['publication']['posts']['edges'][0]['node'];

const MAX_TAGS_DISPLAY = 4;
const MAX_HIGHLIGHTS = 3;

/**
 * Transforms a Hashnode API post node to a BlogPost object
 * @param node - The Hashnode API post node
 * @returns Transformed BlogPost object
 */
export function transformToBlogPost(node: HashnodePostNode): BlogPost {
  // Extract and limit tags to array of strings
  const allTags = node.tags.map(tag => tag.name);
  const limitedTags = allTags.slice(0, MAX_TAGS_DISPLAY);

  // Generate highlights from tags (first 3 tags)
  const highlights = allTags.slice(0, MAX_HIGHLIGHTS);

  return {
    id: node.id,
    type: 'blog-post',
    slug: node.slug,
    title: node.title,
    description: node.brief,
    tags: limitedTags,
    icon: BookOpen,
    color: 'primary' as const,
    highlights,
    github: '#', // Blog posts don't have GitHub repos
    url: node.url,
    coverImage: node.coverImage?.url, // Handle missing cover images
    publishedAt: node.publishedAt,
  };
}

/**
 * Transforms multiple Hashnode API post nodes to BlogPost objects
 * @param nodes - Array of Hashnode API post nodes
 * @returns Array of transformed BlogPost objects
 */
export function transformBlogPosts(nodes: HashnodePostNode[]): BlogPost[] {
  return nodes.map(node => transformToBlogPost(node));
}
