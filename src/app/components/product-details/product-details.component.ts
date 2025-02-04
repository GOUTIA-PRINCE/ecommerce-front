import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!:Product;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const theProductId = Number(params.get('id'));
          if (!theProductId) {
            console.error('ID du produit invalide');
            return of(null);
          }
          return this.productService.getProduct(theProductId)
            .pipe(catchError(error => {
              console.error('Erreur lors de la récupération du produit', error);
              return of(null);
            }));
        })
      )
      .subscribe(data => {
        if (data) {
          this.product = data;
        }
      });
  }

  addToCart(): void {
    if (!this.product) {
      console.warn("Impossible d'ajouter un produit inexistant au panier.");
      return;
    }

    console.log(`Ajout au panier: ${this.product.name}, ${this.product.unit_price}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
