import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-ecommerce';
  isCategoryMenuOpen = false;

  toggleCategoryMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
  }

  @HostListener('document:click')
  closeCategoryMenu(): void {
    this.isCategoryMenuOpen = false;
  }
}
