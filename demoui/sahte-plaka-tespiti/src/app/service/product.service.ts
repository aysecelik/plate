import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from 'src/environments/environment';
import { toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }
  apiUrl=environment.apiIrl+"product";
  getProducts():Observable<Product[]>{
   return this.http.get<Product[]>(this.apiUrl);
 }
 
 getProduct(product:Product):Observable<Product[]>{
   return this.http.get<Product[]>(this.apiUrl+"/"+product.id);
 }
 deleteProduct(product:Product):Observable<Product>
 {
   return this.http.delete<Product>(this.apiUrl+"/"+product.id);
   
 }
 

}
