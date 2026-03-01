import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostDetailSkeleton() {
    return (
        <article className="relative py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                {/* Back button skeleton */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Skeleton className="h-5 w-28 rounded" />
                </motion.div>

                {/* Cover Image skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-8 overflow-hidden rounded-lg"
                >
                    <Skeleton className="h-64 w-full rounded-lg sm:h-80 md:h-96" />
                </motion.div>

                {/* Title skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-8 space-y-3"
                >
                    <Skeleton className="h-10 w-full rounded sm:h-12" />
                    <Skeleton className="h-10 w-3/4 rounded sm:h-12" />
                </motion.div>

                {/* Meta info skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-6 flex flex-wrap items-center gap-4"
                >
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded" />
                    </div>
                </motion.div>

                {/* Tags skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6 flex flex-wrap gap-2"
                >
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-7 w-20 rounded-md" />
                    ))}
                </motion.div>

                {/* Description skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8 space-y-3"
                >
                    <Skeleton className="h-5 w-full rounded" />
                    <Skeleton className="h-5 w-full rounded" />
                    <Skeleton className="h-5 w-5/6 rounded" />
                    <Skeleton className="h-5 w-3/4 rounded" />
                </motion.div>

                {/* Share buttons skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8 rounded-lg border border-border bg-card/50 p-6"
                >
                    <Skeleton className="mb-4 h-5 w-32 rounded" />
                    <div className="flex gap-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
                        ))}
                    </div>
                </motion.div>

                {/* CTA skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-8 text-center"
                >
                    <Skeleton className="mx-auto h-8 w-48 rounded" />
                    <Skeleton className="mx-auto mt-3 h-5 w-80 rounded" />
                    <Skeleton className="mx-auto mt-6 h-12 w-44 rounded-lg" />
                </motion.div>
            </div>
        </article>
    );
}
