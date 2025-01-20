import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map,Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl='http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category'; // Remplacez par l'URL correcte de vos catégories

  constructor(private httpClient:HttpClient) { }

  getProductList(theCategoryId:number):Observable<Product[]>{

    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    //@todo:need to build url based on category id ... will come back to this!


    
    return this.httpClient.get<Product[]>(searchUrl);
    
  }
  getProductCategories(): Observable<ProductCategory[]> {
    
    return this.httpClient.get<ProductCategory[]>(this.categoryUrl);
  }
}