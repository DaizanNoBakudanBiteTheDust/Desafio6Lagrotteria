// dependencia de los NPM
import {
    promises
} from 'fs'

import { productsFilePath } from '../../utils.js';


class ProductManager {
    constructor(path) {
        this.path = path;
    }


    // obtencion productos devuelve arreglo vacio si no hay 

    getProducts = async () => {
        try {
            const products = await promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    //Creo productos

    addProducts = async (producto) => {
        // Obtiene productos
        try {
            const products = await this.getProducts();

            const existingProduct = products.find((p) => p.id === producto.id);
            // verifica si existe
            if (existingProduct) {
                console.log("El producto existe");
                return null;
            }
            // se agrega el producto
            products.push(producto);

            await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return producto;

        } catch (error) {
            console.log(error);
            return null
        }
    }

    // Obtiene por ID

    getProductById = async (idProduct) => {

        const products = await this.getProducts();

        const indexProduct = products.findIndex(product => product.id === idProduct);

        if (indexProduct === -1) {
            return console.log('Producto no encontrado');

        } else {
            return products[indexProduct]
        }


    }


    // Borra producto
    deleteProductById = async (idProduct) => {

        const products = await this.getProducts();

        const indexProduct = products.findIndex(product => product.id === idProduct);

        if (indexProduct === -1) {
            return console.log('Producto no encontrado');

        } else {
            // Elimina producto
            products.splice(indexProduct, 1);

            await promises.writeFile(this.path, JSON.stringify(products, null, 4));

            console.log('Producto eliminado con éxito');
            return true;
        }
    }

    // Actualiza productos

    updateProduct = async (idProduct, updatedProduct) => {
        const products = await this.getProducts();
        const indexProduct = products.findIndex(product => product.id === idProduct);

        if (indexProduct === -1) {
            console.log("No existe el producto")
        } else {
            products[indexProduct] = {
                ...products[indexProduct], // Copia todas las propiedades del producto existente
                ...updatedProduct, // Copia todas las propiedades del producto actualizado
            }

            await promises.writeFile(this.path, JSON.stringify(products, null, 4));

        }

    }

}

export default ProductManager