import React, { useEffect, useState } from 'react';
import type { NewsletterData } from '../types';
import { generateRSSFeed, generateWeeklyDigest } from '../services/rssService';
import { subscribeToNewsletter } from '../services/brevoService';
import { sendTestDigest } from '../services/weeklyDigestService';
import { sendNewsletterToTelegram } from '../services/telegramService';

interface RSSFeedManagerProps {
  newsletterData: NewsletterData | null;
}

const RSSFeedManager: React.FC<RSSFeedManagerProps> = ({ newsletterData }) => {
  const [rssUrl, setRssUrl] = useState<string>('');
  const [showRSSModal, setShowRSSModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);

  useEffect(() => {
    if (newsletterData) {
      // Generate RSS feed and create blob URL
      const rssXml = generateRSSFeed(newsletterData);
      const blob = new Blob([rssXml], { type: 'application/rss+xml' });
      const url = URL.createObjectURL(blob);
      setRssUrl(url);

      // Cleanup previous URL
      return () => {
        if (rssUrl) {
          URL.revokeObjectURL(rssUrl);
        }
      };
    }
  }, [newsletterData]);

  const copyRSSUrl = () => {
    const fullRssUrl = `${window.location.origin}/rss.xml`;
    navigator.clipboard.writeText(fullRssUrl);
    alert('RSS URL copied to clipboard!');
  };

  const downloadRSSFeed = () => {
    if (rssUrl) {
      const link = document.createElement('a');
      link.href = rssUrl;
      link.download = 'greybrain-ai-pulse.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openTelegramBot = () => {
    window.open('https://t.me/GreyBrainAIPulseBot', '_blank');
  };

  const openWhatsAppChannel = () => {
    window.open('https://chat.whatsapp.com/your-channel-link', '_blank');
  };

  const openDiscord = () => {
    window.open('https://discord.gg/greybrain-ai-pulse', '_blank');
  };

  if (!newsletterData) return null;

  return (
    <>
      {/* RSS & Channels Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowChannelModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title="Subscribe to Updates"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z" />
          </svg>
        </button>
      </div>

      {/* Channel Selection Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Subscribe to Updates</h3>
              <button
                onClick={() => setShowChannelModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <button
                onClick={() => {
                  setShowChannelModal(false);
                  document.querySelector('.subscription-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold">Email Newsletter</div>
                  <div className="text-gray-400 text-sm">Weekly digest in your inbox</div>
                </div>
              </button>

              {/* RSS */}
              <button
                onClick={() => {
                  setShowChannelModal(false);
                  setShowRSSModal(true);
                }}
                className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-orange-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold">RSS Feed</div>
                  <div className="text-gray-400 text-sm">Use any RSS reader app</div>
                </div>
              </button>

              {/* Telegram */}
              <button
                onClick={openTelegramBot}
                className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold">Telegram Bot</div>
                  <div className="text-gray-400 text-sm">Real-time updates</div>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                onClick={openWhatsAppChannel}
                className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold">WhatsApp Channel</div>
                  <div className="text-gray-400 text-sm">Daily updates</div>
                </div>
              </button>

              {/* Discord Community */}
              <button
                onClick={openDiscord}
                className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold">Discord Community</div>
                  <div className="text-gray-400 text-sm">Professional discussions</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RSS Modal */}
      {showRSSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">RSS Feed</h3>
              <button
                onClick={() => setShowRSSModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Subscribe to our RSS feed to get updates in your favorite RSS reader app.
              </p>

              <div className="bg-gray-700 p-3 rounded-lg">
                <code className="text-cyan-400 text-sm break-all">
                  {window.location.origin}/rss.xml
                </code>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyRSSUrl}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Copy URL
                </button>
                <button
                  onClick={downloadRSSFeed}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Download
                </button>
              </div>

              <p className="text-gray-400 text-sm">
                Popular RSS readers: Feedly, Inoreader, NewsBlur, Apple News
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RSSFeedManager;
