import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { Book } from './models/book.model';

@Component({
    selector: 'app-component',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    // Inject the client and create a reactive signal for the data
    private http = inject(HttpClient);
    public books = signal<any[]>([]);
    rootUrl = 'https://localhost:7275/books';
    isEditing = signal(false);
    isAdding = signal(false);
    bookToEdit = signal<any>(null);
    private refreshTrigger = new BehaviorSubject<void>(undefined);

    ngOnInit() {
        this.fetchbooks();
    }

    fetchbooks() {
        this.http.get<any[]>(this.rootUrl)
            .subscribe({
                next: (data) => this.books.set(data), // Save data to signal
                error: (err) => console.error('API Error:', err)
            });
    }

    triggerRefresh() {
        this.refreshTrigger.next();
    }

    searchBooks(query: string) {
        const searchUrl = `${this.rootUrl}/FilterSearch/${encodeURIComponent(query)}`;
        this.http.get<any[]>(searchUrl)
            .subscribe({
                next: (data) => this.books.set(data), // Save data to signal
                error: (err) => console.error('API Error:', err),
            });
    }

    searchExactBook(query: string) {
        const searchUrl = `${this.rootUrl}/ExactNameSearch/${encodeURIComponent(query)}`;
        this.http.get<any[]>(searchUrl)
            .subscribe({
                next: (data) => this.books.set(data), // Save data to signal
                error: (err) => console.error('API Error:', err)
            });
    }

    addBook(name: string) {
        const postUrl = `${this.rootUrl}/AddBookToList`
        var book = { name: name };
        this.http.post<any>(postUrl, book)
            .pipe(debounceTime(300)) // Debounce to avoid rapid calls
            .subscribe({
                next: (data) => {
                    console.log('Book added:', data);
                    this.fetchbooks(); // Refresh the list after adding
                },
                error: (err) => console.error('API Error:', err)
            })
    };

    editBook(id: string) {
        this.isEditing.set(!this.isEditing());
        // Find the book to edit and set it in the signal
        const book = this.books().find((b) => b.id === id);
        this.bookToEdit.set(book);
    }

    updateBook(id: number, name: string) {
        const putUrl = `${this.rootUrl}/UpdateBookTitle/${id}`
        var book = { id: id, name: name };
        this.http.put<any>(putUrl, book)
            .pipe(debounceTime(300)) // Debounce to avoid rapid calls
            .subscribe({
                next: (data) => {
                    console.log('Book added:', data);
                    this.isEditing.set(false);
                    this.fetchbooks(); // Refresh the list after updating
                },
                error: (err) => console.error('API Error:', err)
            })
    }

    deleteBook(id: string) {
        const deleteUrl = `${this.rootUrl}/DeleteBookFromList/${id}`;
        this.http.delete<any>(deleteUrl)
            .subscribe({
                next: (data) => {
                    console.log('Book deleted:', data);
                },
                error: (err) => console.error('API Error:', err)
            })
    }

}


