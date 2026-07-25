export async function sendOrderNotificationEmail(params: {
  reference: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  itemsList: string;
  total: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!apiKey || !senderEmail || !adminEmail) {
    console.warn(
      "Email non configure : BREVO_API_KEY, BREVO_SENDER_EMAIL ou ADMIN_NOTIFICATION_EMAIL manquant."
    );
    return;
  }

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 500px;">
      <h2 style="color: #4F6DF5;">🛒 Nouvelle commande — ${params.reference}</h2>
      <p><strong>Client :</strong> ${params.customerName}</p>
      <p><strong>Téléphone :</strong> ${params.phone}</p>
      <p><strong>Adresse :</strong> ${params.address}, ${params.city}</p>
      <hr />
      <p><strong>Articles :</strong></p>
      <pre style="white-space: pre-wrap; font-family: sans-serif;">${params.itemsList}</pre>
      <hr />
      <p style="font-size: 18px;"><strong>Total : ${params.total} FCFA</strong></p>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/commandes"
           style="background: #4F6DF5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
          Voir la commande
        </a>
      </p>
    </div>
  `;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "Tech-Assist Dakar" },
        to: [{ email: adminEmail }],
        subject: `Nouvelle commande ${params.reference} — Tech-Assist Dakar`,
        htmlContent,
      }),
    });
  } catch (err) {
    // On ne bloque jamais la commande si l'envoi email echoue
    console.error("Erreur envoi email Brevo:", err);
  }
}