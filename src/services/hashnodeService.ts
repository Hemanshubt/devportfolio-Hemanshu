/**
 * Hashnode API Service
 * 
 * Handles communication with the Hashnode GraphQL API to fetch blog posts.
 * Implements error handling and data transformation.
 */

import { BlogPost, HashnodeAPIResponse } from '../types/blog';
import { transformToBlogPost } from '../utils/transformBlogPost';

const HASHNODE_API_ENDPOINT = 'https://gql.hashnode.com';

/**
 * GraphQL query to fetch blog posts from Hashnode publication
 */
const GET_PUBLICATION_POSTS_QUERY = `
  query Publication($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            brief
            slug
            coverImage {
              url
              attribution
            }
            author {
              name
            }
            publishedAt
            updatedAt
            tags {
              name
              slug
            }
            url
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch a single blog post by slug
 */
const GET_POST_BY_SLUG_QUERY = `
  query Publication($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        title
        brief
        slug
        coverImage {
          url
          attribution
        }
        author {
          name
        }
        publishedAt
        updatedAt
        tags {
          name
          slug
        }
        url
      }
    }
  }
`;

/**
 * Fetches blog posts from Hashnode API with pagination support
 * @param host - Hashnode publication host (e.g., "hemanshubtc.hashnode.dev")
 * @param limit - Maximum number of posts to fetch (default: 6)
 * @param after - Cursor for pagination (optional)
 * @returns Object containing array of blog posts and pagination info
 */
export async function fetchBlogPosts(
  host: string, 
  limit: number = 6, 
  after?: string
): Promise<{ posts: BlogPost[]; hasNextPage: boolean; endCursor: string | null }> {
  try {
    const response = await fetch(HASHNODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PUBLICATION_POSTS_QUERY,
        variables: {
          host,
          first: limit,
          after: after || null,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: HashnodeAPIResponse = await response.json();

    // Validate response structure
    if (!result.data?.publication?.posts?.edges) {
      console.error('[HashnodeService] Invalid API response structure:', result);
      return { posts: [], hasNextPage: false, endCursor: null };
    }

    const posts = result.data.publication.posts.edges
      .map(edge => transformToBlogPost(edge.node));

    const pageInfo = result.data.publication.posts.pageInfo;

    return {
      posts,
      hasNextPage: pageInfo?.hasNextPage || false,
      endCursor: pageInfo?.endCursor || null,
    };
  } catch (error) {
    console.error('[HashnodeService] Error fetching blog posts:', error);
    return { posts: [], hasNextPage: false, endCursor: null };
  }
}

/**
 * Fetches a single blog post by slug
 * @param host - Hashnode publication host
 * @param slug - Blog post slug
 * @returns Single blog post or null if not found
 */
export async function fetchBlogPostBySlug(host: string, slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(HASHNODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_POST_BY_SLUG_QUERY,
        variables: {
          host,
          slug,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result.data?.publication?.post) {
      console.error('[HashnodeService] Post not found:', slug);
      return null;
    }

    return transformToBlogPost(result.data.publication.post);
  } catch (error) {
    console.error('[HashnodeService] Error fetching blog post:', error);
    return null;
  }
}

export const hashnodeService = {
  fetchBlogPosts,
  fetchBlogPostBySlug,
};
