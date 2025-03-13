import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage:Storage=sessionStorage;

  constructor(
  private formBuilder: FormBuilder,
  private luv2ShopFormService: Luv2ShopFormService,
  private cartService: CartService,
  private checkoutService:CheckoutService,
  private router:Router
) {}


  ngOnInit(): void {

    this.reviewCartDetails();

    //read the user's email adress from browser storage
    const theEmail=JSON.parse(this.storage.getItem('userEmail')!);


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                  [Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
                                  [Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                [Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', 
                              [Validators.required, 
                              Validators.minLength(2),
                              Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', 
                                 [Validators.required, 
                                 Validators.minLength(2),
                                 Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
          [Validators.required, 
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', 
                [Validators.required, 
                Validators.minLength(2),
                Luv2ShopValidators.notOnlyWhitespace]),
        state: ['', Validators.required],
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', 
                  [Validators.required, 
                  Validators.minLength(2),
                  Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        nameOnCard:new FormControl('', 
                                    [Validators.required, 
                                    Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]),
        expirationMonth: new FormControl('', Validators.required),
        expirationYear: new FormControl('', Validators.required)
      })
    });

    this.populateCreditCardDates();
  }


  reviewCartDetails() {
   //subscribe to cartService.totalQuantity
   this.cartService.totalQuantity.subscribe(
    totalQuantity=>this.totalQuantity=totalQuantity
   );

   //subscribe to cartService.totalPrice
   this.cartService.totalPrice.subscribe(
    totalPrice=>this.totalPrice=totalPrice
   );
  }

  populateCreditCardDates() {
    const startMonth: number = new Date().getMonth() + 1;
    
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    this.luv2ShopFormService.getCountries().subscribe(
      data => this.countries = data
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipcode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipcode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.get('billingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
      this.billingAddressStates = [...this.shippingAddressStates]; // Copie des États
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.value);
    
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    /*
    
    const customerEmail = this.email?.value || 'N/A';
    const shippingCountry = this.shippingAddressCountry?.value?.name || 'N/A';
    const shippingState = this.shippingAddressState?.value?.name || 'N/A';

    console.log("The email address is: " + customerEmail);
    console.log("The shipping address country is: " + shippingCountry);
    console.log("The shipping address state is: " + shippingState);
    */
   //set up order
   let order = new Order(this.totalQuantity, this.totalPrice);
    order.totalPrice=this.totalPrice;
    order.totalQuantity=this.totalQuantity
   //get cart items
    const cartItems=this.cartService.cartItems;
   //create orderItems from cartItem 
  //-long way
  /*
  let orderItems:OrderItem[]=[];
  for(let i=0;i<cartItems.length;i++){
    orderItems[i]=new OrderItem(cartItems[i]);
  }
*/ 
  //-short way of doing the same thingy
  let orderItems:OrderItem[]=cartItems.map(tempCartItem=>new OrderItem(tempCartItem));
   //set up purchase
   let purchase = new Purchase(
    this.checkoutFormGroup.controls['customer'].value, // Customer
    this.checkoutFormGroup.controls['shippingAddress'].value, // Shipping Address
    this.checkoutFormGroup.controls['billingAddress'].value, // Billing Address
    order, // Order
    orderItems // Liste des OrderItems
  );
   //populate purchase -customer
    purchase.customer=this.checkoutFormGroup.controls['customer'].value;
   //populate purchase -shipping address 
   purchase.shippingAddress=this.checkoutFormGroup.controls['shippingAddress'].value;
   const shippingState:State=JSON.parse(JSON.stringify(purchase.shippingAddress.state));
   const shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
   purchase.shippingAddress.state=shippingState.name;
   purchase.shippingAddress.country=shippingCountry.name; 
    //populate purchase -billing address 
    purchase.billingAddress=this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State=JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state=billingState.name;
    purchase.billingAddress.country=billingCountry.name;

    //purchase order and orderItems
    purchase.order=order;
    purchase.orderItems=orderItems;
    //call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next:response=>{
          alert(`Your order has been received.\nOrder tracking number:${response.orderTrackingNumber}`)

          //reset
          this.resetCart();
        },
        error:err=>{
          alert(`There was an error:${err.message}`);
        }
      }
      
    );
  }


  resetCart() {
    //reset cart data
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    //reset the form
    this.checkoutFormGroup.reset();
    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");
    if (!creditCardFormGroup) return;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number = (currentYear === selectedYear) ? new Date().getMonth() + 1 : 1;

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    if (!formGroup) return;

    const country = formGroup.value?.country;
    if (!country) return;

    this.luv2ShopFormService.getStates(country.code).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        if (data.length > 0) {
          formGroup.get('state')?.setValue(data[0]);
        }
      }
    );
  }
}
