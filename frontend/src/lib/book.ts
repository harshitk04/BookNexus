import Papa from 'papaparse';

export interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    description: string;
    rating: number;
    genres: string[];
  }
  

export async function getBookById(bookId: string): Promise<Book | undefined> {
  try {
    const response = await fetch('/books_cleaned.csv');
    const csvData = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const books: Book[] = result.data.map((row: any, index: number) => ({
            id: index + 1,
            title: row.title,
            author: row.author,
            cover: row.thumbnail,
            description: row.description || row.tagged_description || "No description available",
            rating: Math.floor(Math.random() * 3) + 3,
            genres: row.genres ? row.genres.split(',') : ['General']
          }));

          const foundBook = books.find(book => book.id === Number(bookId));
          resolve(foundBook);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching book data:', error);
    return undefined;
  }
}