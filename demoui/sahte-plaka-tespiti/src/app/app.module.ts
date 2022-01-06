import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { SahtePlakalarComponent } from './sahte-plakalar/sahte-plakalar.component';
import {TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from './service/product.service';
import {GMapModule} from 'primeng/gmap';
import {GoogleMapsModule} from '@angular/google-maps'
import {CalendarModule} from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    SahtePlakalarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    ConfirmDialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    GMapModule,
    GoogleMapsModule,
    CalendarModule,
    DropdownModule,
    
  ],
  providers: [HttpClient,MessageService,ProductService],
  bootstrap: [SahtePlakalarComponent]
})
export class AppModule { }
