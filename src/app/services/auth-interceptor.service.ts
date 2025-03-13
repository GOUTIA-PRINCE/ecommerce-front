import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, AccessToken } from '@okta/okta-auth-js';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  // Injecter le service OktaAuth
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Liste des endpoints sécurisés
    const securedEndpoints = ['http://localhost:8080/api/orders'];

    // Récupération du token d'accès via tokenManager
    return from(this.oktaAuth.tokenManager.get('accessToken')).pipe(
      switchMap((accessToken: AccessToken | undefined) => {
        // Vérification si un token existe et si l'URL correspond
        if (accessToken?.accessToken && securedEndpoints.some(url => request.urlWithParams.includes(url))) {
          // Clone de la requête avec ajout du header Authorization
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken.accessToken}`
            }
          });
        }
        // Poursuivre la requête HTTP
        return next.handle(request);
      })
    );
  }
}
