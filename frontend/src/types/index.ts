export interface BookRecommendation {
    title: string;
    author: string;
    match_reason: string;
    themes: string[];
    purchase_link?: string;
  }
  