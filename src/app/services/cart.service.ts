import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  storage:Storage=sessionStorage;
 // storage:Storage=localStorage;

  constructor() { 

    //read data from storage
    let data =JSON.parse(this.storage.getItem('cartItems')!);

    if(data !=null){
      this.cartItems=data;

      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem): void {

    // Vérifier si l'article existe déjà dans le panier
    let existingCartItem: CartItem | null = this.cartItems.find(item => item.id === theCartItem.id) || null;

    if (existingCartItem) {
      // Si l'article est déjà présent, augmenter la quantité
      existingCartItem.quantity++;
    } else {
      // Sinon, ajouter l'article au panier
      this.cartItems.push(theCartItem);
    }

    // Recalculer les totaux
    this.computeCartTotals();
  }

  computeCartTotals(): void {

    let totalPriceValue = this.cartItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    let totalQuantityValue = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Mettre à jour les observables avec les nouvelles valeurs
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Log pour le debugging
    this.logCartData();

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }

  logCartData(): void {
    console.log('Contenu du panier :', this.cartItems);
    console.log(`Total: ${this.totalPrice.value.toFixed(2)} USD, Quantité totale: ${this.totalQuantity.value}`);
  }

  decrementQuantity(theCartItem: CartItem): void {
    if (theCartItem.quantity > 1) {
      theCartItem.quantity--;
      this.computeCartTotals();
    } else {
      this.remove(theCartItem);
    }
  }

  remove(theCartItem: CartItem): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
    this.computeCartTotals();
  }
}
