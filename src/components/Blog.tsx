import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHashnodePosts } from '@/hooks/useHashnodePosts';
import { formatPublishedDate } from '@/utils/dateFormatter';
import BlogPostSkeleton from '@/components/BlogPostSkeleton';

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Fetch blog posts from Hashnode
  const { posts: blogPosts, loading: blogLoading, hasNextPage, loadMore, loadingMore } = useHashnodePosts(postsPerPage);
  
  // Calculate pagination
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, endIndex);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      // Scroll to blog section
      document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (hasNextPage && !loadingMore) {
      // Load more posts from API
      loadMore();
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      // Scroll to blog section
      document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="blog" className="relative py-16 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Latest Articles</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            From My <span className="gradient-text">Blog</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Sharing insights, tutorials, and experiences from my journey in DevOps and cloud technologies.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="border-gradient group flex flex-col overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-muted sm:h-52">
                {post.coverImage ? (
                  <motion.img
                    src={post.coverImage}
                    alt={`Cover image for ${post.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <BookOpen className="h-16 w-16 text-muted-foreground/30 sm:h-20 sm:w-20" aria-hidden="true" />
                  </div>
                )}
                {/* Gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
                />
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                {/* Meta Information */}
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <time dateTime={post.publishedAt}>
                      {formatPublishedDate(post.publishedAt)}
                    </time>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{post.tags.length} {post.tags.length === 1 ? 'tag' : 'tags'}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
                      >
                        {tag}
                      </motion.span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Read More Link */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group/link flex items-center gap-2 font-medium text-primary transition-all duration-300"
                    aria-label={`Read article: ${post.title}`}
                  >
                    <span className="text-sm">Read More</span>
                    <motion.div
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </motion.div>
                  </Link>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`View on Hashnode: ${post.title}`}
                  >
                    View on Hashnode
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
          
          {/* Loading skeleton cards */}
          {(blogLoading || loadingMore) && (
            <>
              {[...Array(3)].map((_, i) => (
                <BlogPostSkeleton 
                  key={`skeleton-${i}`}
                  index={i}
                  isInView={isInView}
                />
              ))}
            </>
          )}

          {/* No posts message */}
          {!blogLoading && blogPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            >
              <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
              <p className="text-lg text-muted-foreground">No blog posts available at the moment.</p>
              <p className="mt-2 text-sm text-muted-foreground/70">Check back soon for new articles!</p>
            </motion.div>
          )}
        </div>

        {/* Pagination Controls */}
        {!blogLoading && blogPosts.length > postsPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages && !hasNextPage}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* View All Link */}
        {!blogLoading && blogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-center"
          >
            <a
              href="https://hashnode.com/@hemanshubtc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="View all blog posts on Hashnode"
            >
              <span>View All Articles on Hashnode</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
