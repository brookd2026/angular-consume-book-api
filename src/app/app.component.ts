import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'app-component',
    standalone: true,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    // Inject the client and create a reactive signal for the data
    private http = inject(HttpClient);
    public books = signal<any[]>([]);
    rootUrl = 'https://localhost:7275/books';

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

    searchBooks(query: string) {
        const searchUrl = `${this.rootUrl}/FilterSearch?book=${encodeURIComponent(query)}`;
        this.http.get<any[]>(searchUrl)
            .subscribe({
                next: (data) => this.books.set(data), // Save data to signal
                error: (err) => console.error('API Error:', err),
            });
    }

    searchExactBook(query: string) {
        const searchUrl = `${this.rootUrl}/ExactNameSearch?searchString=${encodeURIComponent(query)}`;
        this.http.get<any[]>(searchUrl)
            .subscribe({
                next: (data) => this.books.set(data), // Save data to signal
                error: (err) => console.error('API Error:', err)
            });
    }

    addBook(bookName: string) {
        const postUrl = `${this.rootUrl}/AddBookToList?book=${encodeURIComponent(bookName)}`
        this.http.post<any>(postUrl, null)
            .pipe(debounceTime(300)) // Debounce to avoid rapid calls
            .subscribe({
                next: (data) => {
                    console.log('Book added:', data);
                    this.fetchbooks(); // Refresh the list after adding
                },
                error: (err) => console.error('API Error:', err)
            })
    };

    updateBook(searchString: string, bookName: string) {
        const putUrl = `${this.rootUrl}/UpdateBookTitle?newName=${encodeURIComponent(bookName)}`
        const book = { name: searchString }; // Create an object with the book name
        this.http.put<any>(putUrl, book)
            .pipe(debounceTime(300)) // Debounce to avoid rapid calls
            .subscribe({
                next: (data) => {
                    console.log('Book added:', data);
                },
                error: (err) => console.error('API Error:', err)
            })
    }

}


