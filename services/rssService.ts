import type { NewsletterData, NewsletterItem } from '../types';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  category: string;
  source: string;
}

/**
 * Generate RSS XML feed from newsletter data
 */
export const generateRSSFeed = (newsletterData: NewsletterData, baseUrl: string = 'https://greybrain-ai-pulse.com'): string => {
  const now = new Date();
  const pubDate = now.toUTCString();
  
  // Flatten all newsletter items
  const allItems: (NewsletterItem & { category: string })[] = [];
  
  newsletterData.newsletter.forEach(section => {
    section.items.forEach(item => {
      allItems.push({
        ...item,
        category: section.categoryTitle
      });
    });
  });

  // Sort by most recent (assuming items are already in order)
  const rssItems: RSSItem[] = allItems.map((item, index) => ({
    title: item.title,
    description: item.summary,
    link: item.sourceUrl,
    pubDate: new Date(now.getTime() - (index * 60000)).toUTCString(), // Stagger times
    guid: item.id,
    category: item.category,
    source: item.sourceType
  }));

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>GreyBrain AI Pulse</title>
    <description>The intelligent briefing on AI in medicine, curated by GreyBrain AI</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <ttl>30</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>GreyBrain AI Pulse</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <managingEditor>contact@greybrain.ai (GreyBrain AI)</managingEditor>
    <webMaster>contact@greybrain.ai (GreyBrain AI)</webMaster>
    <category>Technology</category>
    <category>Healthcare</category>
    <category>Artificial Intelligence</category>
    <generator>GreyBrain AI Pulse Generator</generator>
    
${rssItems.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category><![CDATA[${item.category}]]></category>
      <source url="${item.link}">${item.source}</source>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return rssXml;
};

/**
 * Generate a weekly digest summary for email
 */
export const generateWeeklyDigest = (newsletterData: NewsletterData): {
  subject: string;
  htmlContent: string;
  textContent: string;
} => {
  const now = new Date();
  const weekStart = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  const subject = `GreyBrain AI Pulse - Weekly Digest (${weekStart.toLocaleDateString()} - ${now.toLocaleDateString()})`;
  
  // Get top items from each category (limit to 2 per category for email)
  const digestSections = newsletterData.newsletter.map(section => ({
    ...section,
    items: section.items.slice(0, 2) // Top 2 items per category
  }));

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0891b2, #0d9488); color: white; padding: 30px 20px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .tagline { font-size: 16px; opacity: 0.9; }
    .section { margin-bottom: 40px; }
    .section-title { color: #0891b2; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-left: 4px solid #0891b2; padding-left: 15px; }
    .article { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .article-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
    .article-title a { color: #1e293b; text-decoration: none; }
    .article-title a:hover { color: #0891b2; }
    .article-summary { color: #64748b; margin-bottom: 15px; }
    .article-meta { font-size: 14px; color: #94a3b8; }
    .cta { background: #0891b2; color: white; padding: 15px 30px; text-align: center; border-radius: 8px; margin: 30px 0; }
    .cta a { color: white; text-decoration: none; font-weight: bold; }
    .footer { text-align: center; color: #94a3b8; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">GreyBrain AI Pulse</div>
    <div class="tagline">Your Weekly AI Healthcare Intelligence Brief</div>
  </div>
  
  <p>Hello there! 👋</p>
  <p>Here's your curated weekly digest of the most important AI healthcare developments. We've analyzed hundreds of sources to bring you the insights that matter most.</p>
  
  ${digestSections.map(section => `
  <div class="section">
    <h2 class="section-title">${section.categoryTitle}</h2>
    ${section.items.map(item => `
    <div class="article">
      <h3 class="article-title"><a href="${item.sourceUrl}" target="_blank">${item.title}</a></h3>
      <p class="article-summary">${item.summary}</p>
      <div class="article-meta">Source: ${item.sourceType} | <a href="${item.sourceUrl}" target="_blank">Read Full Article →</a></div>
    </div>
    `).join('')}
  </div>
  `).join('')}
  
  <div class="cta">
    <a href="http://localhost:3700/" target="_blank">View Live Updates on GreyBrain AI Pulse →</a>
  </div>
  
  <div class="footer">
    <p>This digest was curated by GreyBrain AI from ${newsletterData.groundingSources?.length || 0} sources.</p>
    <p>Want to change your subscription preferences? <a href="#" style="color: #0891b2;">Manage Subscription</a></p>
    <p>© 2024 GreyBrain AI. All rights reserved.</p>
  </div>
</body>
</html>`;

  const textContent = `
GreyBrain AI Pulse - Weekly Digest

${digestSections.map(section => `
${section.categoryTitle.toUpperCase()}
${'='.repeat(section.categoryTitle.length)}

${section.items.map(item => `
• ${item.title}
  ${item.summary}
  Source: ${item.sourceType} | Read more: ${item.sourceUrl}
`).join('')}
`).join('')}

View live updates: http://localhost:3700/

This digest was curated by GreyBrain AI from ${newsletterData.groundingSources?.length || 0} sources.
`;

  return { subject, htmlContent, textContent };
};

export default {
  generateRSSFeed,
  generateWeeklyDigest,
};
