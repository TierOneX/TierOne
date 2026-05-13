# 🔐 Configuración de Entorno (.env)

Este documento contiene las variables de entorno necesarias para que el proyecto **TierOne** funcione correctamente. En un entorno profesional, este archivo nunca se comparte, pero se incluye aquí para facilitar la evaluación académica.

## 📝 Instrucciones
1. El script `install.bat` (Windows) o `install.sh` (Linux) crea automáticamente el archivo `.env` basándose en el archivo `.env.example`.
2. Asegúrate de que los valores de base de datos coincidan con tu configuración local (por defecto usa `root` sin contraseña).

---

## 🛠️ Variables del Sistema
| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `APP_NAME` | `TierOne` | Nombre de la aplicación |
| `APP_ENV` | `local` | Entorno de ejecución |
| `APP_DEBUG` | `true` | Modo depuración activo |
| `APP_URL` | `http://localhost` | URL base del proyecto |

## 🗄️ Base de Datos (MySQL)
| Variable | Valor |
|----------|-------|
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `tierone_db` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | *(vacio)* |

## 💳 Pasarela de Pagos (Stripe)
*Estas claves son necesarias para procesar pagos de merchandising y suscripciones.*
- `STRIPE_KEY`: `pk_test_51TRv8UPGgluX3iiuRZL5XD0tGm8eM3rUWovbYdc40udfRFHLjd4zzBCPuMdzoVxg4qk2bCyT7UrN2C6h0bXAYUC000GFylHTdW`
- `STRIPE_SECRET`: `sk_test_51TRv8UPGgluX3iiu09h2boYkYY46U96khoVjO8ONuJ2JCRuN1jgYVx78IU6qN2YxiocK8LKgiXtLVLJ2urDBPTDc007dfcpoRQ`
- `STRIPE_WEBHOOK_SECRET`: *(opcional para dev local)*
- `STRIPE_CURRENCY`: `eur`

## 🎮 Integración con APIs de Juegos
*Utilizadas para obtener imágenes de juegos y datos de torneos.*
- `TWITCH_CLIENT_ID`: `s2xoxl1z37ftoc9bvlflc5c7y2pys5`
- `TWITCH_CLIENT_SECRET`: `kwtnkf7og724grnbj7n8d224smqges`

---

> [!IMPORTANT]
> La clave de aplicación (`APP_KEY`) configurada para este entorno es:
> `base64:gCVyJJuvLQBIWu4hh2BC330spq2Lci/7lQO/9bjmlzo=`
