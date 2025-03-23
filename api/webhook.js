const axios = require("axios");

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
// const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN; // futuro uso

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente.");
      res.status(200).send(challenge);
    } else {
      console.error("❌ Verificación fallida.");
      res.sendStatus(403);
    }
  } else if (req.method === "POST") {
    console.log("📩 Evento recibido:", JSON.stringify(req.body, null, 2));

    if (req.body.entry) {
      for (const entry of req.body.entry) {
        const messagingEvents = entry.messaging || entry.changes || [];

        for (const event of messagingEvents) {
          const senderId = event.sender?.id || event?.value?.sender_id;
          const text = event.message?.text?.toLowerCase();

          if (senderId && text) {
            console.log(`📩 Mensaje recibido de ${senderId}: ${text}`);
            await manejarMensaje(senderId, text);
          }
        }
      }
    }

    res.sendStatus(200);
  } else {
    res.setHeader("Allow", "GET, POST");
    res.status(405).end("Method Not Allowed");
  }
};

async function manejarMensaje(senderId, text) {
  if (text.includes("menu") || text.includes("menú")) {
    await enviarMensaje(senderId, "📋 *Menú para llevar:* \n\n1Kg de cochinita, relleno negro, lomo adobado o lechón - *$460*\n1/2 Kg - *$230*\n\nExtras:\n- Sopa de lima 1Lt - *$95*\n- Tortilla panucho - *$6*\n- Cebolla/salsa/crema (200g) - *$27*\n\nMás info 👉 [elchel.mx](https://elchel.mx)");
  } else if (text.includes("promocion") || text.includes("oferta")) {
    await enviarMensaje(senderId, "🎉 *Promos de miércoles:* 2x1 en tacos, panuchos, tostadas y tortas (cochinita, sin queso).");
  } else if (text.includes("ubicacion") || text.includes("sucursal")) {
    await enviarMensaje(senderId, "📍 *Sucursales El Chel:*\n\n🏠 *Matriz*: División del Nte. 4405\n🏠 *Cuemanco*: Cañaverales 39\n🏠 *Express*: Miguel Hidalgo 5\n\n[elchel.mx](https://elchel.mx)");
  } else if (text.includes("contacto") || text.includes("redes")) {
    await enviarBotones(senderId, "📱 *Contacto y redes:*", [
      { title: "Facebook", url: "https://www.facebook.com/profile.php?id=61572273834288" },
      { title: "Instagram", url: "https://www.instagram.com/elchel_oficial/" },
      { title: "Página Oficial", url: "https://elchel.mx" }
    ]);
  } else {
    await enviarBotones(senderId, "👋 ¡Hola! Soy el chatbot de *El Chel*. ¿En qué te ayudo?", [
      { title: "Ver menú 📋", payload: "MENU" },
      { title: "Promociones 🎉", payload: "PROMOCIONES" },
      { title: "Ubicaciones 📍", payload: "UBICACIONES" },
      { title: "Contacto 📱", payload: "CONTACTO" }
    ]);
  }
}

async function enviarMensaje(senderId, mensaje) {
  try {
    await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${FB_ACCESS_TOKEN}`, {
      recipient: { id: senderId },
      message: { text: mensaje }
    });
    console.log("✅ Mensaje enviado.");
  } catch (error) {
    console.error("❌ Error enviando mensaje:", error.response?.data || error.message);
  }
}

async function enviarBotones(senderId, mensaje, botones) {
  try {
    const elements = botones.map(btn => ({
      title: btn.title,
      buttons: [{ type: "web_url", url: btn.url, title: "Abrir" }]
    }));

    await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${FB_ACCESS_TOKEN}`, {
      recipient: { id: senderId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements
          }
        }
      }
    });
    console.log("✅ Botones enviados.");
  } catch (error) {
    console.error("❌ Error enviando botones:", error.response?.data || error.message);
  }
}
