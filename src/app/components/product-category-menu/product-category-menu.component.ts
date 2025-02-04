import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories(): void {
    this.productService.getProductCategories()
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des catégories de produits', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe(data => {
        console.log('Product Categories=', JSON.stringify(data));
        this.productCategories = data;
      });
  }

}
