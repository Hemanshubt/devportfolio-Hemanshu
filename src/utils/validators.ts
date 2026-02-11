/**
 * Data Validation Utilities
 * 
 * Provides validation and sanitization functions for blog post data
 * to ensure data integrity and prevent XSS attacks.
 */

import { BlogPost } from '../types/blog';

/**
 * Validates that a blog post has all required fields
 * @param post - The blog post to validate
 * @returns true if all required fields are present and valid, false otherwise
 */
export function validateBlogPost(post: Partial<BlogPost>): post is BlogPost {
  // Check required string fields
  if (!post.id || typeof post.id !== 'string' || post.id.trim() === '') {
    return false;
  }
  
  if (!post.title || typeof post.title !== 'string' || post.title.trim() === '') {
    return false;
  }
  
  if (!post.description || typeof post.description !== 'string') {
    return false;
  }
  
  if (!post.slug || typeof post.slug !== 'string' || post.slug.trim() === '') {
    return false;
  }
  
  if (!post.url || typeof post.url !== 'string' || post.url.trim() === '') {
    return false;
  }
  
  if (!post.publishedAt || typeof post.publishedAt !== 'string' || post.publishedAt.trim() === '') {
    return false;
  }
  
  // Check type discriminator
  if (post.type !== 'blog-post') {
    return false;
  }
  
  // Check tags array
  if (!Array.isArray(post.tags)) {
    return false;
  }
  
  // Check highlights array
  if (!Array.isArray(post.highlights)) {
    return false;
  }
  
  return true;
}

/**
 * Sanitizes text content to prevent XSS attacks
 * Removes potentially dangerous HTML tags and JavaScript
 * @param text - The text to sanitize
 * @returns Sanitized text safe for rendering
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remove script tags and their content
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove object and embed tags
  sanitized = sanitized.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');
  
  return sanitized;
}

/**
 * Filters an array of blog posts, removing invalid entries
 * @param posts - Array of blog posts to filter
 * @returns Array containing only valid blog posts
 */
export function filterValidBlogPosts(posts: Partial<BlogPost>[]): BlogPost[] {
  return posts.filter((post): post is BlogPost => {
    const isValid = validateBlogPost(post);
    
    if (!isValid) {
      console.warn('[Validators] Invalid blog post filtered out:', {
        id: post.id,
        title: post.title,
        slug: post.slug,
      });
    }
    
    return isValid;
  });
}

/**
 * Sanitizes all text fields in a blog post
 * @param post - The blog post to sanitize
 * @returns Blog post with sanitized text fields
 */
export function sanitizeBlogPost(post: BlogPost): BlogPost {
  return {
    ...post,
    title: sanitizeText(post.title),
    description: sanitizeText(post.description),
    tags: post.tags.map(tag => sanitizeText(tag)),
    highlights: post.highlights.map(highlight => sanitizeText(highlight)),
  };
}
