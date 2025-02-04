import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // Pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string | null = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(): void {
    const theKeyword: string | null = this.route.snapshot.paramMap.get('keyword');

    if (theKeyword && theKeyword !== this.previousKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`Recherche : keyword=${theKeyword}, page=${this.thePageNumber}`);

    if (theKeyword) {
      this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword)
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la recherche des produits', error);
            return of({ _embedded: { products: [] }, page: { number: 0, size: 5, totalElements: 0 } });
          })
        )
        .subscribe(data => this.processResult(data));
    }
  }

  handleListProducts(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    this.currentCategoryId = categoryId ? Number(categoryId) : 1;

    if (this.currentCategoryId !== this.previousCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`Catégorie : id=${this.currentCategoryId}, page=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des produits', error);
          return of({ _embedded: { products: [] }, page: { number: 0, size: 5, totalElements: 0 } });
        })
      )
      .subscribe(data => this.processResult(data));
  }

  processResult(data: any): void {
    this.products = data._embedded.products;
    this.thePageNumber = data.page.number + 1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;
  }

  updatePageSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Cast explicite
  
    if (selectElement && selectElement.value) {
      this.thePageSize = +selectElement.value;  // Conversion en number
      this.thePageNumber = 1;
      this.listProducts();
    }
  }
  
  

  addToCart(theProduct: Product): void {
    console.log(`Ajout au panier : ${theProduct.name}, ${theProduct.unit_price}`);
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
