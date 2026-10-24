import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

const STORAGE_KEY = 'shop-admin-products';

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop', price: 900 },
  { id: 2, name: 'Phone', price: 500 },
  { id: 3, name: 'Headphones', price: 80 },
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(this.loadProducts());

  readonly products = this.productsSignal.asReadonly();

  private loadProducts(): Product[] {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEY);

      if (savedProducts === null) {
        return INITIAL_PRODUCTS;
      }

      const parsed: unknown = JSON.parse(savedProducts);

      if (!Array.isArray(parsed)) {
        return INITIAL_PRODUCTS;
      }

      return parsed as Product[];
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  private saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      console.warn('Products could not be saved to localStorage.');
    }
  }

  addProduct(name: string, price: number): void {
    const newProduct: Product = {
      id: Math.max(0, ...this.productsSignal().map((product) => product.id)) + 1,
      name,
      price,
    };

    this.productsSignal.update((products) => [...products, newProduct]);
    this.saveProducts(this.productsSignal());
  }

  deleteProduct(id: number): void {
    this.productsSignal.update((products) => products.filter((product) => product.id !== id));

    this.saveProducts(this.productsSignal());
  }

  updateProduct(id: number, name: string, price: number): void {
    this.productsSignal.update((products) =>
      products.map((product) => (product.id === id ? { ...product, name, price } : product)),
    );

    this.saveProducts(this.productsSignal());
  }
}
