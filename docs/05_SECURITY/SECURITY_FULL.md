# 🔐 Seguridad y Webhooks (Deep Dive)

Este documento detalla los mecanismos de defensa y la integración segura con proveedores externos.

---

## 🛡️ Verificación de Webhooks de Stripe

Para evitar ataques de "Replay" o falsificación de pagos, TierOne implementa una verificación estricta de firmas:

```php
// app/Http/Controllers/StripeController.php

public function webhook(Request $request) {
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $secret = config('stripe.webhook_secret');

    try {
        // Esta línea valida que el evento realmente viene de Stripe
        $event = Webhook::constructEvent($payload, $sigHeader, $secret);
    } catch (SignatureVerificationException $e) {
        return response('Firma inválida', 400);
    }
}
```

---

## 🔑 Autenticación y Autorización

### Laravel Sanctum (SPA Authentication)
Se utiliza Sanctum por ser más ligero que Passport para aplicaciones que no requieren un servidor OAuth2 completo.
- **CSRF Protection**: Las peticiones desde el frontend React pasan por el middleware `VerifyCsrfToken` (exceptuando el webhook de Stripe).
- **Tokens**: Se emiten tokens de larga duración que se invalidan al cerrar sesión.

### Roles y Permisos (Middleware)
Se han definido gates en `AuthServiceProvider` para proteger el panel administrativo:

```php
Gate::define('access-admin', function (User $user) {
    return $user->rol === 'admin';
});
```

---

## 💳 Cumplimiento PCI y Datos Sensibles

TierOne sigue el principio de **Privilegio Mínimo**:
- **Zero Card Data**: Nunca almacenamos números de tarjeta, CVV o fechas de expiración. Estos datos viajan desde el navegador del cliente directamente a Stripe mediante *Stripe Elements*.
- **Tokenización**: Solo almacenamos el `payment_intent_id` para realizar reembolsos o consultas de estado.

---

## 👾 Integración Twitch

- **Scopes**: Solo solicitamos `user:read:email` para minimizar el acceso a datos privados.
- **Validación de Estado**: El `TwitchAuthService` valida el `state` en el callback para prevenir ataques CSRF en el flujo de login.

---
*Manual de Seguridad - TierOne*
