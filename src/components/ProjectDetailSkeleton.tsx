import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailSkeleton() {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[hsl(217,33%,14%)]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary opacity-[0.06] blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back button skeleton */}
                    <div className="pt-8">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Skeleton className="h-5 w-36 rounded" />
                        </motion.div>
                    </div>

                    {/* Hero content */}
                    <div className="py-16 text-center md:py-24">
                        {/* Meta info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4 flex flex-wrap items-center justify-center gap-4"
                        >
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-4 w-36 rounded" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-6 flex flex-col items-center gap-3"
                        >
                            <Skeleton className="h-10 w-3/4 rounded sm:h-14 lg:h-16" />
                            <Skeleton className="h-10 w-1/2 rounded sm:h-14 lg:h-16" />
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-2"
                        >
                            <Skeleton className="h-5 w-full rounded" />
                            <Skeleton className="h-5 w-5/6 rounded" />
                            <Skeleton className="h-5 w-2/3 rounded" />
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            <Skeleton className="h-12 w-40 rounded-lg" />
                            <Skeleton className="h-12 w-36 rounded-lg" />
                        </motion.div>

                        {/* Project image */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mx-auto mt-12 max-w-4xl"
                        >
                            <Skeleton className="h-64 w-full rounded-xl sm:h-80 lg:h-96" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Highlights & Features Section */}
            <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Highlights */}
                <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-5"
                        >
                            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                            <Skeleton className="h-4 w-full rounded" />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Overview skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-24 rounded" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-5/6 rounded" />
                            <Skeleton className="h-4 w-4/6 rounded" />
                        </div>
                    </motion.div>

                    {/* Key Features skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-28 rounded" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                                    <Skeleton className="h-4 w-full rounded" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Architecture & Tech Stack Section */}
            <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Architecture skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-28 rounded" />
                        </div>
                        <div className="overflow-hidden rounded-xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)]">
                            <div className="flex items-center gap-2 border-b border-[hsl(217,33%,12%)] px-4 py-2.5">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="ml-3 h-3 w-20 rounded" />
                            </div>
                            <div className="space-y-2 p-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <Skeleton className="h-4 w-3 rounded" />
                                        <Skeleton className="h-4 w-full rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tech Stack skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-24 rounded" />
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-20 rounded-lg" style={{ width: `${60 + Math.random() * 40}px` }} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section skeleton */}
            <section className="border-t border-[hsl(217,33%,14%)] bg-[hsl(222,47%,5%)] py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Skeleton className="mx-auto h-8 w-72 rounded" />
                        <Skeleton className="mx-auto mt-4 h-5 w-96 max-w-full rounded" />
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Skeleton className="h-12 w-36 rounded-lg" />
                            <Skeleton className="h-12 w-44 rounded-lg" />
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
