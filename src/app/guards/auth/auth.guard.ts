import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const router = inject(Router);
  const user = authservice.getUserFromLocal();
  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
