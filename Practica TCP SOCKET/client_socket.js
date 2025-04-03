const net = require('net');

// Conectar al servidor en la dirección IP del servidor y el puerto 8080
const client = net.createConnection({ host: '172.17.107.157', port: 8080 }, () => {
    console.log('Conectado al servidor.');

    // Enviar un mensaje al servidor cuando el usuario escribe en la terminal
    process.stdin.on('data', (data) => {
        client.write(data);
    });
});

// Recibir datos del servidor
client.on('data', (data) => {
    console.log('Mensaje del servidor: ' + data);
});

// Manejar la desconexión del servidor
client.on('end', () => {
    console.log('Desconectado del servidor.');
});

// Manejar errores
client.on('error', (err) => {
    console.log(`Error en la conexión: ${err.message}`);
});