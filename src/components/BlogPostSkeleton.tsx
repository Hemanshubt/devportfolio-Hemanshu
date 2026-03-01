import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

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
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/10 to-transparent z-10" />

      {/* Cover Image skeleton */}
      <div className="relative h-48 w-full flex-shrink-0 overflow-hidden sm:h-52">
        <Skeleton className="h-full w-full rounded-none" />
        {/* Badge skeleton */}
        <div className="absolute right-3 top-3">
          <Skeleton className="h-6 w-20 rounded-full sm:w-24" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Meta info skeleton (date + tags count) */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
        </div>

        {/* Title skeleton */}
        <Skeleton className="mb-2 h-6 w-5/6 rounded" />
        <Skeleton className="mb-2 h-6 w-2/3 rounded" />

        {/* Description skeleton (3 lines) */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>

        {/* Tags skeleton */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>

        {/* Read More + Hashnode link skeleton */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>
    </motion.div>
  );
}
