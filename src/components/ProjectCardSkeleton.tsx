import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectCardSkeletonProps {
  index?: number;
  isInView?: boolean;
}

export default function ProjectCardSkeleton({ index = 0, isInView = true }: ProjectCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="border-gradient relative flex flex-col overflow-hidden"
      aria-label="Loading project"
      role="status"
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/10 to-transparent z-10" />

      {/* Cover Image skeleton */}
      <div className="relative h-48 w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Header: icon + github badge */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="mb-2 h-5 w-3/4 rounded" />

        {/* Description skeleton (2 lines) */}
        <div className="mb-3 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* Highlights skeleton */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Tags skeleton */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>

        {/* View Details link skeleton */}
        <div className="mt-auto">
          <Skeleton className="h-5 w-28 rounded" />
        </div>
      </div>
    </motion.div>
  );
}
