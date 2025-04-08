const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 12345;
const HOST = '0.0.0.0';

server.on('message', (msg, rinfo) => {
    console.log(`Servidor recibió: ${msg} desde ${rinfo.address}:${rinfo.port}`);

    const response = `Respuesta del servidor: ${msg}`;
    server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
            console.error('Error al enviar respuesta:', err);
        } else {
            console.log(`Respuesta enviada a ${rinfo.address}:${rinfo.port}`);
        }
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Servidor UDP Andrey Gutierrez Arce escuchando en ${address.address}:${address.port}`);
});

server.bind(PORT, HOST);
