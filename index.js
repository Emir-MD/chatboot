
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "chatbotElChel2024";
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || "A1b2C3d4E5f6G7h7";
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN || "A1b2C3d4E5f6G7h8";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "PENDIENTE"; // Para WhatsApp

// ✅ Página de inicio
app.get("/", (req, res) => {
  res.send("Chatbot de El Chel está activo 🚀");
});

// ✅ Webhook de verificación para Meta (Messenger, Instagram y WhatsApp)
app.get("/webhook", (req, res) => {
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
});

// ✅ Webhook para recibir mensajes de Messenger e Instagram
app.post("/webhook", async (req, res) => {
    console.log("📩 Evento recibido:", JSON.stringify(req.body, null, 2));

    if (req.body.entry) {
        for (const entry of req.body.entry) {
            if (entry.messaging) {
                for (const event of entry.messaging) {
                    const senderId = event.sender.id;
                    
                    if (event.message && event.message.text) {
                        const text = event.message.text.toLowerCase();
                        console.log(`📩 Mensaje recibido de ${senderId}: ${text}`);

                        await manejarMensaje(senderId, text);
                    }
                }
            }
        }
    }

    res.sendStatus(200);
});

// ✅ Función para manejar mensajes según la opción elegida
async function manejarMensaje(senderId, text) {
    if (text.includes("menu") || text.includes("menú")) {
        await enviarMensaje(senderId, "📋 *Menú para llevar:* \n\n1Kg de cochinita, relleno negro, lomo adobado o lechón - *$460*\n1/2 Kg de cochinita, relleno negro, lomo adobado o lechón - *$230*\n\nExtras:\n- Sopa de lima 1Lt - *$95*\n- Tortilla para panucho (1 pieza) - *$6*\n- Orden de cebolla morada, salsa de escabeche o crema de habanero (200g) - *$27*\n\nMás información en 👉 [elchel.mx](https://elchel.mx)");
    } else if (text.includes("promocion") || text.includes("oferta")) {
        await enviarMensaje(senderId, "🎉 *Promociones de los miércoles:* \n✅ *2x1* en tacos (45g), panuchos (45g), tostadas (45g) y tortas (90g).\n*Solo aplica en cochinita, sin queso.*");
    } else if (text.includes("ubicacion") || text.includes("sucursal")) {
        await enviarMensaje(senderId, "📍 *Sucursales de El Chel:*\n\n🏠 *Matriz*\n📍 Av. División del Nte. 4405, Coapa, CDMX.\n📞 55 6603 0293\n🔗 [Ver en Google Maps](https://goo.gl/maps/abcd123)\n\n🏠 *Cuemanco*\n📍 Cañaverales 39, Coapa, CDMX.\n📞 55 9278 4907\n🔗 [Ver en Google Maps](https://goo.gl/maps/abcd456)\n\n🏠 *El Chel Express*\n📍 Miguel Hidalgo 5, Arenal Tepepan, CDMX.\n📞 55 7095 2665\n🔗 [Ver en Google Maps](https://goo.gl/maps/abcd789)");
    } else if (text.includes("contacto") || text.includes("redes")) {
        await enviarBotones(senderId, "📱 *Contacto y Redes Sociales:*", [
            { title: "Facebook", url: "https://www.facebook.com/profile.php?id=61572273834288" },
            { title: "Instagram", url: "https://www.instagram.com/elchel_oficial/" },
            { title: "Página Oficial", url: "https://elchel.mx" }
        ]);
    } else {
        await enviarBotones(senderId, "¡Hola! 👋 Soy el chatbot de *El Chel* 🍽️. ¿Cómo puedo ayudarte?", [
            { title: "Ver el menú 📋", payload: "MENU" },
            { title: "Promociones 🎉", payload: "PROMOCIONES" },
            { title: "Ubicaciones 📍", payload: "UBICACIONES" },
            { title: "Contacto 📱", payload: "CONTACTO" }
        ]);
    }
}

// ✅ Función para enviar respuestas de texto
async function enviarMensaje(senderId, mensaje) {
    try {
        await axios.post(
            `https://graph.facebook.com/v17.0/me/messages?access_token=${FB_ACCESS_TOKEN}`,
            {
                recipient: { id: senderId },
                message: { text: mensaje }
            }
        );
        console.log("✅ Mensaje enviado.");
    } catch (error) {
        console.error("❌ Error enviando mensaje:", error.response ? error.response.data : error.message);
    }
}

// ✅ Función para enviar botones con enlaces
async function enviarBotones(senderId, mensaje, botones) {
    try {
        let elements = botones.map(btn => ({
            title: btn.title,
            buttons: [{ type: "web_url", url: btn.url, title: "Abrir" }]
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
                            elements: elements
                        }
                    }
                }
            }
        );
        console.log("✅ Botones enviados.");
    } catch (error) {
        console.error("❌ Error enviando botones:", error.response ? error.response.data : error.message);
    }
}

// ✅ Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
