# Lumina API

API REST de Lumina hecha con Spring Boot, Spring Data JPA y MySQL.

## Qué necesitas

- JDK 17 o superior
- MySQL 8 (o ninguno, si pruebas con el perfil `h2`)
- Maven (IntelliJ y VS Code con el Extension Pack for Java ya lo traen)

## Cómo ejecutarla

1. En MySQL, ejecuta en este orden los scripts de la carpeta `data-base/` (están en la raíz del repo):
   `01_schema.sql` (crea las tablas) y `02_seed.sql` (datos de ejemplo).
2. Si tu usuario de MySQL no es `root` o la contraseña no es `root`, define las variables de entorno
   `DB_USER` y `DB_PASSWORD`. Así no subimos contraseñas a GitHub.
3. Desde esta carpeta (`backend/`):

   ```
   mvn spring-boot:run
   ```

   La API queda en `http://localhost:8080`.

**Sin MySQL:** `mvn spring-boot:run -Dspring-boot.run.profiles=h2` usa una base de datos en memoria.
Se borra al apagar la API y empieza sin productos.

## Estructura

Los paquetes van por dominio, como se definió en `docs/DESARROLLO.md`:

```
com.lumina
├── usuario/    Role, AppUser, registro y login
├── producto/   ProductCategory, Product
├── favorito/   Favorite
├── cupon/      Coupon
├── vela/       CustomCandle (vela personalizada)
├── carrito/    Cart, CartItem (entidades y repositorios; falta el controlador)
├── pedido/     UserOrder, OrderItem, OrderStatus
├── contacto/   ContactMessage
├── config/     CORS, BCrypt y datos básicos (roles y estados)
└── common/     excepciones y manejo de errores
```

Cada dominio tiene sus entidades, su repositorio (`JpaRepository`, que ya trae el CRUD completo),
su servicio (la lógica) y su controlador (los endpoints).

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/registro` | Crea una cuenta (rol CUSTOMER) |
| POST | `/api/login` | Revisa correo y contraseña |
| GET | `/api/usuarios` · `/api/usuarios/{id}` | Lista o consulta usuarios |
| PUT · DELETE | `/api/usuarios/{id}` | Edita nombre y teléfono, o elimina |
| GET | `/api/productos` | Lista. Filtros: `?categoria=navidad&disponibles=true` |
| GET | `/api/productos/{id}` · `/api/productos/slug/{slug}` | Un producto |
| POST · PUT · DELETE | `/api/productos` · `/api/productos/{id}` | Crea, edita, elimina |
| GET · POST · PUT · DELETE | `/api/categorias` · `/api/categorias/{id}` | CRUD de categorías |
| GET | `/api/usuarios/{id}/favoritos` | Favoritos de una persona |
| POST | `/api/favoritos` | Agrega un favorito |
| DELETE | `/api/favoritos/{id}` | Quita un favorito |
| GET | `/api/cupones/validar?codigo=LUMINA10` | Dice si el cupón sirve y cuánto descuenta |
| GET · POST · PUT · DELETE | `/api/cupones` · `/api/cupones/{id}` | CRUD de cupones |
| POST | `/api/contacto` | Guarda un mensaje del formulario de contacto |
| GET · DELETE | `/api/contacto` · `/api/contacto/{id}` | Lista, consulta o elimina mensajes |
| POST · GET · DELETE | `/api/velas-personalizadas` · `?usuarioId=` · `/{id}` | Velas de "Crea tu Lumina" |
| POST | `/api/pedidos` | Crea un pedido (calcula precios, descuento y baja el stock) |
| GET | `/api/pedidos` · `?usuarioId=2` · `/api/pedidos/{id}` | Lista o consulta pedidos |
| PUT | `/api/pedidos/{id}/estado` | Cambia el estado. Si pasa a `CANCELLED`, el stock vuelve |

## Ejemplos

Registro:

```json
POST /api/registro
{
  "fullName": "Laura Gómez",
  "phone": "300 123 4567",
  "email": "laura@correo.com",
  "password": "lumina2026"
}
```

Pedido:

```json
POST /api/pedidos
{
  "userId": 2,
  "couponCode": "LUMINA10",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ]
}
```

Los errores siempre tienen esta forma:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Revisa los datos enviados.",
  "details": ["email: Escribe un correo válido, por ejemplo nombre@correo.com."],
  "timestamp": "2026-11-14T16:30:00"
}
```

Códigos: `400` datos inválidos, `401` login incorrecto, `404` no existe, `409` ya existe o hay datos que dependen de él.

## Cosas a tener en cuenta

- Las contraseñas se guardan con BCrypt. Los usuarios de `02_seed.sql` tienen contraseñas de mentira
  (`demo-hash-...`), por eso no se puede iniciar sesión con ellos: crea una cuenta nueva con `/api/registro`.
- Todavía no hay JWT. Los endpoints de administración (crear o borrar productos, cupones, etc.) están abiertos.
  Es el siguiente paso para restringirlos por rol.
- CORS permite `localhost:5500` y `127.0.0.1:5500` (Live Server) y la página de GitHub Pages del equipo.
  Si el frontend corre en otro puerto, se agrega en `config/WebConfig.java`.
