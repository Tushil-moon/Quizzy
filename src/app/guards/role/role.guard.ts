import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Roles } from '../../modules/user/models/roles.enum';
import { AuthService } from '../../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: Roles[] = route.data['roles'];
  console.log(requiredRoles)
  const userRole = authservice.getRole();
  console.log(userRole)

  if (requiredRoles.includes(userRole!)) {
    console.log(userRole)
    return true;
  }
  console.log(userRole)

  router.navigate(['/login']);
  return false;
};
