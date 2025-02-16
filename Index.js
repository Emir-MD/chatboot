const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot de El Chel está activo 🚀");
});

// Verificación del Webhook de Meta (Facebook, Instagram, WhatsApp)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook para recibir mensajes de WhatsApp, Facebook e Instagram
app.post("/webhook", async (req, res) => {
  console.log("Evento recibido:", JSON.stringify(req.body, null, 2));

  if (req.body.entry) {
    req.body.entry.forEach(entry => {
      if (entry.messaging) {
        entry.messaging.forEach(async event => {
          const senderId = event.sender.id;
          if (event.message) {
            const text = event.message.text;
            console.log(`Mensaje recibido de ${senderId}: ${text}`);

            await enviarMensaje(senderId, "¡Hola! Soy el chatbot de *El Chel* 🍽️. ¿Cómo puedo ayudarte?");
          }
        });
      }
    });
  }

  res.sendStatus(200);
});

// Función para enviar mensajes
async function enviarMensaje(senderId, mensaje) {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${process.env.FB_ACCESS_TOKEN}`,
      {
        recipient: { id: senderId },
        message: { text: mensaje }
      }
    );
  } catch (error) {
    console.error("Error enviando mensaje:", error.response ? error.response.data : error.message);
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
