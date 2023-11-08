import { cartsModel } from "./models/carts.models.js";

export default class Carts {
    constructor(){
        console.log("db trabajando")
    }

    getAll = async () => {

        const carts = await cartsModel.find().lean();
        console.log(JSON.stringify(carts, null, '\t'));
        return carts;
    }

    save = async (cart) => {
        const result = await cartsModel.create(cart);
        return result;
    }

    update = async (id, cart) => {
        const result = await cartsModel.updateOne({_id : id}, cart);
        return result;
    }

    delete = async (id, cart) => {
        const result = await cartsModel.deleteOne({_id : id}, cart);
        return result;
    }

    getCartById = async (id) => {
        const cart = await cartsModel.findById(id);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        return cart;
    }

    getProductById = async (id) => {

        const product = await cartsModel.findById(id);

        if (!product) {
            console.log('producto no encontrado');
        }
    
        return product;

    };
    
    

    deleteProductById = async (id, cart) => {
        const product = await cartsModel.deleteOne({ _id: id}).lean();
        
        if (!product) {
            throw new Error('Producto no encontrado');

        } 
        return product;
    }
}
