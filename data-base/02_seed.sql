USE lumina;

-- Roles
INSERT INTO `role` (id, name, description, created_at, updated_at) VALUES
  (1, 'ADMIN', 'Gestiona productos, pedidos y usuarios.', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
  (2, 'CUSTOMER', 'Compra productos y administra sus favoritos.', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
  (3, 'STAFF', 'Apoya la gestion de pedidos.', '2026-01-01 09:00:00', '2026-01-01 09:00:00');

-- Usuarios
INSERT INTO `app_user` (id, full_name, phone, email, password_hash, role_id, created_at, updated_at) VALUES
  (1, 'Admin Lumina', '3001000001', 'admin@lumina.test', 'demo-hash-admin', 1, '2026-01-02 09:00:00', '2026-01-02 09:00:00'),
  (2, 'Laura Gomez', '3001000002', 'laura@lumina.test', 'demo-hash-laura', 2, '2026-01-03 09:00:00', '2026-01-03 09:00:00'),
  (3, 'Carlos Rojas', '3001000003', 'carlos@lumina.test', 'demo-hash-carlos', 2, '2026-01-04 09:00:00', '2026-01-04 09:00:00'),
  (4, 'Maria Torres', '3001000004', 'maria@lumina.test', 'demo-hash-maria', 2, '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
  (5, 'Diego Perez', '3001000005', 'diego@lumina.test', 'demo-hash-diego', 3, '2026-01-06 09:00:00', '2026-01-06 09:00:00');

-- Estados de pedido
INSERT INTO `order_status` (id, name, description, created_at, updated_at) VALUES
  (1, 'PENDING', 'Pedido creado y pendiente de revision.', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
  (2, 'CONFIRMED', 'Pedido confirmado.', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
  (3, 'PREPARING', 'Pedido en preparacion.', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
  (4, 'COMPLETED', 'Pedido entregado o finalizado.', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
  (5, 'CANCELLED', 'Pedido cancelado.', '2026-01-01 09:00:00', '2026-01-01 09:00:00');

-- Categorias de producto
INSERT INTO `product_category` (id, name, slug, description, category_type, active) VALUES
  (1, 'Bienestar', 'bienestar', 'Velas para crear espacios de bienestar.', 'EXPERIENCE', TRUE),
  (2, 'Descanso', 'descanso', 'Velas para relajarse y descansar.', 'EXPERIENCE', TRUE),
  (3, 'Mindfulness', 'mindfulness', 'Velas para concentracion y calma.', 'EXPERIENCE', TRUE),
  (4, 'Navidad', 'navidad', 'Coleccion especial de temporada.', 'SEASON', TRUE),
  (5, 'Halloween', 'halloween', 'Coleccion especial de Halloween.', 'SEASON', TRUE);

-- Productos
INSERT INTO `product` (id, name, slug, image_url, product_category_id, scent, weight_grams, color, description, price, stock, available, created_at, updated_at) VALUES
  (1, 'Renacer', 'renacer', 'https://example.com/renacer.png', 1, 'Floral', 200, 'Blanco con destellos rosa', 'Un momento para renovar tu energia.', 12000.00, 25, TRUE, '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
  (2, 'Relajacion', 'relajacion', 'https://example.com/relajacion.png', 2, 'Lavanda', 200, 'Lila suave', 'Ideal para desconectarte y descansar.', 12000.00, 20, TRUE, '2026-01-11 09:00:00', '2026-01-11 09:00:00'),
  (3, 'Equilibrio', 'equilibrio', 'https://example.com/equilibrio.png', 3, 'Lavanda - Manzanilla', 200, 'Verde menta pastel', 'Encuentra tu propio centro.', 12000.00, 18, TRUE, '2026-01-12 09:00:00', '2026-01-12 09:00:00'),
  (4, 'Noche de Paz', 'noche-de-paz', 'https://example.com/noche-de-paz.png', 4, 'Vainilla', 200, 'Marfil calido', 'Calma que ilumina tu hogar.', 14000.00, 15, TRUE, '2026-01-13 09:00:00', '2026-01-13 09:00:00'),
  (5, 'Noche de Brujas', 'noche-de-brujas', 'https://example.com/noche-de-brujas.png', 5, 'Vainilla oscura', 200, 'Ciruela profundo', 'Un toque de misterio para tus noches.', 15000.00, 10, TRUE, '2026-01-14 09:00:00', '2026-01-14 09:00:00');

-- Favoritos
INSERT INTO `favorite` (id, app_user_id, product_id, created_at) VALUES
  (1, 2, 1, '2026-02-01 10:00:00'),
  (2, 2, 3, '2026-02-01 10:05:00'),
  (3, 3, 2, '2026-02-02 11:00:00'),
  (4, 4, 4, '2026-02-03 12:00:00'),
  (5, 5, 5, '2026-02-04 13:00:00');

-- Cupones
INSERT INTO `coupon` (id, code, description, discount_type, discount_value, valid_from, valid_until, usage_limit, usage_count, active) VALUES
  (1, 'LUMINA10', 'Descuento del diez por ciento.', 'PERCENTAGE', 10.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 4, TRUE),
  (2, 'BIENVENIDA5', 'Descuento de bienvenida para nuevos clientes.', 'FIXED', 5000.00, '2026-01-01 00:00:00', '2026-06-30 23:59:59', 50, 2, TRUE),
  (3, 'NAVIDAD15', 'Descuento especial de temporada.', 'PERCENTAGE', 15.00, '2026-11-01 00:00:00', '2026-12-31 23:59:59', 80, 0, TRUE);

-- Velas personalizadas
INSERT INTO `custom_candle` (id, app_user_id, intention, scent, design_color, message, preview_image_url, price, created_at) VALUES
  (1, 2, 'Calma', 'Lavanda', 'Azul claro', 'Respira y vuelve a ti.', 'https://example.com/custom-1.png', 18000.00, '2026-02-05 14:00:00'),
  (2, 3, 'Amor', 'Rosas', 'Rosa pastel', 'Celebra lo que eres.', 'https://example.com/custom-2.png', 19000.00, '2026-02-06 15:00:00'),
  (3, 4, 'Abundancia', 'Canela', 'Dorado', 'Todo lo bueno encuentra su camino.', 'https://example.com/custom-3.png', 20000.00, '2026-02-07 16:00:00');

-- Carritos
INSERT INTO `cart` (id, app_user_id, session_token, status, created_at, updated_at) VALUES
  (1, 2, 'session-laura-001', 'ACTIVE', '2026-02-10 09:00:00', '2026-02-10 09:00:00'),
  (2, 3, 'session-carlos-001', 'ACTIVE', '2026-02-10 10:00:00', '2026-02-10 10:00:00'),
  (3, 4, 'session-maria-001', 'CONVERTED', '2026-02-10 11:00:00', '2026-02-11 11:00:00');

-- Items de carrito
INSERT INTO `cart_item` (id, cart_id, product_id, custom_candle_id, quantity, unit_price, created_at) VALUES
  (1, 1, 1, NULL, 2, 12000.00, '2026-02-10 09:10:00'),
  (2, 1, 3, NULL, 1, 12000.00, '2026-02-10 09:11:00'),
  (3, 2, 2, NULL, 1, 12000.00, '2026-02-10 10:10:00'),
  (4, 2, 4, NULL, 1, 14000.00, '2026-02-10 10:11:00'),
  (5, 3, NULL, 1, 1, 18000.00, '2026-02-10 11:10:00');

-- Pedidos
INSERT INTO `user_order` (id, order_number, app_user_id, order_status_id, subtotal, discount_total, tax_total, total, coupon_id, created_at, updated_at) VALUES
  (1, 'L-1001', 2, 4, 24000.00, 2400.00, 4104.00, 25704.00, 1, '2026-02-12 09:00:00', '2026-02-13 09:00:00'),
  (2, 'L-1002', 3, 3, 12000.00, 0.00, 2280.00, 14280.00, NULL, '2026-02-12 10:00:00', '2026-02-12 12:00:00'),
  (3, 'L-1003', 4, 2, 14000.00, 5000.00, 1710.00, 10710.00, 2, '2026-02-12 11:00:00', '2026-02-12 11:30:00'),
  (4, 'L-1004', 5, 5, 15000.00, 0.00, 2850.00, 17850.00, NULL, '2026-02-12 12:00:00', '2026-02-12 13:00:00'),
  (5, 'L-1005', 2, 1, 18000.00, 2700.00, 2907.00, 18207.00, 3, '2026-02-12 13:00:00', '2026-02-12 13:30:00');

-- Items de pedido
INSERT INTO `order_item` (id, order_id, product_id, custom_candle_id, product_name, unit_price, quantity, line_total) VALUES
  (1, 1, 1, NULL, 'Renacer', 12000.00, 2, 24000.00),
  (2, 2, 2, NULL, 'Relajacion', 12000.00, 1, 12000.00),
  (3, 3, 4, NULL, 'Noche de Paz', 14000.00, 1, 14000.00),
  (4, 4, 5, NULL, 'Noche de Brujas', 15000.00, 1, 15000.00),
  (5, 5, NULL, 2, 'Vela personalizada de Amor', 18000.00, 1, 18000.00);

-- Mensajes de contacto
INSERT INTO `contact_message` (id, app_user_id, name, email, subject, message, status, created_at) VALUES
  (1, 2, 'Laura Gomez', 'laura@lumina.test', 'Consulta sobre pedidos', 'Quiero conocer el estado de mi pedido.', 'NEW', '2026-02-15 09:00:00'),
  (2, 3, 'Carlos Rojas', 'carlos@lumina.test', 'Aromas disponibles', 'Que aromas tienen disponibles?', 'READ', '2026-02-15 10:00:00'),
  (3, 4, 'Maria Torres', 'maria@lumina.test', 'Vela personalizada', 'Quiero personalizar una vela para regalo.', 'ANSWERED', '2026-02-15 11:00:00'),
  (4, 5, 'Diego Perez', 'diego@lumina.test', 'Cambio de pedido', 'Necesito cambiar la fecha de entrega.', 'NEW', '2026-02-15 12:00:00'),
  (5, 2, 'Laura Gomez', 'laura@lumina.test', 'Reciclaje', 'Como puedo reutilizar el frasco?', 'READ', '2026-02-15 13:00:00');
