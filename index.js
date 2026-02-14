require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const { z } = require("zod");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "50kb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/contact", limiter);

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(1).max(3000),
  _hp: z.string().optional(),
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/contact", async (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const { name, email, message, _hp } = parsed.data;

    // Honeypot: se preenchido, finge sucesso e não envia email
    if (_hp && _hp.trim().length > 0) {
      return res.status(200).json({ success: true });
    }

    const htmlName = escapeHtml(name);
    const htmlEmail = escapeHtml(email);
    const htmlMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    await transport.sendMail({
      from: `Maycon Dev <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_TO,
      subject: `Novo contato do portfólio — ${name}`,
      html: `
        <h2>Novo contato do portfólio</h2>
        <p><strong>Nome:</strong> ${htmlName}</p>
        <p><strong>Email:</strong> ${htmlEmail}</p>
        <p><strong>Mensagem:</strong><br/>${htmlMessage}</p>
      `,
      text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao enviar email" });
  }
});

const port = Number(process.env.PORT || 3000);

app.listen(port, "0.0.0.0", () => {
  console.log(`API rodando na porta ${port}`);
});
