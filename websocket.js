const WebSocket = require("ws");
const { getInventory, getTimbang } = require("./database/db");

const wss = new WebSocket.Server({ noServer: true }); // We'll attach this to the HTTP server in app.js

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("received: %s", message);

    if (data.type === "update-sembelih") {
      broadcastSembelihUpdate(data.id, data.sembelih);
    } else if (data.type === "update-sembelih-kambing") {
      broadcastSembelihKambingUpdate(data.id, data.sembelih);
    }
  });

  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server" }));
});

function broadcastSembelihUpdate(id, sembelih) {
  const data = {
    type: "update-sembelih",
    id,
    sembelih,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function broadcastSembelihKambingUpdate(id, sembelih) {
  const data = {
    type: "update-sembelih-kambing",
    id,
    sembelih,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}



async function broadcastInventoryUpdate() {
  try {
    console.log("Fetching inventory data...");
    const inventory = await getInventory();
    const inventoryMap = {};
    inventory.forEach((item) => {
      inventoryMap[item.name] = {
        hasil: item.hasil,
        target_value: item.target_value,
      };
    });
    const data = {
      type: "update-inventory",
      inventory: inventoryMap,
    };
    console.log("Broadcasting data:", data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error("Error broadcasting inventory update:", error);
  }
}


async function broadcastTimbangUpdate() {
  try {
    console.log("Fetching timbang data...");
    const timbang = await getTimbang();
    const timbangMap = {};
    timbang.forEach((item) => {
      timbangMap[item.name] = {
        hasil: item.hasil,
        target_value: item.target_value, // Ensure target_value is included
      };
    });
    const data = {
      type: "update-timbang",
      timbang: timbangMap,
    };
    console.log("Broadcasting data:", data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error("Error broadcasting timbang update:", error);
  }
}




module.exports = { wss, broadcastInventoryUpdate, broadcastTimbangUpdate };
