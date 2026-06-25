import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-component',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  // Inject the client and create a reactive signal for the data
  private http = inject(HttpClient); 
  public books = signal<any[]>([]);

  ngOnInit() {
    this.fetchbooks();
  }

  fetchbooks() {
    this.http.get<any[]>('https://localhost:7275/books')
      .subscribe({
        next: (data) => this.books.set(data), // Save data to signal
        error: (err) => console.error('API Error:', err)
      });
  }
}
