
export interface NewsletterItem {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceType: 'YouTube' | 'X' | 'LinkedIn' | 'Journal' | 'Web';
  imageUrl?: string;
}

export interface NewsletterSectionData {
  categoryTitle: string;
  items: NewsletterItem[];
}

export interface NewsletterData {
  newsletter: NewsletterSectionData[];
  groundingSources: GroundingSource[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}
