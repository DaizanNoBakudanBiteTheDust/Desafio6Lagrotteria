import {
    productsModel
} from "./models/products.models.js";

export default class Products {
    constructor() {
        console.log("db trabajando")
    }

    getAll = async () => {

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
    
        if (query && queryValue) {
            filter[query] = queryValue; 
            }
    
         // Se agrega lógica para determinar el orden
         if (sort) {
            if (sort.toLowerCase() === 'asc') {
                
                options.sort = { precio: 'asc' };
            } else if (sort.toLowerCase() === 'desc') {
                options.sort = { precio: 'desc' };
            }
        }
    
        // se agregan parametros de paginacion
    
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate(filter, options);
        const products = docs;

        return products;
        
    }

    save = async (product) => {

        const existingProduct = await productsModel.findOne({
            code: product.code
        });

        if (existingProduct) {
           console.log("producto existe con ese codigo");
            };
        
        // se agrega el producto

        const result = await productsModel.create(product);

        return result;
    }

    delete = async (id, product) => {
        const result = await productsModel.deleteOne({_id : id}, product);
        return result;
    }
    getProductById = async (id) => {

        const product = await productsModel.findOne({ _id: id}).lean();
        
        if (!product) {
            throw new Error('Producto no encontrado');

        } 
        return product;


    }
}