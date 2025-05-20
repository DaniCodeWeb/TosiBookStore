// src/types/Book.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: string;
  category: string;
  publisher?: string; // Added as optional since it's used in filters
}
