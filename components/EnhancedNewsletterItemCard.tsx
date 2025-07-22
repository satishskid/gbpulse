// Enhanced Newsletter Item with URL validation and optimization
import React, { useState, useEffect, useCallback } from 'react';
import { URLValidationService } from '../services/urlValidationService';
import type { NewsletterItem } from '../types';

interface EnhancedNewsletterItemProps {
  item: NewsletterItem;
  onBookmarkToggle: (item: NewsletterItem) => void;
  isBookmarked: boolean;
}

const EnhancedNewsletterItemCard: React.FC<EnhancedNewsletterItemProps> = ({ 
  item, 
  onBookmarkToggle, 
  isBookmarked 
}) => {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || '');
  const [imgError, setImgError] = useState(false);
  const [urlStatus, setUrlStatus] = useState<'checking' | 'valid' | 'invalid' | 'unknown'>('unknown');
  const [validatedUrl, setValidatedUrl] = useState(item.sourceUrl);

  // Validate URL on component mount
  useEffect(() => {
    const validateUrl = async () => {
      setUrlStatus('checking');
      try {
        const result = await URLValidationService.validateURL(item.sourceUrl);
        if (result.isValid) {
          setUrlStatus('valid');
          setValidatedUrl(result.redirectUrl || item.sourceUrl);
        } else {
          setUrlStatus('invalid');
          // Try to fix the URL
          const fixedUrl = URLValidationService.fixURL(item.sourceUrl);
          if (fixedUrl !== item.sourceUrl) {
            const retryResult = await URLValidationService.validateURL(fixedUrl);
            if (retryResult.isValid) {
              setUrlStatus('valid');
              setValidatedUrl(fixedUrl);
            }
          }
        }
      } catch (error) {
        console.warn('URL validation failed:', error);
        setUrlStatus('unknown');
      }
    };

    validateUrl();
  }, [item.sourceUrl]);

  // Optimize image URL
  useEffect(() => {
    if (item.imageUrl) {
      // Use image optimization service
      const optimizedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(item.imageUrl)}&w=400&h=240&q=85&output=webp&t=fit`;
      setImgSrc(optimizedUrl);
    }
    setImgError(false);
  }, [item.imageUrl]);

  const handleImageError = useCallback(() => {
    if (!imgError && item.imageUrl) {
      // Fallback to original URL
      setImgSrc(item.imageUrl);
      setImgError(true);
    } else {
      setImgError(true);
    }
  }, [imgError, item.imageUrl]);

  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle(item);
  }, [item, onBookmarkToggle]);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (urlStatus === 'invalid') {
      e.preventDefault();
      alert('This link appears to be broken. We\'re working on fixing it.');
    }
  }, [urlStatus]);
    
  const hasImage = imgSrc && !imgError;

  return (
    <a 
      href={validatedUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={handleLinkClick}
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group ${
        urlStatus === 'invalid' ? 'opacity-75 cursor-not-allowed' : ''
      }`}
      title={urlStatus === 'invalid' ? 'This link may be broken' : item.title}
    >
      <div className="relative">
        {hasImage && (
          <div className="relative h-40 w-full overflow-hidden">
            <img 
              src={imgSrc} 
              alt={`${item.title} thumbnail`} 
              onError={handleImageError}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        {/* Bookmark button */}
        <button 
          onClick={handleBookmarkClick} 
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
        >
          <BookmarkIcon className="w-5 h-5" isFilled={isBookmarked} />
        </button>

        {/* URL status indicator */}
        {urlStatus === 'checking' && (
          <div className="absolute top-2 left-2 z-10 p-1 bg-yellow-500/80 rounded text-xs text-white">
            Checking...
          </div>
        )}
        {urlStatus === 'invalid' && (
          <div className="absolute top-2 left-2 z-10 p-1 bg-red-500/80 rounded text-xs text-white">
            Link Issue
          </div>
        )}
        {urlStatus === 'valid' && validatedUrl !== item.sourceUrl && (
          <div className="absolute top-2 left-2 z-10 p-1 bg-green-500/80 rounded text-xs text-white">
            Updated
          </div>
        )}
      </div>
      
      <div className={`p-5 flex flex-col flex-grow ${!hasImage ? 'pt-5' : ''}`}>
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <SourceIcon type={item.sourceType} />
          <span>{item.sourceType}</span>
          {urlStatus === 'checking' && <span className="ml-2 text-xs">🔄</span>}
          {urlStatus === 'valid' && <span className="ml-2 text-xs text-green-400">✓</span>}
          {urlStatus === 'invalid' && <span className="ml-2 text-xs text-red-400">⚠️</span>}
        </div>
        
        <h3 className="text-lg font-bold text-gray-100 mb-2 flex-grow">{item.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{item.summary}</p>
        
        <div className="mt-auto flex justify-end items-center text-cyan-400 text-sm font-semibold">
          {urlStatus === 'invalid' ? 'Link Issue' : 'Read More'}
          <LinkIcon className="w-4 h-4 ml-2" />
        </div>
      </div>
    </a>
  );
};

// Icons (reuse existing ones)
const BookmarkIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => {
  if (isFilled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
};

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const SourceIcon: React.FC<{ type: NewsletterItem['sourceType'] }> = ({ type }) => {
  const baseClass = "w-5 h-5 mr-2 inline-block";
  switch (type) {
    case 'YouTube': return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>;
    case 'X': return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.5 19.5h1.5l-8.25-10.875h-1.6l8.35 10.875z"/></svg>;
    case 'LinkedIn': return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
    case 'Journal': return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
    case 'Web': return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9 9"></path></svg>;
    default: return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h4m-4 16v-7a1 1 0 011-1h4a1 1 0 011 1v7m-6 0v1h6v-1"></path></svg>;
  }
};

export default EnhancedNewsletterItemCard;
