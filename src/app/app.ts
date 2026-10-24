import { Component, computed, inject, signal } from '@angular/core';
import { count, single } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ProductList } from './components/product-list/product-list';
import { ProductService } from './services/product';

@Component({
  imports: [DecimalPipe, ProductList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ShopAdmin Dashboard');
  protected readonly totalSales = signal(24580);
  protected readonly totalOrders = signal(156);

  private readonly productService = inject(ProductService);
  readonly totalProducts = computed(() => this.productService.products().length);

  protected readonly isStoreOpen = signal(true);

  protected addOrder() {
    this.totalOrders.update((count) => count + 1);
  }

  protected toggleStore() {
    this.isStoreOpen.update((isOpen) => !isOpen);
  }

  protected readonly products = [
    { id: 1, name: 'Laptop', price: 900 },
    { id: 2, name: 'Phone', price: 500 },
    { id: 3, name: 'Headphones', price: 80 },
  ];
}
