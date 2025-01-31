import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category'; // Remplacez par l'URL correcte de vos catégories

  constructor(private httpClient: HttpClient) {}

  getProduct(theProductId: number): Observable<Product> {
    //need to build URL based on product id
    const productUrl=`${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
  /**
   * Get the list of products for a given category ID
   * @param theCategoryId - category ID
   * @returns Observable<Product[]>
   */
  getProductList(theCategoryId: number): Observable<Product[]> {
    // Construire l'URL basé sur l'ID de catégorie
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpClient.get<Product[]>(searchUrl);
  }

  /**
   * Get the list of product categories
   * @returns Observable<ProductCategory[]>
   */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.categoryUrl);
  }

  /**
   * Search products based on a keyword
   * @param theKeyword - keyword to search for
   * @returns Observable<Product[]>
   */
  searchProducts(theKeyword: string): Observable<Product[]> {
    // Construire l'URL basé sur le mot-clé
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.httpClient.get<Product[]>(searchUrl);
  }
}
