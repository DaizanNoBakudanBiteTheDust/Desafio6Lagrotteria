import { messagesModel } from "./models/messages.model.js";


export default class Messages {
    constructor() {
        console.log("db trabajando")
    }

    getAll = async () => {

        const chat = await messagesModel.find().lean();
        return chat;
    }

    save = async (message) => {
/*
        const existingProduct = await messagesModel.findOne({
            code: product.code
        });

        if (existingProduct) {
           console.log("producto existe con ese codigo");
            };
     */   
        // se agrega el mensaje

        const result = await messagesModel.create(message);

        return result;
    }

}