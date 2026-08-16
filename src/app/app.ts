import { Component, signal } from '@angular/core';
import { BookListComponent } from "./components/book-list.component/book-list.component";

@Component({
  selector: 'app-root',
  imports: [BookListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('consume-book-repository');
}
