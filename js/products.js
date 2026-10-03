// Catálogo de Casa Rubí, tomado de catalogo.treinta.co/Casarubiboutique (3 oct 2026).
// Nombres limpios para la web; precios en pesos colombianos.
// Solo se incluyen los productos que tienen foto en Treinta.

const CDN = 'https://cdn.treinta.co/new-products/products/8d7cdc78-46de-5854-b377-9f041593a793/';

const CATEGORIES = {
  vestidos: 'Vestidos',
  sets: 'Sets',
  monos: 'Monos',
  tops: 'Blusas y tops',
  jeans: 'Jeans y pantalones',
};

// [nombre, categoría, precio, id de foto, detalle]
const RAW = [
  ['Vestido midi de rayas con cordones laterales', 'vestidos', 300000, '51f32dc7-e3a9-5713-b8dc-f7d9946063dc', 'Beige con rayas café'],
  ['Set manga larga marrón', 'sets', 295000, 'ee3c6d9b-fe4e-50ec-80e2-06ce02027338', 'Marrón'],
  ['Vestido midi floral con borde de vieira', 'vestidos', 250000, 'ccce47ce-ca3b-594d-9c8f-25b9ec7e7605', 'Estampado floral'],
  ['Set de dos piezas abierto adelante', 'sets', 150000, '8b93c36d-be42-5fb6-8e0b-cf83178ae89c', 'Baby blue'],
  ['Vestido de tweed con hilos dorados', 'vestidos', 180000, 'c41f532b-99f0-5efa-99d0-d907a7410487', 'Talla M'],
  ['Conjunto de falda abullonada con lunares', 'sets', 200000, 'd69ca8cd-fe47-518a-a8d5-f4f17e2b567e', 'Blanco con negro'],
  ['Mono bordado de encaje blanco', 'monos', 140000, '5a0c5819-e4e0-55aa-af84-eccc083559fe', 'Talla L'],
  ['Vestido midi de encaje con bipiur', 'vestidos', 250000, '6f474fe9-1561-5e6d-a640-0cb8e9abb58f', 'Azul claro'],

  ['Vestido midi de rayas con cordón en la cintura', 'vestidos', 280000, '94b71c5c-23cc-53da-a78a-7b4ecc52177c', 'Burgundy y natural · Talla L'],
  ['Vestido midi smock de tirantes', 'vestidos', 280000, '9b7c4a7d-1497-5516-b1e6-b360145e842c', 'Azul y beige'],
  ['Vestido midi abierto en la cintura', 'vestidos', 250000, '0474273d-5e88-5be3-a044-0d3613e1f733', 'Azul turquí'],
  ['Vestido midi de cuadros con botones', 'vestidos', 180000, '17920f35-7fa6-52a8-8928-3219d997e92f', 'Sage a cuadros'],
  ['Vestido de tweed con hilos plateados', 'vestidos', 180000, 'ef0e9ebd-4d36-558b-8a08-1f676d34abf5', 'Blanco · Talla M'],
  ['Mini vestido de tirantes floral', 'vestidos', 220000, '01bc5897-f222-52ff-9f1e-c312023b53bb', 'Estampado naranja'],
  ['Mini vestido blanco floral de cuello cuadrado', 'vestidos', 150000, '28488a28-0d70-5319-952a-1ad9522a12ae', 'Blanco'],
  ['Vestido mini corsé de rayas florales', 'vestidos', 150000, 'db87628c-e65c-5f27-a4b9-3748ee4d8842', 'Estampado'],
  ['Vestido midi con cremallera', 'vestidos', 120000, 'e19ac170-2883-58dc-87b4-49d64047977c', 'Blanco'],
  ['Vestido blanco de lunares', 'vestidos', 98000, '47ef87a8-4614-5c13-811c-0a949d4b6f4f', 'Lunares negros · Talla L'],

  ['Set manga larga beige abierto', 'sets', 250000, '4a15ae71-3620-5baf-888d-8d12e880944a', 'Beige'],
  ['Set sastre con cinturón y pantalón largo', 'sets', 250000, '567ea404-0018-59c6-835d-7a5cfda9b0a9', ''],
  ['Set pantalón cargo', 'sets', 220000, 'b072559a-3c35-5a7a-adb2-de8cc71c73f6', 'Taupe'],
  ['Set solapa manga larga', 'sets', 210000, '4ff1fb0e-d25a-51b0-8949-7503c9901e91', 'Nude'],
  ['Set de bipiur, falda y blusa', 'sets', 200000, '9c154af5-0992-5a13-854a-68ed93d7e822', 'Albaricoque · Talla M'],
  ['Set top y pantalón con botones', 'sets', 200000, '2d827004-4b82-520d-9756-44d52899b3af', 'Negro'],
  ['Set sastre anudado al cuello', 'sets', 198000, 'c2a20356-5763-5de3-b781-d185515b409c', 'Negro'],
  ['Set viajero corrugado', 'sets', 120000, 'e7e1fe67-e590-53e6-a2b4-834eeb58902e', 'Taupe'],

  ['Mono corto sin manga', 'monos', 180000, '7d471271-4872-5dda-8653-f211f8ae5b10', 'Negro · Talla S'],
  ['Mono bordado de encaje negro', 'monos', 140000, '46de1365-687f-5d45-a9ec-594edbe26012', 'Talla L'],

  ['Blazer manga larga café', 'tops', 160000, '3cd669c4-1100-5bde-b6af-88153f5576c1', 'Marrón'],
  ['Blusa sin mangas con lazos frontales', 'tops', 100000, '631e72eb-2a6b-533c-ae80-dd02f3258c04', ''],
  ['Top blanco de lunares negros', 'tops', 70000, '9d6c4295-2aea-511d-8594-aae739bbf537', 'Talla S'],
  ['Top negro de lunares blancos', 'tops', 70000, '4cafac33-9efd-536c-ae18-c93230aa2b10', 'Talla L'],
  ['Camisa manga larga con botones', 'tops', 63000, 'b76fc738-f7d6-59e3-b8b5-be33f69ea693', 'Nude'],
  ['Blusa cuello barco con cinturón', 'tops', 59500, 'f52410c1-63d3-5615-b17c-804e90a50672', 'Taupe · Talla L'],
  ['Chaleco negro con botones', 'tops', 56000, '5e906a73-daa1-5ccf-b9ac-044a260a5202', 'Talla L'],
  ['Blusa ojalillo blanca abierta', 'tops', 55000, '1c1f3353-d913-5d35-ab63-7252d30880b1', 'Talla L'],
  ['Blusa sin manga de cuello alto y botones', 'tops', 52500, '9e4a9245-0713-5f95-aee5-dbbae40afd64', 'Talla L'],
  ['Blusa de seda cuello alto sin manga', 'tops', 42000, '103fd0fb-5bf2-5c70-b855-edd1ddeaab9f', 'Plata · Talla L'],
  ['Chaleco blanco con negro abierto', 'tops', 42000, 'c5007b4e-88f1-50b6-b892-388083d41b66', 'Blanco con negro'],
  ['Body blanco de cuello cuadrado', 'tops', 42000, '2c8de965-ac62-52dd-bab4-ad947937ecc9', 'Talla XL'],
  ['Body negro de cuello cuadrado', 'tops', 42000, '5ad9ebd0-6fa6-5704-8e5a-7ca725e6620a', 'Talla XL'],
  ['Body de tiras', 'tops', 42000, '88af5e0d-9eb1-567a-bd42-d31740350646', 'Beige · Talla M'],
  ['Top interno', 'tops', 40000, 'ab811eb4-8afe-5e44-87da-7216d87f5690', ''],
  ['Chaleco con botones', 'tops', 36400, '3f61c36d-5233-531d-855d-3d68ae834f7b', 'Azul turquí'],
  ['Suéter One Day', 'tops', 35000, 'f77198ea-f4b6-518f-9e5d-dd66ae76ca63', 'Negro'],
  ['Camisa de cuadros', 'tops', 25000, 'd732478b-2927-5353-95b8-617dee86188c', 'Blanco y negro'],

  ['Jeans animal print', 'jeans', 150000, '40d42d1e-e2c1-5173-b693-5ae16d0dfd47', 'Estampado animal'],
  ['Jeans barril', 'jeans', 150000, '32ff1a5e-32a9-5f5d-a7d5-a6f837e0295d', 'Azul oscuro'],
  ['Jeans blanco de lunares negros', 'jeans', 150000, 'dd08736c-122e-50ee-ac4f-6b0a72adef17', 'Talla 6'],
  ['Jeans roto', 'jeans', 96000, '4de8a2c5-f76c-540b-9f14-a9f836da0b7c', 'Negro'],
  ['Short de tela', 'jeans', 80000, 'e4fec76d-d41d-5d3b-b97a-fc3ee60457c5', 'Marrón · Talla M'],
  ['Pantalón clásico', 'jeans', 63000, '9f559728-dc7f-580a-b9a1-dff10b8d74df', 'Marrón · Talla S'],
  ['Pantalón clásico', 'jeans', 63000, 'f9038398-08ea-5af7-95db-8217e8e533b1', 'Negro · Talla XL'],
  ['Pantalón con lazo en la pretina', 'jeans', 63000, '1039b27e-c2b2-5612-ae31-5ca3453f456b', 'Blanco · Talla L'],
];

// Treinta sirve versiones reducidas de cada foto (ancho en px) a través de su imgproxy.
const sized = (url, width) =>
  `https://imgproxy.treinta.co/sig/size:${width}:::/quality:80/plain/${encodeURIComponent(url)}`;

const PRODUCTS = RAW.map(([name, cat, price, img, detail], i) => {
  const full = CDN + img + '.jpg';
  return { id: i + 1, name, cat, price, detail, img: full, thumb: sized(full, 480) };
});
