
import React, { useState, useEffect, useCallback } from 'react';
import type { NewsletterData, NewsletterSectionData, NewsletterItem, GroundingSource } from './types';
import { fetchNewsletterContent } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import SourceWordCloud from './components/SourceWordCloud';
import SubscriptionForm from './components/SubscriptionForm';
import RSSFeedManager from './components/RSSFeedManager';
import DiscordCommunity from './components/DiscordCommunity';
import { app, analytics } from './firebase';
import { generateRSSFeed, generateWeeklyDigest } from './services/rssService';
import { sendNewsletterToChannel } from './services/discordService';

// --- Reusable Icon Components ---
const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

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

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SourceIcon: React.FC<{ type: NewsletterItem['sourceType'] }> = ({ type }) => {
  const baseClass = "w-5 h-5 mr-2 inline-block";
  switch (type) {
    case 'YouTube': return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>;
    case 'X': return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.5 19.5h1.5l-8.25-10.875h-1.6l8.35 10.875z"/></svg>;
    case 'LinkedIn': return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
    case 'Journal': return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
    case 'Web': return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m9-9a9 9 0 00-9 9"></path></svg>;
    default: return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h4m-4 16v-7a1 1 0 011-1h4a1 1 0 011 1v7m-6 0v1h6v-1"></path></svg>;
  }
};

const GreyBrainLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 8C9 6.89543 9.89543 6 11 6H13C14.1046 6 15 6.89543 15 8V9.38197C15 9.77873 15.158 10.1587 15.4393 10.4393L16.2929 11.2929C17.2695 12.2695 17.2695 13.8569 16.2929 14.8235L14.8235 16.2929C13.8569 17.2695 12.2695 17.2695 11.2929 16.2929L9.70711 14.7071C8.73053 13.7305 8.73053 12.1431 9.70711 11.1765L10.5607 10.3235C10.8419 10.0423 11 9.66227 11 9.26551V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 9.38197V8C15 6.89543 14.1046 6 13 6H11C9.89543 6 9 6.89543 9 8V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 13.8519C3.41624 13.4357 3.92134 13.1118 4.47355 12.8999C6.55443 12.0837 8.87762 12.4497 10.6695 13.834C12.7849 15.4543 15.5457 15.6328 17.8427 14.3396C19.1212 13.6288 20.1471 12.6029 20.7561 11.395" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 3.5C11 3.5 12.5 2 15 2C18.5 2 21 4.5 21 8C21 11.5 19.5 14.5 16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 20.5C12.5 20.5 10.5 22 8 22C4.5 22 2 19.5 2 16C2 12.5 3.5 9.5 7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// --- Child Components ---
const NewsletterItemCard: React.FC<{ item: NewsletterItem, onBookmarkToggle: (item: NewsletterItem) => void, isBookmarked: boolean }> = ({ item, onBookmarkToggle, isBookmarked }) => {
    const [imgSrc, setImgSrc] = useState(item.imageUrl || '');
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgSrc(item.imageUrl || '');
        setImgError(false);
    }, [item.imageUrl]);

    const handleImageError = () => {
        setImgError(true);
    };

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onBookmarkToggle(item);
    }
    
    const hasImage = imgSrc && !imgError;

    return (
        <a 
          href={item.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group"
        >
             <div className="relative">
                {hasImage && (
                    <div className="relative h-40 w-full overflow-hidden">
                        <img 
                            src={imgSrc} 
                            alt={`${item.title} thumbnail`} 
                            onError={handleImageError} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}
                <button 
                    onClick={handleBookmarkClick} 
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                >
                    <BookmarkIcon className="w-5 h-5" isFilled={isBookmarked} />
                </button>
            </div>
            <div className={`p-5 flex flex-col flex-grow ${!hasImage ? 'pt-5' : ''}`}>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                    <SourceIcon type={item.sourceType} />
                    <span>{item.sourceType}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2 flex-grow">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.summary}</p>
                 <div className="mt-auto flex justify-end items-center text-cyan-400 text-sm font-semibold">
                    Read More
                    <LinkIcon className="w-4 h-4 ml-2" />
                </div>
            </div>
        </a>
    );
};

const BookmarksPanel: React.FC<{ isOpen: boolean, onClose: () => void, bookmarks: NewsletterItem[], onRemoveBookmark: (item: NewsletterItem) => void }> = ({ isOpen, onClose, bookmarks, onRemoveBookmark }) => {
    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            <div className={`relative z-10 w-full max-w-md h-full bg-gray-800 shadow-xl ml-auto flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Your Bookmarks ({bookmarks.length})</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {bookmarks.length > 0 ? (
                        <ul className="divide-y divide-gray-700">
                            {bookmarks.map(item => (
                                <li key={item.id} className="p-4 flex items-start gap-4">
                                    <div className="flex-grow">
                                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-200 hover:text-cyan-400 transition-colors">{item.title}</a>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <SourceIcon type={item.sourceType} /> {item.sourceType}
                                        </div>
                                    </div>
                                    <button onClick={() => onRemoveBookmark(item)} className="text-gray-500 hover:text-red-400 p-1" aria-label="Remove bookmark">
                                       <BookmarkIcon className="w-5 h-5" isFilled={true} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            <BookmarkIcon className="w-12 h-12 mx-auto mb-4" />
                            <p>No bookmarks yet.</p>
                            <p className="text-sm">Click the bookmark icon on any article to save it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};





const Footer: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => (
    <footer className="mt-12 py-8 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-200 text-center mb-2">Source Topic Cloud</h3>
            <p className="text-center text-gray-500 text-sm mb-6">A visual summary of keywords from the source materials used in this report.</p>
            <SourceWordCloud sources={sources} />

            <h3 className="text-xl font-semibold text-gray-300 text-center mt-12 mb-4">Full Source List</h3>
            <ul className="text-center space-y-2 max-w-2xl mx-auto">
                {sources.map((source, index) => (
                    <li key={index} className="truncate">
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200" title={source.title}>
                            {source.title || new URL(source.uri).hostname}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">
            GreyBrain AI | The Pulse of AI in Healthcare
        </p>
    </footer>
);


// --- Main App Component ---

const App: React.FC = () => {
  const [newsletterData, setNewsletterData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [bookmarks, setBookmarks] = useState<NewsletterItem[]>([]);
  const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);

  const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    try {
        const savedBookmarks = localStorage.getItem('greybrain_bookmarks');
        if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
        }
    } catch (e) { console.error("Could not load bookmarks", e); }
  }, []);

  useEffect(() => {
      try {
          localStorage.setItem('greybrain_bookmarks', JSON.stringify(bookmarks));
      } catch (e) { console.error("Could not save bookmarks", e); }
  }, [bookmarks]);

  const handleToggleBookmark = (item: NewsletterItem) => {
      setBookmarks(prev => {
          const exists = prev.some(b => b.id === item.id);
          if (exists) {
              return prev.filter(b => b.id !== item.id);
          } else {
              return [...prev, item];
          }
      });
  };
  
  const isBookmarked = (itemId: string) => bookmarks.some(b => b.id === itemId);

  const fetchData = useCallback(async () => {
    console.log("Fetching new data...");
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNewsletterContent();
      setNewsletterData(data);
      setLastUpdated(new Date());

      // Automatic posting to Discord
      await autoPostNewsletter(data);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setNewsletterData(null); // Clear old data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const autoPostNewsletter = async (data: NewsletterData) => {
    try {
      console.log("🤖 Auto-posting newsletter to social platforms...");

      // Post to Discord channel
      const discordBotToken = import.meta.env.VITE_DISCORD_BOT_TOKEN;
      const discordChannelId = import.meta.env.VITE_DISCORD_CHANNEL_GENERAL;

      if (discordBotToken && discordChannelId) {
        console.log("📤 Posting to Discord channel...");
        const discordSuccess = await sendNewsletterToChannel(data, discordBotToken, discordChannelId);
        if (discordSuccess) {
          console.log("✅ Successfully posted to Discord channel");
        } else {
          console.warn("⚠️ Failed to post to Discord channel");
        }
      } else {
        console.warn("⚠️ Discord credentials not configured");
      }

    } catch (error) {
      console.error("❌ Error in auto-posting:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchData, REFRESH_INTERVAL_MS]);
  
  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center text-center mb-10 flex-wrap gap-4">
          <div className="flex-1 min-w-0"></div>
          <div className="flex-grow flex flex-col items-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <GreyBrainLogo className="w-16 h-16 text-cyan-400"/>
              <h1 className="text-5xl font-extrabold text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">GreyBrain AI</span> Pulse
              </h1>
            </div>
            <p className="text-lg text-gray-400">The intelligent briefing on AI in medicine, curated by GreyBrain AI.</p>
            {lastUpdated && !loading && (
              <div className="text-sm text-gray-500 mt-4">
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-end min-w-[150px]">
            <button 
                onClick={() => setIsBookmarksPanelOpen(true)} 
                className="relative bg-gray-800/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
            >
                <BookmarkIcon className="w-5 h-5" />
                Bookmarks
                {bookmarks.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {bookmarks.length}
                    </span>
                )}
            </button>
          </div>
        </header>

        {loading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        
        {newsletterData && !loading && (
          <>
            {newsletterData.newsletter.map((section: NewsletterSectionData) => (
              <section key={section.categoryTitle} className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">{section.categoryTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.items.map((item) => (
                    <NewsletterItemCard 
                        key={item.id} 
                        item={item} 
                        isBookmarked={isBookmarked(item.id)}
                        onBookmarkToggle={handleToggleBookmark}
                    />
                  ))}
                </div>
              </section>
            ))}
            <SubscriptionForm className="subscription-form" />
            <DiscordCommunity newsletterData={newsletterData} />
            {newsletterData.groundingSources && newsletterData.groundingSources.length > 0 && (
                <Footer sources={newsletterData.groundingSources} />
            )}
          </>
        )}
      </main>
      <BookmarksPanel
          isOpen={isBookmarksPanelOpen}
          onClose={() => setIsBookmarksPanelOpen(false)}
          bookmarks={bookmarks}
          onRemoveBookmark={handleToggleBookmark}
      />
      <RSSFeedManager newsletterData={newsletterData} />
    </div>
  );
};

export default App;
