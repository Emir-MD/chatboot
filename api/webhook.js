
/*import axios from "axios";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "chatbotElChel2024";
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || "A1b2C3d4E5f6G7h7";

// 👉 Manejo de mensajes
async function manejarMensaje(senderId, text) {
  if (text.includes("menu") || text.includes("menú")) {
    await enviarMensaje(senderId, "📋 *Menú para llevar:* \n\n1Kg de cochinita... [elchel.mx](https://elchel.mx)");
  } else if (text.includes("promocion") || text.includes("oferta")) {
    await enviarMensaje(senderId, "🎉 *Promociones de los miércoles:* 2x1...");
  } else if (text.includes("ubicacion") || text.includes("sucursal")) {
    await enviarMensaje(senderId, "📍 *Sucursales de El Chel:*\n\n🏠 *Matriz* ...");
  } else if (text.includes("contacto") || text.includes("redes")) {
    await enviarBotones(senderId, "📱 *Redes sociales:*", [
      { title: "Facebook", url: "https://www.facebook.com/profile.php?id=61572273834288" },
      { title: "Instagram", url: "https://www.instagram.com/elchel_oficial/" },
      { title: "Página Oficial", url: "https://elchel.mx" }
    ]);
  } else {
    await enviarBotones(senderId, "¡Hola! 👋 Soy el chatbot de *El Chel*", [
      { title: "Ver el menú 📋", url: "https://elchel.mx" },
      { title: "Promociones 🎉", url: "https://elchel.mx" },
      { title: "Ubicaciones 📍", url: "https://elchel.mx" },
      { title: "Contacto 📱", url: "https://elchel.mx" }
    ]);
  }
}

// 👉 Enviar texto
async function enviarMensaje(senderId, mensaje) {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${FB_ACCESS_TOKEN}`,
      {
        recipient: { id: senderId },
        message: { text: mensaje },
      }
    );
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error.response?.data || error.message);
  }
}

// 👉 Enviar botones
async function enviarBotones(senderId, mensaje, botones) {
  try {
    let elements = botones.map(btn => ({
      title: btn.title,
      buttons: [{ type: "web_url", url: btn.url, title: "Abrir" }],
    }));

    await axios.post(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${FB_ACCESS_TOKEN}`,
      {
        recipient: { id: senderId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        },
      }
    );
  } catch (error) {
    console.error("❌ Error enviando botones:", error.response?.data || error.message);
  }
}

// ✅ Función exportada que maneja GET (verificación) y POST (mensajes)
export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente.");
      res.status(200).send(challenge);
    } else {
      res.status(403).send("❌ Token inválido");
    }
  } else if (req.method === "POST") {
    console.log("📩 Evento recibido:", JSON.stringify(req.body, null, 2));

    if (req.body.entry) {
      for (const entry of req.body.entry) {
        if (entry.messaging) {
          for (const event of entry.messaging) {
            const senderId = event.sender.id;

            if (event.message?.text) {
              const text = event.message.text.toLowerCase();
              await manejarMensaje(senderId, text);
            }
          }
        }
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
*/
export default function handler(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "chatbotElChel2024";

  if (req.method === "GET") {
    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Token inválido");
    }
  }

  return res.status(405).send("Método no permitido");
}
