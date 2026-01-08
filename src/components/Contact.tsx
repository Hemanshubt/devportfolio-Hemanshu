import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send via secure serverless function (handles both Telegram & Email)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="relative py-16 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/20 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Get in Touch</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Looking for opportunities to grow as a DevOps Engineer. Let's discuss how I can contribute to your team.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-secondary" />
                <span className="ml-4 text-xs text-muted-foreground">contact.sh</span>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                    <span className="text-secondary">$</span> name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4 sm:py-3"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                    <span className="text-secondary">$</span> email
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4 sm:py-3"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                    <span className="text-secondary">$</span> message
                  </label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4 sm:py-3"
                    placeholder="Tell me about the opportunity..."
                    required
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Message sent successfully!</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Failed to send. Please try again.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                  <Mail className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:hemanshumahajan55@gmail.com" className="text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base">
                    hemanshumahajan55@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 sm:h-12 sm:w-12">
                  <MapPin className="h-5 w-5 text-secondary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground sm:text-base">Shirpur, Maharashtra, India</p>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-2 sm:pt-4">
                <h3 className="mb-3 font-semibold text-foreground sm:mb-4">Connect</h3>
                <div className="flex gap-3 sm:gap-4">
                  <a
                    href="https://github.com/Hemanshubt"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary sm:h-12 sm:w-12"
                  >
                    <FaGithub className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hemanshu-mahajan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-500 sm:h-12 sm:w-12"
                  >
                    <FaLinkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                  {/* <a
                    href="https://t.me/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all duration-300 hover:border-sky-500/50 hover:bg-sky-500/5 hover:text-sky-500 sm:h-12 sm:w-12"
                  >
                    <FaTelegram className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
