
export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Tag {
  label: string;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  tags: Tag[];
  readingTime: string;
  author: Author;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  articleIds: string[];
  date: string;
}

export interface NavLink {
  label: string;
  path: string;
}
