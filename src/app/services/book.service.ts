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
    return this.http.get<Book[]>(this.apiUrl);
  }

  // CREATE
  create(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/AddBookToList`, book);
  }

  // UPDATE
  update(id: number, book: Book): Observable<string> {
    return this.http.put(`${this.apiUrl}/UpdateBookTitle/${id}`, book, {responseType: 'text'});
  }

  // DELETE
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/DeleteBookFromList/${id}`, {responseType: 'text'});
  }
}
