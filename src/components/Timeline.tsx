import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, GraduationCap } from 'lucide-react';

const experiences = [
  // {
  //   type: 'certification',
  //   title: 'AWS Knowledge: Cloud Essentials',
  //   company: 'Amazon Web Services',
  //   period: 'Certified',
  //   description: 'Foundational understanding of AWS Cloud concepts, services, and terminology.',
  // },
  // {
  //   type: 'certification',
  //   title: 'Kubernetes for the Absolute Beginners',
  //   company: 'Hands-on Tutorial',
  //   period: 'Certified',
  //   description: 'Comprehensive hands-on training in Kubernetes container orchestration.',
  // },
  {
    type: 'education',
    title: 'Integrated Master in Computer Application',
    company: 'R. C. Patel Institute of Management Research and Development',
    period: 'Aug 2020 - June 2025',
    description: 'CGPA: 8.7.',
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
          <span className="section-heading">Journey</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text">Education</span>
          </h2>
        </motion.div>

        <div className="relative mt-10 sm:mt-16">
          {/* Timeline line */}
          <div className="absolute left-2 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500 via-cyan-400 to-green-500 md:left-1/2 md:-translate-x-[1px]" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative mb-10 sm:mb-14 ${
                i % 2 === 0 
                  ? 'ml-8 sm:ml-10 md:ml-0 md:mr-auto md:w-[calc(50%-30px)] md:pr-0 md:text-right' 
                  : 'ml-8 sm:ml-10 md:ml-auto md:w-[calc(50%-30px)] md:pl-0'
              }`}
            >
              {/* Timeline dot - Mobile */}
              <div 
                className="absolute -left-8 top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-500 bg-background sm:-left-10 sm:h-5 sm:w-5 md:hidden"
              >
                <div className="h-2 w-2 rounded-full bg-cyan-500 sm:h-2.5 sm:w-2.5" />
              </div>

              {/* Timeline dot - Desktop */}
              <div 
                className={`absolute top-5 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-cyan-500 bg-background md:flex ${
                  i % 2 === 0 ? '-right-[42px]' : '-left-[42px]'
                }`}
              >
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              </div>

              {/* Content */}
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-card/80">
                <div className="p-4 sm:p-6">
                  <div className={`mb-2 flex items-center gap-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                    {exp.type === 'certification' ? (
                      <Award className="h-3.5 w-3.5 text-cyan-500 sm:h-4 sm:w-4" />
                    ) : (
                      <GraduationCap className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
                    )}
                    <span className="font-mono text-xs text-muted-foreground sm:text-sm">{exp.period}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-foreground sm:text-lg">{exp.title}</h3>
                  <p className={`text-sm font-medium sm:text-base ${exp.type === 'certification' ? 'text-cyan-500' : 'text-green-500'}`}>
                    {exp.company}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
