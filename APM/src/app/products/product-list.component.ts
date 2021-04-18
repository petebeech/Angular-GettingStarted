import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProduct} from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = "Product List";
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string;
    sub!: Subscription;
    private _listFilter: string;

    public get listFilter(): string {
      return this._listFilter;
    }
    public set listFilter(value: string) {
      this._listFilter = value;
      this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
    }

    filteredProducts: IProduct[];
    products: IProduct[] = [];

    constructor(private productService: ProductService) {
    }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    onRatingClicked(message: string): void {
      this.pageTitle = 'Product List: ' + message;
    }

    performFilter(filterBy: string): IProduct[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.products.filter((product: IProduct) =>
        product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
  
    ngOnInit(): void {
      this.sub = this.productService.getProducts().subscribe({
        next: products => {
          this.products = products;
          this.filteredProducts = this.products;
          },
        error: err => this.errorMessage = err
      });
    }
}