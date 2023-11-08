import {
        Router
} from 'express';
//import ProductManager from '../../dao/fileManagers/productManager.js';
import {
        productsFilePath
} from '../../utils.js';
import { productsModel } from '../../dao/dbManagers/models/products.models.js';
import Products from '../../dao/dbManagers/products.manager.js';

// const manager = new ProductManager(productsFilePath);

const manager = new Products();

const router = Router();


//read

router.get('/', async (req, res) => {
        const products = await manager.getAll();
        res.send({
                products
        })
});

// traer todos los productos (antiguo)
/*
router.get('/', async (req, res) => {
        const products = await manager.getProducts();
        console.log(products)
        io.emit('showProducts', products);

        res.send(products);
});

// params


router.get('/', async (req, res) => {
        const products = await manager.getProducts();
        const queryParamsLimited = (req.query.limit);

        if (!queryParamsLimited) {
                res.send({
                        error: 'Error pagina no encontrada'
                })
        } else {
                if(queryParamsLimited){
                        const productsLimited = products.slice(0, queryParamsLimited)
                res.send(productsLimited)
                }else{
                        res.send(products);
                }
        };
});
*/
// postea los productos

router.post('/', async (req, res) => {

        // por ahora queda obsoleto        const products = await manager.getProducts();
        const io = req.app.get('socketio');
        const product = req.body;

        if (!product.titulo || !product.descripcion || !product.precio || !product.status || !product.thumbnail || !product.code || !product.stock || !product.category) {
                //Error del cliente
                return res.status(400).send({
                        status: 'error',
                        error: 'incomplete values'
                })
        }

        // lo utilizare por ahora pero esto debiera traerlo  manager

        try {

                // Crea un nuevo documento utilizando manager.Create
                const createdProduct = await manager.save({
                        titulo: product.titulo,
                        descripcion: product.descripcion,
                        precio: product.precio,
                        status: product.status,
                        thumbnail: product.thumbnail,
                        code: product.code,
                        stock: product.stock,
                        category: product.category
                });

                io.emit('showProducts', createdProduct);

                return res.send({
                        status: 'success',
                        message: 'product created',
                        product
                })

        } catch (error) {
                return res.status(500).send({
                        status: 'error',
                        error: error.message || 'Error al crear el producto'
                });
        }
        /*

                OBSOLETO PERO NO INUTIL

                // Obtener un array con todos los "id" existentes ( hice esto porque al eliminar productos seguia sumando indefinido y necesitaba rellenar id)
                const existingIds = products.map(p => p.id);

                // Encontrar el primer "id" que falta
                let newId = 1;
                while (existingIds.includes(newId)) {
                        newId++;
                }

                // Verificar la existencia del "code" en productos existentes
                const existingCodes = products.map(p => p.code);
                if (existingCodes.includes(product.code)) {
                        return res.status(409).send({
                                status: 'error',
                                error: 'El producto con este código ya existe.'
                        });
                }

                // Asignar el "id" encontrado al producto
                product.id = newId;


                await manager.addProducts(product);

                
                // status success
                return res.send({
                        status: 'success',
                        message: 'product created',
                        product
                })
                */
});

// Actualiza los productos

router.put('/:pid', async (req, res) => {

        // por ahora queda obsoleto   const products = await manager.getProducts();
        // Productos que haremos con Postman

        const 
               { pid }
         = req.params;

        const updateProduct = req.body;


        if (!updateProduct.titulo || !updateProduct.descripcion || !updateProduct.precio || !updateProduct.thumbnail || !updateProduct.code || !updateProduct.stock || !updateProduct.status || !updateProduct.category) {
                //Error del cliente
                return res.status(400).send({
                        status: 'error',
                        error: 'incomplete values'
                })
        }

        // agrego trycatch mientras no se usa el manager

                const result = await productsModel.updateOne({ _id: pid }, updateProduct);

                res.send({
                        status: 'success',
                        message: 'product updated',
                        result
                });
      
});
/* CODIGO OBSLETO PARA ESTA ENTREGA
        const index = products.findIndex(product => product.id === productId);

        if (index !== 1) {
                await manager.updateProduct(productId, product);
                res.send({
                        status: 'success',
                        message: 'product updated',
                        product
                });
        } else {
                //Error del cliente
                return res.status(404).send({
                        status: 'error',
                        error: 'product not found'
                })
        }
*/


// Elimina los productos

router.delete('/:pid', async (req, res) => {

      // obsoleto por ahora  const products = await manager.getProducts();
        const io = req.app.get('socketio');
        const {pid} = req.params;

        try {
                const result = await productsModel.deleteOne({ _id: pid });
                res.send({
                        status: 'success',
                        message: 'product deleted',
                        result
                });
        } catch (error) {
                return res.status(404).send({
                        status: 'error',
                        error: 'product not exist'
                })
        }

        /*
        const index = products.findIndex(product => product.id === productId);

        if (index !== -1) {
                
                const updatedProducts = await manager.getProducts();
                io.emit('showProducts', updatedProducts);
                res.send({
                        status: 'success',
                        message: 'product deleted',
                        products
                });
        } else {
                //Error del cliente
                return res.status(404).send({
                        status: 'error',
                        error: 'product not exist'
                })
        }
        */
})


export default router;