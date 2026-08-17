import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7275/books'; // Replace with your backend URL

  // READ (All products)
  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/GetAll`);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/GetBookById/${id}`);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/FilterSearch/${query}`);
  }
  
  searchExactBook(query: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/ExactNameSearch/${query}`);
  }

  // CREATE
  create(book: Book): Observable<string> {
    return this.http.post(`${this.apiUrl}/AddNewBook`, book, { responseType: 'text'});
  }

  // UPDATE
  update(id: number, book: Book): Observable<string> {
    return this.http.put(`${this.apiUrl}/UpdateBookTitle/${id}`, book, { responseType: 'text' });
  }

  // DELETE
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/DeleteBook/${id}`, { responseType: 'text' });
  }
}
