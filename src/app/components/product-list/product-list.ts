import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly productService = inject(ProductService);

  protected readonly products = this.productService.products;

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

    this.productService.addProduct(name, price);

    this.newProductName.set('');
    this.newProductPrice.set(null);
  }

  protected deleteProduct(id: number) {
    this.productService.deleteProduct(id);
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

    if (id === null || !name || price === null || !Number.isFinite(price) || price <= 0) {
      return;
    }

    this.productService.updateProduct(id, name, price);

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
