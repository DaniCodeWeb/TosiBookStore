// This is a mock API module that would be replaced with real database calls
// In a production app, you would connect to a database like MongoDB, PostgreSQL, etc.
interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: string;
  description: string;
  category: string;
}

// Mock categories data
const categories = [
  {
    slug: "literarios",
    name: "Libros Literarios",
    description: "Nuestra colección de literatura clásica y contemporánea",
  },
  {
    slug: "academicos",
    name: "Libros Académicos",
    description: "Textos educativos y de referencia para estudiantes y profesionales",
  },
  // Add more categories as needed
]

// Mock books data
const booksData = [
  {
    id: "spiderman",
    title: "Spiderman: No Way Home",
    author: "Marvel Comics",
    cover: "/src/assets/img/libros/llamame.webp",
    price: "180 bs",
    publisher: "Marvel",
    category: "literarios",
  },
  {
    id: "batman",
    title: "Batman: The Dark Knight Returns",
    author: "Frank Miller",
    cover: "/src/assets/img/libros/ojala.webp",
    price: "200 bs",
    publisher: "DC Comics",
    category: "literarios",
  },
  // Add more books...
]

// Get all categories
export async function getCategories() {
  // In a real app, this would be a database query
  return categories
}

// Get a specific category by slug
export async function getCategory(slug: string) {
  // In a real app, this would be a database query
  return categories.find((category) => category.slug === slug)
}

// Get all books
export async function getBooks() {
  // In a real app, this would be a database query
  return booksData
}

// Get books by category
export async function getBooksByCategory(categorySlug: string) {
  // In a real app, this would be a database query
  return booksData.filter((book) => book.category === categorySlug)
}

// Get a specific book by ID
export async function getBookById(id: string) {
  // In a real app, this would be a database query
  return booksData.find((book) => book.id === id)
}

// Search books
export async function searchBooks(query: string) {
  // In a real app, this would be a database query with full-text search
  const searchLower = query.toLowerCase()
  return booksData.filter(
    (book) =>
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.publisher.toLowerCase().includes(searchLower),
  )
}
