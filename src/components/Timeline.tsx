import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Award, GraduationCap } from 'lucide-react';

const experiences = [
  {
    type: 'education',
    title: 'Integrated Master in Computer Application',
    company: 'R. C. Patel Institute of Management Research and Development, Shirpur',
    period: 'Aug 2020 - June 2025',
    description: 'CGPA: 8.7',
  },
  {
    type: 'education',
    title: 'Higher Secondary Certificate (XII)',
    company: 'R.C. Patel Arts Commerce & Science College, Shirpur',
    period: '2018 - 2020',
    description: 'PCT: 74.47%',
  },
  {
    type: 'education',
    title: 'Secondary School Certificate (X)',
    company: 'R.C. Patel Main Building Secondary School, Shirpur',
    period: '2008 - 2018',
    description: 'PCT: 82.00%',
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start end', 'end start'],
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%']);

  return (
    <section id="education" className="relative py-16 md:py-32">
      <div className="bg-grid-small pointer-events-none absolute inset-0 opacity-10" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.span 
            className="section-heading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Journey
          </motion.span>
          <motion.h2 
            className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="gradient-text">Education</span>
          </motion.h2>
          <motion.p 
            className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Academic milestones that shaped my foundation in computer science and DevOps.
          </motion.p>
        </motion.div>

        <div ref={timelineRef} className="relative mt-10 sm:mt-16">
          {/* Timeline line - Background */}
          <div className="absolute left-2 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500/20 via-cyan-400/20 to-green-500/20 md:left-1/2 md:-translate-x-[1px]" />
          
          {/* Timeline line - Animated */}
          <motion.div 
            className="absolute left-2 top-0 w-0.5 origin-top bg-gradient-to-b from-cyan-500 via-cyan-400 to-green-500 md:left-1/2 md:-translate-x-[1px]"
            style={{ height: lineHeight }}
          />

          {experiences.map((exp, i) => {
            const itemRef = useRef(null);
            const itemInView = useInView(itemRef, { once: true, margin: '-50px' });
            
            return (
              <motion.div
                key={i}
                ref={itemRef}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, y: 30 }}
                animate={itemInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: i * 0.2,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                className={`relative mb-10 sm:mb-14 ${i % 2 === 0
                    ? 'ml-8 sm:ml-10 md:ml-0 md:mr-auto md:w-[calc(50%-30px)] md:pr-0 md:text-right'
                    : 'ml-8 sm:ml-10 md:ml-auto md:w-[calc(50%-30px)] md:pl-0'
                  }`}
              >
                {/* Timeline dot - Mobile */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={itemInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                  className="absolute -left-8 top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-500 bg-background sm:-left-10 sm:h-5 sm:w-5 md:hidden"
                >
                  <motion.div 
                    className="h-2 w-2 rounded-full bg-cyan-500 sm:h-2.5 sm:w-2.5"
                    initial={{ scale: 0 }}
                    animate={itemInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: i * 0.2 + 0.5 }}
                  />
                </motion.div>

                {/* Timeline dot - Desktop */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={itemInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                  className={`absolute top-5 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-cyan-500 bg-background md:flex ${i % 2 === 0 ? '-right-[42px]' : '-left-[42px]'
                    }`}
                >
                  <motion.div 
                    className="h-2.5 w-2.5 rounded-full bg-cyan-500"
                    initial={{ scale: 0 }}
                    animate={itemInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: i * 0.2 + 0.5 }}
                  />
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-card/80 hover:shadow-lg hover:shadow-cyan-500/10"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 sm:p-6">
                    <motion.div 
                      className={`mb-2 flex items-center gap-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={itemInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.4 }}
                    >
                      {exp.type === 'certification' ? (
                        <Award className="h-3.5 w-3.5 text-cyan-500 sm:h-4 sm:w-4" />
                      ) : (
                        <GraduationCap className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
                      )}
                      <span className="font-mono text-xs text-muted-foreground sm:text-sm">{exp.period}</span>
                    </motion.div>

                    <motion.h3 
                      className="text-base font-bold text-foreground sm:text-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={itemInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.5 }}
                    >
                      {exp.title}
                    </motion.h3>
                    <motion.p 
                      className={`text-sm font-medium sm:text-base ${exp.type === 'certification' ? 'text-cyan-500' : 'text-green-500'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={itemInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.6 }}
                    >
                      {exp.company}
                    </motion.p>
                    <motion.p 
                      className="mt-2 text-xs text-muted-foreground sm:text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={itemInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.7 }}
                    >
                      {exp.description}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
