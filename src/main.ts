import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';  


import { provideForms } from '@angular/forms';   

if (environment.production) {
  enableProdMode();
}

/
bootstrapApplication(App, {
  providers: [
    appConfig,                    
    provideRouter(routes),         
    provideHttpClient(),          
    
  ]
}).catch(err => console.error(err));