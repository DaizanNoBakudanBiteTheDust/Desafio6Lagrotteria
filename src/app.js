//dependencias
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import {
        Server
} from 'socket.io';
import cookieParser, { signedCookie } from 'cookie-parser';
import session from 'express-session';
import fileStore from 'session-file-store';

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



// const manager = new ProductManager(productsFilePath);
  const prodManager = new Products();
  const cartManager = new Carts();
  const chatManager = new Messages();



const fileStr = fileStore(session);

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
        store: new fileStr({
                path: `${__dirname}/sessions`,
                ttl: 360,
                retries: 0    
        }),
        secret: 'c0d3rS3cr3tC0d',
        resave: true,
        saveUninitialized: false,
      ///  cookie: {  maxAge: 30000  }
}));

function auth(req, res, next) {
        if(req.session?.user === 'pepe' && req.session?.admin) {
            return next();
        }
    
        return res.status(401).send('Error de validación de permisos');
    }

//cookie parser
/*
app.use(cookieParser("c0d3rS3cr3tC0d"));

app.get('/cookies', (req,res) => {
        res.cookie('coderCookie', 'Esta es una coder Cookie', {maxAge: 10000})
        .send('cookie configurada correctamente');
});

app.get('/all-cookies', (req,res) => {
        res.send(req.cookies);
});
*/
app.get('/session', (req, res) => {
        if(req.session.counter) {
            req.session.counter++;
            res.send(`Se ha vistido el sitio ${req.session.counter} veces`)
        } else {
            req.session.counter = 1;
            res.send('Bienvenido');
        }
    });

app.get('/login', (req, res) => {
        const { username, password } = req.query;
    
        if(username !== 'pepe' || password !== 'pepepass') {
            return res.status(401).send('Login fallido');
        }
    
        req.session.user = username;
        req.session.admin = true;
        res.send('Login exitoso');
    });

app.get('/private', auth, (req, res) => {
        res.send('Tienes permisos para acceder a este servicio');
    });

    app.get('/logout', (req, res) => {
        req.session.destroy(error => {
            if(!error) res.send('Logout exitoso')
            else res.send({ status: 'error', message: error.message });
        })
    });

/*app.get('/signed-cookie', (req,res) => {
        res.cookie('coderSignedCookie', 'Cookie firmada', {maxAge: 30000, signed: true})
        .send('cookie configurada correctamente');
});

app.get('/delete-cookies', (req,res) => {
        res.clearCookie('coderCookie').send('cookie Eliminada')
})

app.get('/all-signed-Cookies', (req,res) => {
        res.send(req.signedCookies);
});
*/

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