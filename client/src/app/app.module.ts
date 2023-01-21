import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './authentication/auth.module';
import {HomeModule} from "./home/home.module";
import {AuthenticationInterceptor} from "./authentication/services/authenticationInterceptor.service";
import {DashBoardModule} from "./dashBoard/dashBoard.module";
import {BoardModule} from "./board/board.module";
import { SocketService } from './shared/services/socket.service';
import {WhiteBoardModule} from "./shared/modules/whiteboard/whiteBoard.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    HomeModule,
    DashBoardModule,
    BoardModule,
    WhiteBoardModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
  },
    SocketService,

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
