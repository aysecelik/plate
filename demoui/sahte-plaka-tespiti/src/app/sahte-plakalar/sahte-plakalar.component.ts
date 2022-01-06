
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import {Product} from '../model/product';
import { ProductService } from '../service/product.service';
@Component({
  selector: 'app-sahte-plakalar',
  templateUrl: './sahte-plakalar.component.html',
  styleUrls: ['./sahte-plakalar.component.css'],
  providers:[ConfirmationService]
})
export class SahtePlakalarComponent implements OnInit {
  product:Product;
  products:Product[];
  openDialog:boolean;
  options: any;
  overlays:any[];
  infoWindow: any;
  map: google.maps.Map | undefined;
  markerTitle: string;
  loc1:number;
  loc2:number;
  bi:string;
  date7:string;
  date8:string;


  constructor(private confirmationService:ConfirmationService,
    private productService:ProductService,
    private messageService:MessageService ) { 
    this.product={};
    this.products=[];
    this.openDialog=false;
    this.options={};
    this.overlays=[];
    this.infoWindow=new google.maps.InfoWindow();
    this.markerTitle="";
    this.loc1=0;
    this.loc2=0;
    this.bi ="";
    this.date7=new Date().toLocaleString().slice(0, 16);
    this.date8=new Date().toLocaleString().slice(0, 16);



   
  }
  zoomIn(map: { setZoom: (arg0: any) => void; getZoom: () => number; }) {
    map.setZoom(map.getZoom()+1);
}

zoomOut(map: { setZoom: (arg0: number) => void; getZoom: () => number; }) {
    map.setZoom(map.getZoom()-1);
}

clear() {
    this.overlays = [];
}
show() {
  this.overlays = [];
  for (let index = 0; index < this.products.length; index++) {
    if(Object.values(this.products[index]).toString().split(",")[5]==this.product.plaka){
      let date9=Object.values(this.products[index]).toString().split(",")[4];

      if(parseInt(date9)>new Date(this.date7).getTime() && parseInt(date9)<new Date(this.date8).getTime()){
        this.loc1= parseInt(Object.values(this.products[index]).toString().split(",")[2]);
        this.loc2= parseInt(Object.values(this.products[index]).toString().split(",")[3]);
        this.bi=new Date(parseInt(date9)).toLocaleString();
        this.overlays.push(new google.maps.Marker({position:{lat: this.loc1, lng: this.loc2}, title:this.bi}));

      }
     }
  }
      


     

}
deleteProduct(product:Product){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       this.productService.deleteProduct(product).subscribe(d=>{
         this.getProducts(),
         this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000})},
         err=>this.showErrorMessage(err));
        },
  });
  }
openDialogForm(p:Product){
  this.overlays=[];
  this.product={...p};
  this.openDialog=true;
  this.loc1= parseInt(p.location?.split(',')[0]!);
  this.loc2= parseInt(p.location?.split(',')[1]!);
  this.bi=new Date(p.tarih!).toLocaleString();
  let dd = new Date(this.product.tarih!).getDate().toString();
  let mm = (new Date(this.product.tarih!).getMonth() + 1).toString();
  let hh = new Date(this.product.tarih!).getHours().toString();
  let min = (new Date(this.product.tarih!).getMinutes()).toString();
  dd = dd.length === 2 ? dd : "0" + dd;
  mm = mm.length === 2 ? mm : "0" + mm;
  hh = hh.length === 2 ? hh : "0" + hh;
  min = min.length === 2 ? min : "0" + min;
  this.date7= [new Date(this.product.tarih!).getFullYear(), '-', mm, '-', dd, 'T', hh, ':', min].join('');
  this.date8= [new Date(this.product.tarih!).getFullYear(), '-', mm, '-', dd, 'T', hh, ':', min].join('');
  this.overlays.push(new google.maps.Marker({position:{lat: this.loc1, lng: this.loc2}, title:this.bi}));
 
}

hideDialog(){
  this.openDialog=false;
}
  

  getProducts(){    
    this.productService.getProducts().subscribe(data=>this.products=data);

  }
 
  ngOnInit(): void {
    this.getProducts();
    this.options = {
      center: {lat: 38.566559519502235, lng: 35.32620302112313},
      zoom: 5.5
  };
  this.initOverlays();

  this.infoWindow = new google.maps.InfoWindow();
  let audio=new Audio();
  
    audio.src="../../../assets/music.mp3";
    audio.load();
    //audio.play();

  }
  showErrorMessage(err:any){
    if(err.error&&err.error.message){
      this.messageService.add({severity:'error', summary: 'Error', detail: err.error.message, life: 3000});

    }
  }
  initOverlays() {
    if (!this.overlays||!this.overlays.length) {
        this.overlays = [ 
        ]      
    }
}
handleOverlayClick(event) {
  let isMarker = event.overlay.getTitle != undefined;

  if (isMarker) {
      let title = event.overlay.getTitle();
      this.infoWindow.setContent('' + title + '');
      this.infoWindow.open(event.map, event.overlay);
      //event.map.setCenter(event.overlay.getPosition());

      this.messageService.add({severity:'info', summary:'Marker Selected', detail: title});
  }
  else {
  }
}

handleDragEnd(event) {
  this.messageService.add({severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()});
}
  

}
