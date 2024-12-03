# Ecommerce-Harbouki
Servidor desarrollado con express.js y MongoDD. 
Conecta el servidor con la base de datos para traer de ella una coleccion de productos y una coleccion de carritos. 

- Los productos se pueden visualizar en la web mediante una pagina de vistas renderizada con handlebars, que muestra un listado de los productos y permite mediante paginacion visualizar todos los productos. Incluye el filtrado de estos productos con limitacion de pagina, o por querys.

- Las rutas principales son /api/products y /api/carts. Tanto los productos como los carritos, cuentan con su propio Manager para poder realizar las operaciones de CRUD correspondientes, definiendo para cada uno un model que define el esquema de los productos y el esquema de los carritos.
