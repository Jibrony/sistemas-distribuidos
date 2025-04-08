const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const PORT = 12345;
const HOST = '192.168.1.135';

const message = Buffer.from('Hola, servidor UDP!');

// Simulación de pérdida de paquete
const shouldSendMessage = Math.random() > 0.5;

if (shouldSendMessage) {
    client.send(message, 0, message.length, PORT, HOST, (err) => {
        if (err) {
            console.error('Error al enviar mensaje:', err);
        } else {
            console.log('Mensaje enviado al servidor');
        }
    });

    client.on('message', (msg, rinfo) => {
        console.log(`Respuesta del servidor: ${msg}`);
        client.close();
    });

} else {
    console.log('Mensaje no enviado (simulando pérdida de paquete)');
    client.close();
}