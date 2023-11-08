//dependencias
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import {
        Server
} from 'socket.io';
import cookieParser, { signedCookie } from 'cookie-parser';
import session from 'express-session';

//dependencias de ruta

import {
        __dirname
}
from './utils.js';
import productRouter from './routes/api/products.router.js';
import cartRouter from './routes/api/cart.router.js';
import chatRouter from './routes/api/message.router.js';
import viewsRouter from './routes/web/views.router.js';

//Managers para el socket

import Products from './dao/dbManagers/products.manager.js';
import Carts from './dao/dbManagers/cart.manager.js';
import Messages from './dao/dbManagers/message.manager.js';


// import ProductManager from './dao/fileManagers/productManager.js';


// const manager = new ProductManager(productsFilePath);
  const prodManager = new Products();
  const cartManager = new Carts();
  const chatManager = new Messages();



// Crea server express
const app = express();

//Servidor archivos estaticos

app.use(express.static(`${__dirname}/public`));

//middleware
app.use(express.json({}));
app.use(express.urlencoded({
        extended: true
}));

//session

app.use(session({
        secret: ''
}))

//cookie parser

app.use(cookieParser("c0d3rS3cr3tC0d"));
app.get('/cookies', (req,res) => {
        res.cookie('coderCookie', 'Esta es una coder Cookie', {maxAge: 10000})
        .send('cookie configurada correctamente');
});

app.get('/all-cookies', (req,res) => {
        res.send(req.cookies);
});

app.get('/signed-cookie', (req,res) => {
        res.cookie('coderSignedCookie', 'Cookie firmada', {maxAge: 30000, signed: true})
        .send('cookie configurada correctamente');
});

app.get('/delete-cookies', (req,res) => {
        res.clearCookie('coderCookie').send('cookie Eliminada')
})

app.get('/all-signed-Cookies', (req,res) => {
        res.send(req.signedCookies);
});

// handlebars

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');


// Conexion DB
try {
        // string de Conexion
        await mongoose.connect('mongodb+srv://Glagrotteria:oaRHHBM4KzeYZAZI@eccomerce.62qj1ur.mongodb.net/eccomerce?retryWrites=true&w=majority');
        console.log("conectado")
} catch (error) {
        console.log("conexion fallida")
}


// Ruta view
app.use('/', viewsRouter);


// Llama a la ruta de product Router (Todo lo hecho hasta ahora)
app.use('/api/products', productRouter);

// Ruta carts
app.use('/api/carts', cartRouter);

// Ruta chat
app.use('/api/chat', chatRouter);

const server = app.listen(8080, () => console.log('listening en 8080'));

// IO

const io = new Server(server)

app.set('socketio', io);

const chatText = [];

io.on('connection', socket => {

        //agrego producto via form
        socket.on('agregarProducto', async data => {
                await prodManager.save(data);
                io.emit('showProducts', await prodManager.getAll());
        });

         //elimino via form que me pasa el cliente
         socket.on('eliminarProducto', async (data) => {

                const _id = data
                await prodManager.delete(_id);
                io.emit('showProducts', await prodManager.getAll());

        });

        socket.on('message', async data => {
                await chatManager.save(data);
                io.emit('showChats', await chatManager.getAll());
        });    


});