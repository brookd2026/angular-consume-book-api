import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  imports: [],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  // Inject the client and create a reactive signal for the data
  private http = inject(HttpClient);
  private bookService = inject(BookService);
  public books = signal<any[]>([]);
  rootUrl = 'https://localhost:7275/books';
  isEditing = signal(false);
  isDeleting = signal(false);
  isAdding = signal(false);
  bookToEdit = signal<any>(null);
  bookToDelete = signal<any>(null);
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  ngOnInit() {
    this.fetchbooks();
  }

  fetchbooks() {
    this.bookService.getAll().subscribe({
      next: (data) => this.books.set(data), // Save data to signal
      error: (err) => console.error('API Error:', err),
    });
  }

  triggerRefresh() {
    this.refreshTrigger.next();
  }

  searchBooks(query: string) {
    this.bookService.searchBooks(query).subscribe({
      next: (data) => {
        console.log(data);
        this.books.set(data);
      },
      error: (err) => console.error('API Err or:', err),
    });
  }

  searchExactBook(query: string) {
    this.bookService.searchExactBook(query).subscribe({
      next: (book) => {
        console.log(book);
        this.books.set([book].flat()); // maintain single item array
      },
      error: (err) => console.error('API Error:', err),
    });
  }

  addBook(name: string) {
    var book = { name: name };
    this.bookService
      .create(book)
      .pipe(debounceTime(300)) // Debounce to avoid rapid calls
      .subscribe({
        next: (data) => {
          console.log('Book added:', data);
          this.fetchbooks(); // Refresh the list after adding
        },
        error: (err) => console.error('API Error:', err),
      });
  }

  editBook(id: string) {
    this.isEditing.set(!this.isEditing());
    // Find the book to edit and set it in the signal
    const book = this.books().find((b) => b.id === id);
    this.bookToEdit.set(book);
  }

  updateBook(id: number, name: string) {
    var book = { id: id, name: name };
    this.bookService.update(id, book).subscribe({
      next: (data) => {
        console.log('Book updated:', data);
        this.fetchbooks(); // Refresh the list after updating
      },
      error: (err) => console.error('API Error:', err),
    });
  }

  considerDeleteBook(id: string) {
    this.isDeleting.set(!this.isDeleting());
    // Find the book to edit and set it in the signal
    const book = this.books().find((b) => b.id === id);
    this.bookToDelete.set(book);
  }

  deleteBook(id: number) {
    this.bookService
      .delete(id)
      .pipe(debounceTime(500))
      .subscribe({
        next: (data) => {
          console.log('Book deleted:', data);
          this.isDeleting.set(false);
          this.fetchbooks();
        },
        error: (err) => {
          console.error('API Error:', err);
        },
      });
  }
}
