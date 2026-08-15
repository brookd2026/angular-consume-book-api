import { Component, signal } from '@angular/core';
import { AppComponent } from './app.component';
import { BookManagerComponent } from "./components/book-manager.component";

@Component({
  selector: 'app-root',
  imports: [AppComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('consume-book-repository');
}
