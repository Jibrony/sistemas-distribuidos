const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

let normalQueue = [];
let vipQueue = [];

app.post("/order", (req, res) => {
    const { cliente, platillo, vip } = req.body;
    if (!cliente || !platillo) return res.status(400).send("Faltan datos");

    const pedido = { cliente, platillo, vip };

    if (vip) {
        vipQueue.push(pedido);
    } else {
        normalQueue.push(pedido);
    }

    console.log(`📝 Pedido recibido: ${JSON.stringify(pedido)}`);

    io.emit("actualizarColas", {
        vipQueue,
        normalQueue
    });

    res.send("Pedido enviado a la cola");
});

async function procesarPedidos() {
    while (true) {
        let pedido = null;

        if (vipQueue.length > 0) {
            pedido = vipQueue.shift();
        } 
        if (!pedido && normalQueue.length > 0) {
            pedido = normalQueue.shift();
        }

        if (pedido) {
            const { cliente, platillo, vip } = pedido;
            console.log(`👨‍🍳 Preparando: ${cliente} (${vip ? "VIP" : "Normal"})`);

            await new Promise((r) => setTimeout(r, 4000));

            console.log(`✅ Pedido listo: ${cliente}`);
            io.emit("pedidoListo", { cliente, platillo, vip });
        } else {
            await new Promise((r) => setTimeout(r, 2000));
        }
    }
}

io.on("connection", () => {
    console.log("📡 Dashboard conectado");
});

server.listen(3001, "0.0.0.0", () => {
    console.log("🟢 Servidor corriendo en http://<IP_LOCAL>:3001");
    procesarPedidos();
});
