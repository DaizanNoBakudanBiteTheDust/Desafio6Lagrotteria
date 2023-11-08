import {
    Router
} from 'express'
// import { productsFilePath } from '../../utils.js';

//import ProductManager from '../../dao/fileManagers/productManager.js';
import Products from '../../dao/dbManagers/products.manager.js';
import Carts from '../../dao/dbManagers/cart.manager.js';
import Messages from '../../dao/dbManagers/message.manager.js'

import {
    productsModel
} from "../../dao/dbManagers/models/products.models.js";

const router = Router();

const prodManager = new Products();
const cartManager = new Carts();
const chatManager = new Messages();

router.get('/', async (req, res) => { 
    
    res.render('home', { products: await prodManager.getAll() });
    
});

router.get('/realTimeProducts', async (req, res) => { 
    res.render('realTimeProducts', { products: await prodManager.getAll() });
});

router.get('/products', async (req, res) => { 
  
    const limit = parseInt(req.query.limit) || 10; 
    const page = parseInt(req.query.page) || 1;    
    const sort = req.query.sort || null; 
    const query = req.query.query || null;
    const queryValue = req.query.queryValue || null;

     // Configurar las opciones de búsqueda
     const options = {
        limit,
        page,
        lean: true
    };

    if (sort !== null) {
    options.sort = sort; // Aplica el valor de sort solo si no es null
    }

    const filter = {};

    if (query !== null && queryValue !== null) {
        filter[query] = queryValue; // Aplica el valor de sort solo si no es null
        }

     // Se agrega lógica para determinar el orden
     if (sort !== null) {
        if (sort.toLowerCase() === 'asc') {
            
            options.sort = { precio: 'asc' };
        } else if (sort.toLowerCase() === 'desc') {
            options.sort = { precio: 'desc' };
        }
    }

    // se agregan parametros de paginacion

    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(filter, options);
    
    res.render('products', { 
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit: limit,
        page,
        query,
        sort });

});

router.get('/realTimeCarts', async (req, res) => { 
    res.render('realTimeCarts', { carts: await cartManager.getAll() });
});

router.get('/cart', async (req, res) => { 
    const cartById = '6548f637d8891916f4b7065b';
    const cartData = await cartManager.getCartById({_id: cartById});

    const transformedData = cartData.products.map(product => ({
        product: product.product, // Ajusta según tu estructura real
        quantity: product.quantity,
        _id: product._id
      }));

    
    // Comprueba si el carrito se encontró
    if (!cartData) {
        return res.status(404).send('Carrito no encontrado');
    }

    const products = transformedData;

    console.log(products);

    res.render('cartId', { cartProducts: products });
});

router.get('/chat', async (req, res) => { 
    res.render('chat', { chat: await chatManager.getAll() });
});


export default router;