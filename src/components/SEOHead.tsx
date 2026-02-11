import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export default function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const match = selector.match(/\[(.+?)="(.+?)"\]/);
        if (match) {
          const [, attr, value] = match;
          element.setAttribute(attr, value);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    updateMetaTag('meta[name="description"]', description);
    if (author) {
      updateMetaTag('meta[name="author"]', author);
    }
    if (tags && tags.length > 0) {
      updateMetaTag('meta[name="keywords"]', tags.join(', '));
    }

    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:type"]', type);
    if (url) {
      updateMetaTag('meta[property="og:url"]', url);
    }
    if (image) {
      updateMetaTag('meta[property="og:image"]', image);
    }

    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
      }
      if (author) {
        updateMetaTag('meta[property="article:author"]', author);
      }
      if (tags && tags.length > 0) {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        tags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    updateMetaTag('meta[name="twitter:card"]', image ? 'summary_large_image' : 'summary');
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    if (image) {
      updateMetaTag('meta[name="twitter:image"]', image);
    }

    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }
  }, [title, description, image, url, type, publishedTime, modifiedTime, author, tags]);

  return null;
}
