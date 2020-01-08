import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { QRScanner} from '@ionic-native/qr-scanner/ngx';
import { DeviceOrientation} from '@ionic-native/device-orientation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { BLE} from '@ionic-native/ble/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PinchZoomModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    BarcodeScanner,
    DeviceOrientation,
    TextToSpeech,
    Pedometer,
    BLE,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
