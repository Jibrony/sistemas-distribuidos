const net = require('net');

const clients = [];

const server = net.createServer((socket) => {
    clients.push(socket);
    console.log('Cliente conectado.');

    socket.on('data', (data) => {
        console.log('Mensaje recibido: ' + data);

        clients.forEach((client) => {
            if (client !== socket) {
                client.write(data);
            }
        });
    });

    socket.on('end', () => {
        console.log('Cliente desconectado.');
        clients.splice(clients.indexOf(socket), 1);
    });

    socket.on('error', (err) => {
        console.log(`Error en la conexión: ${err.message}`);
    });
});

server.listen(8080, '0.0.0.0', () => {
    console.log('Servidor TCP Andrey Gutierrez Arce escuchando en el puerto 8080...');
});
