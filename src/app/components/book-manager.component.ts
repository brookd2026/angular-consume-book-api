import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './book-manager.components.html',
  styleUrl: './book-manager.component.css'
})

export class BookManagerComponent {
  private bookService = inject(BookService);

  // Form State Management
  isSubmitting = signal(false);
  activeBook = signal<Book>(this.emptyBook());

  // READ Operation: Automatically triggers on load and manages native loading states
  booksResource = rxResource({
    stream: () => this.bookService.getAll()
  });

  // CREATE & UPDATE execution logic
  saveBook() {
    const current = this.activeBook();
    if (!current.name) return;

    this.isSubmitting.set(true);

    if (current.id) {
      // UPDATE block
      this.bookService.update(current.id, current).subscribe({
        next: (updatedBook) => {
          // Mutate the local resource value instantly without reloading the entire page
          this.booksResource.value.update(books => 
            books ? books.map(b => b.id === current.id ? current : b) : []
          );
          this.resetForm();
        },
        complete: () => this.isSubmitting.set(false)
      });
    } else {
      // CREATE block
      this.bookService.create(current).subscribe({
        next: (newBook) => {
          // Push to local signal array immediately
          this.booksResource.value.update(books => books ? [...books, newBook] : [newBook]);
          this.booksResource.reload();
          this.resetForm();
        },
        complete: () => this.isSubmitting.set(false)
      });
    }
  }

  // DELETE operation execution logic
  deleteBook(id: number) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    this.isSubmitting.set(true);
    this.bookService.delete(id).subscribe({
      next: () => {
        // Filter item out of the local signal instantly
        this.booksResource.value.update(books => 
          books ? books.filter(b => b.id !== id) : []
        );
        if (this.activeBook().id === id) this.resetForm();
      },
      complete: () => this.isSubmitting.set(false)
    });
  }

  // UI State Helpers
  selectForEdit(book: Book) {
    // Clone properties to prevent live template mutating while typing
    this.activeBook.set({ ...book });
  }

  resetForm() {
    this.activeBook.set(this.emptyBook());
  }

  private emptyBook(): Book {
    return { name: '' };
  }
}
