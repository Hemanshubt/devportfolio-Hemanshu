import { motion } from 'framer-motion';
import { Share2, Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      
      <div className="flex flex-wrap gap-2">
        <motion.a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </motion.a>

        <motion.a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </motion.a>

        <motion.a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </motion.a>

        <motion.button
          onClick={handleCopyLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </motion.button>

        {navigator.share && (
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
