import { motion } from 'framer-motion';

interface BlogPostSkeletonProps {
  index?: number;
  isInView?: boolean;
}

export default function BlogPostSkeleton({ index = 0, isInView = true }: BlogPostSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="border-gradient relative flex flex-col overflow-hidden"
      aria-label="Loading blog post"
      role="status"
    >
      {/* Enhanced shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      
      {/* Pulse animation overlay */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-muted/5 to-transparent" />
      
      {/* Cover Image skeleton */}
      <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-t-xl bg-muted sm:h-52 md:h-48">
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-muted to-muted/50" />
        {/* Badge skeleton */}
        <div className="absolute right-3 top-3 h-6 w-20 animate-pulse rounded-full bg-muted/80 sm:w-24" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Header skeleton */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="h-8 w-16 flex-shrink-0 animate-pulse rounded-lg bg-muted sm:w-20" />
        </div>

        {/* Title skeleton */}
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted" />
        
        {/* Description skeleton (2 lines) */}
        <div className="mb-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>

        {/* Publication date skeleton */}
        <div className="mb-3 h-3 w-32 animate-pulse rounded bg-muted" />

        {/* Highlights skeleton */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Tags skeleton */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-18 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-14 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Link skeleton */}
        <div className="mt-auto h-5 w-28 animate-pulse rounded bg-muted" />
      </div>
    </motion.div>
  );
}
