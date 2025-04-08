import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://192.168.1.135:3001"); 

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [vipQueue, setVipQueue] = useState([]);
  const [normalQueue, setNormalQueue] = useState([]);

  // Estados del formulario
  const [cliente, setCliente] = useState('');
  const [platillo, setPlatillo] = useState('');
  const [vip, setVip] = useState(false);

  useEffect(() => {
    socket.on("pedidoListo", (pedido) => {
      setPedidos((prev) => [...prev, pedido]);
    });

    socket.on("actualizarColas", ({ vipQueue, normalQueue }) => {
      setVipQueue(vipQueue);
      setNormalQueue(normalQueue);
    });

    return () => {
      socket.off("pedidoListo");
      socket.off("actualizarColas");
    };
  }, []);

  const enviarPedido = async (e) => {
    e.preventDefault();
    if (!cliente || !platillo) return alert("Faltan datos");

    try {
      await fetch("http://192.168.1.135:3001/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cliente, platillo, vip })
      });

      setCliente('');
      setPlatillo('');
      setVip(false);
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Error al enviar el pedido");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Cliente Andrey Julian Gutierrez Arce</h1>
      <h2>📦 Nuevo Pedido</h2>
      <form onSubmit={enviarPedido} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Platillo"
          value={platillo}
          onChange={(e) => setPlatillo(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <label style={{ marginRight: 10 }}>
          <input
            type="checkbox"
            checked={vip}
            onChange={(e) => setVip(e.target.checked)}
          /> VIP
        </label>
        <button type="submit">Enviar</button>
      </form>

      <h2>🍽️ Pedidos Listos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos listos.</p>
      ) : (
        <ul>
          {pedidos.map((p, i) => (
            <li key={i}>
              <strong>{p.cliente}</strong> - {p.platillo} ({p.vip ? "VIP" : "Normal"})
            </li>
          ))}
        </ul>
      )}

      <h3>📋 En cola (VIP)</h3>
      <ul>
        {vipQueue.map((p, i) => (
          <li key={i}>{p.cliente} - {p.platillo}</li>
        ))}
      </ul>

      <h3>📋 En cola (Normal)</h3>
      <ul>
        {normalQueue.map((p, i) => (
          <li key={i}>{p.cliente} - {p.platillo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;