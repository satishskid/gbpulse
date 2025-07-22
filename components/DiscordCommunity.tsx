import React, { useState } from 'react';
import type { NewsletterData, NewsletterItem } from '../types';
import { sendArticleForDiscussion, getDiscordInviteLink, sendNewsletterToChannel } from '../services/discordService';

interface DiscordCommunityProps {
  newsletterData?: NewsletterData | null;
  className?: string;
}

const DiscordCommunity: React.FC<DiscordCommunityProps> = ({ newsletterData, className = '' }) => {
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ item: NewsletterItem; category: string } | null>(null);
  const [isPostingToChannel, setIsPostingToChannel] = useState(false);
  const [postingStatus, setPostingStatus] = useState<string | null>(null);

  const handleJoinDiscord = () => {
    const inviteLink = getDiscordInviteLink();
    window.open(inviteLink, '_blank');
  };

  const handleDiscussArticle = async (item: NewsletterItem, category: string) => {
    setSelectedArticle({ item, category });

    // Send article to Discord for discussion
    const discussionPrompt = `What are your thoughts on this development? How might this impact clinical practice?`;
    await sendArticleForDiscussion(item, category, discussionPrompt);

    // Open Discord
    handleJoinDiscord();
  };

  const handlePostToChannel = async () => {
    if (!newsletterData) return;

    setIsPostingToChannel(true);
    setPostingStatus('Posting newsletter to Discord channel...');

    try {
      const botToken = import.meta.env.VITE_DISCORD_BOT_TOKEN;
      const channelId = import.meta.env.VITE_DISCORD_CHANNEL_GENERAL;

      if (!botToken || !channelId) {
        throw new Error('Discord bot token or channel ID not configured');
      }

      const success = await sendNewsletterToChannel(newsletterData, botToken, channelId);

      if (success) {
        setPostingStatus('✅ Newsletter posted successfully to the channel!');
        setTimeout(() => setPostingStatus(null), 5000);
      } else {
        setPostingStatus('❌ Failed to post newsletter to the channel');
        setTimeout(() => setPostingStatus(null), 5000);
      }
    } catch (error) {
      console.error('Error posting to channel:', error);
      setPostingStatus('❌ Error posting to channel');
      setTimeout(() => setPostingStatus(null), 5000);
    } finally {
      setIsPostingToChannel(false);
    }
  };

  if (!newsletterData) return null;

  return (
    <>
      {/* Community Section */}
      <section className={`my-12 ${className}`}>
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8 border border-purple-700/50">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <h2 className="text-3xl font-bold text-white">Join Our Professional Community</h2>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Connect with healthcare professionals, researchers, and AI enthusiasts. Discuss the latest developments, share insights, and collaborate on the future of AI in medicine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="text-purple-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Discussions</h3>
              <p className="text-gray-400 text-sm">
                Engage in live conversations about AI breakthroughs, clinical implementations, and research insights.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="text-purple-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Network</h3>
              <p className="text-gray-400 text-sm">
                Connect with physicians, researchers, data scientists, and AI specialists from around the world.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="text-purple-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Knowledge Sharing</h3>
              <p className="text-gray-400 text-sm">
                Share case studies, research findings, and practical AI implementation experiences.
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={handleJoinDiscord}
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg shadow-purple-600/20 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join Discord Community
            </button>

            <button
              onClick={handlePostToChannel}
              disabled={isPostingToChannel || !newsletterData}
              className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-600/20"
            >
              {isPostingToChannel ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Post to Discord Channel
                </>
              )}
            </button>

            {postingStatus && (
              <div className="mt-2 text-sm text-center">
                {postingStatus}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🔒 Professional community • 📋 Moderated discussions • 🏥 Healthcare-focused
            </p>
          </div>
        </div>
      </section>

      {/* Discussion Buttons on Articles */}
      <style jsx>{`
        .article-card:hover .discuss-button {
          opacity: 1;
          transform: translateY(0);
        }
        .discuss-button {
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

// Component to add "Discuss" button to newsletter items
export const ArticleDiscussButton: React.FC<{
  item: NewsletterItem;
  category: string;
  className?: string;
}> = ({ item, category, className = '' }) => {
  const handleDiscuss = async () => {
    const discussionPrompt = `What are your thoughts on this development? How might this impact clinical practice?`;
    await sendArticleForDiscussion(item, category, discussionPrompt);
    
    // Open Discord
    const inviteLink = getDiscordInviteLink();
    window.open(inviteLink, '_blank');
  };

  return (
    <button
      onClick={handleDiscuss}
      className={`discuss-button inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors ${className}`}
      title="Discuss this article in our community"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Discuss
    </button>
  );
};

export default DiscordCommunity;
