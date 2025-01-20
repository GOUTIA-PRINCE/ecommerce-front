import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products: Product[]=[];
  currentCategoryId:number=1;
  constructor(private productService:ProductService,
              private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
    
  }
  listProducts(){
    //verifier si le parametre id est disponible

     const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

if (hasCategoryId) {
  const id = this.route.snapshot.paramMap.get('id');
  this.currentCategoryId = id ? Number.parseInt(id, 10) : 1; // Vérifiez si id n'est pas null
} else {
  this.currentCategoryId = 1;
}
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data =>{
        this.products=data;
      }
    )
  }

}
