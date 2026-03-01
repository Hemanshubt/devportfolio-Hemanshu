import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Clock, ExternalLink } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/types/blog';
import { hashnodeService } from '@/services/hashnodeService';
import { formatPublishedDate } from '@/utils/dateFormatter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import ShareButtons from '@/components/ShareButtons';
import BlogPostDetailSkeleton from '@/components/BlogPostDetailSkeleton';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setError('No blog post slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPost = await hashnodeService.fetchBlogPostBySlug('hemanshubtc.hashnode.dev', slug);

        if (!fetchedPost) {
          setError('Blog post not found');
        } else {
          setPost(fetchedPost);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <BlogPostDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[80vh] items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
            >
              <span className="text-4xl">📝</span>
            </motion.div>
            <h1 className="text-4xl font-bold text-foreground">Blog Post Not Found</h1>
            <p className="mt-4 text-muted-foreground">{error || 'The blog post you are looking for does not exist.'}</p>
            <motion.button
              onClick={() => navigate('/#blog')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentUrl = `${window.location.origin}/blog/${post.slug}`;

  const blogPostStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.coverImage,
    "author": {
      "@type": "Person",
      "name": "Hemanshu Mahajan",
      "url": window.location.origin
    },
    "publisher": {
      "@type": "Person",
      "name": "Hemanshu Mahajan",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/favicon.svg`
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt, // Using publishedAt as modified date for now
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "keywords": post.tags.join(', ')
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | Hemanshu Mahajan`}
        description={post.description}
        image={post.coverImage}
        url={currentUrl}
        type="article"
        publishedTime={post.publishedAt}
        author="Hemanshu Mahajan"
        tags={post.tags}
        structuredData={blogPostStructuredData}
      />
      <Navigation />

      <main>
        <article className="relative py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to="/#blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Cover Image */}
            {post.coverImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-8 overflow-hidden rounded-lg"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl"
            >
              {post.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {formatPublishedDate(post.publishedAt)}
                </time>
              </div>
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{post.tags.length} {post.tags.length === 1 ? 'tag' : 'tags'}</span>
                </div>
              )}
            </motion.div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {post.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-md border border-border bg-muted/30 px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 text-lg leading-relaxed text-muted-foreground"
            >
              {post.description}
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 rounded-lg border border-border bg-card/50 p-6"
            >
              <ShareButtons
                url={currentUrl}
                title={post.title}
                description={post.description}
              />
            </motion.div>

            {/* Read Full Article CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground">Continue Reading</h2>
              <p className="mt-2 text-muted-foreground">
                Read the full article on Hashnode for the complete content and discussion.
              </p>
              <motion.a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span>Read Full Article</span>
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            </motion.div>
          </div>
        </article>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
