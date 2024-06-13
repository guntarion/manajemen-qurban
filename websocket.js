const WebSocket = require("ws");
const { getInventory, getTimbang } = require("./database/db");

const wss = new WebSocket.Server({ noServer: true }); // We'll attach this to the HTTP server in app.js

async function broadcastInventoryUpdate() {
  try {
    console.log("Fetching inventory data...");
    const inventory = await getInventory();
    const inventoryMap = {};
    inventory.forEach((item) => {
      inventoryMap[item.name] = item.hasil;
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
      timbangMap[item.name] = item.hasil;
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
