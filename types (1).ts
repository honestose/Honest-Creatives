export type ActiveTab = 
  | 'home' 
  | 'website-design' 
  | 'digital-design' 
  | 'digital-marketing' 
  | 'seo' 
  | 'event-planning' 
  | 'about' 
  | 'contact'
  | 'send-brief'
  | 'news'
  | 'cms';

export interface ServiceDetail {
  id: ActiveTab;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
  process: { step: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface Testimonial {
  name: string;
  company: string;
  role: string;
  quote: string;
  rating: number;
}
