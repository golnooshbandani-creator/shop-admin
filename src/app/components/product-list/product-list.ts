import { Component, computed, signal } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  protected readonly products = signal<Product[]>([
    { id: 1, name: 'Laptop', price: 900 },
    { id: 2, name: 'Phone', price: 500 },
    { id: 3, name: 'Headphones', price: 80 },
  ]);

  protected readonly searchTerm = signal('');
  protected readonly sortOrder = signal('default');

  protected readonly newProductName = signal('');
  protected readonly newProductPrice = signal<number | null>(null);

  protected readonly Number = Number;

  protected readonly editingProductId = signal<number | null>(null);
  protected readonly editProductName = signal('');
  protected readonly editProductPrice = signal<number | null>(null);

  protected addProduct() {
    const name = this.newProductName().trim();
    const price = this.newProductPrice();

    if (!name || price === null || !Number.isFinite(price) || price <= 0) {
      return;
    }

    const newProduct: Product = {
      id: Math.max(0, ...this.products().map((product) => product.id)) + 1,
      name,
      price,
    };

    this.products.update((products) => [...products, newProduct]);

    this.newProductName.set('');
    this.newProductPrice.set(null);
  }

  protected deleteProduct(id: number) {
    this.products.update((products) => products.filter((product) => product.id !== id));
  }

  protected startEdit(product: Product) {
    this.editingProductId.set(product.id);
    this.editProductName.set(product.name);
    this.editProductPrice.set(product.price);
  }

  protected cancelEdit() {
    this.editingProductId.set(null);
    this.editProductName.set('');
    this.editProductPrice.set(null);
  }

  protected saveEdit() {
    const id = this.editingProductId();
    const name = this.editProductName().trim();
    const price = this.editProductPrice();

    if (id === null || !name || price === null || !this.Number.isFinite(price) || price <= 0) {
      return;
    }

    this.products.update((products) =>
      products.map((product) => (product.id === id ? { ...product, name, price } : product)),
    );

    this.cancelEdit();
  }

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const order = this.sortOrder();

    const result = this.products().filter((product) => product.name.toLowerCase().includes(term));

    if (order === 'low') {
      result.sort((a, b) => a.price - b.price);
    } else if (order === 'high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  });
}
