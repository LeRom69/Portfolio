/**
 * Cloudflare Worker: Contact form backend
 *
 * Требуется:
 *  - KV namespace, привязанный как RATE_LIMIT_KV (для лимита запросов)
 *  - npm-пакет "worker-mailer" (SMTP-клиент поверх cloudflare:sockets)
 *      npm install worker-mailer
 *
 * Переменные окружения (обычные, в [vars] wrangler.toml):
 *  - SMTP_HOST, SMTP_PORT
 *  - RECEIVER_EMAIL
 *  - CLIENT_ORIGIN
 *
 * Секреты (wrangler secret put ... / .dev.vars локально):
 *  - SMTP_USER, SMTP_PASS
 *  - TURNSTILE_SECRET_KEY   (опционально — если не задан, капча пропускается)
 *
 * Важно: Cloudflare Workers блокируют исходящие соединения на порт 25.
 * 587 (STARTTLS) и 465 (implicit TLS) — поддерживаются штатно.
 */

import { WorkerMailer } from "worker-mailer";

const MESSAGES = {
  EN: {
    tooManyRequests: "Too many requests. Please try again later.",
    invalidName: "Please enter your name",
    invalidEmail: "Invalid email address",
    invalidMessage: "Please enter your message",
    captchaFailed: "Could not verify you're not a robot. Please try again.",
    sendFailed: "Failed to send the message. Please try again later.",
    emailSubject: (name) => `New message from ${name}`,
    emailFieldName: "Name",
    emailFieldEmail: "Email",
    emailFieldProjectType: "Project type",
    emailFieldMessage: "Message",
  },
  UA: {
    tooManyRequests: "Забагато запитів. Спробуйте пізніше.",
    invalidName: "Введіть ім'я",
    invalidEmail: "Некоректний email",
    invalidMessage: "Введіть повідомлення",
    captchaFailed: "Не вдалося підтвердити, що ви не робот. Спробуйте ще раз.",
    sendFailed: "Не вдалося надіслати повідомлення. Спробуйте пізніше.",
    emailSubject: (name) => `Нове повідомлення з сайту від ${name}`,
    emailFieldName: "Ім'я",
    emailFieldEmail: "Email",
    emailFieldProjectType: "Тип проєкту",
    emailFieldMessage: "Повідомлення",
  },
};

const RATE_LIMIT_WINDOW_SECONDS = 15 * 60; // 15 минут
const RATE_LIMIT_MAX = 10;

function getLang(request, body) {
  const raw = (body && body.lang) || request.headers.get("x-lang") || "EN";
  const lang = String(raw).toUpperCase();
  return MESSAGES[lang] ? lang : "EN";
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.CLIENT_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-lang",
  };
}

function jsonResponse(data, status, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// простая защита от XSS в письме
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Проверка токена Cloudflare Turnstile.
// Если секретный ключ не задан в env — капча считается отключённой.
async function verifyCaptcha(token, ip, env) {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (ip) params.append("remoteip", ip);

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await verifyRes.json();
  return Boolean(data.success);
}

// Рейт-лимит на базе KV: счётчик запросов на IP с TTL-окном.
async function checkRateLimit(ip, env) {
  const key = `rl:${ip}`;
  const current = await env.RATE_LIMIT_KV.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= RATE_LIMIT_MAX) {
    return false;
  }

  await env.RATE_LIMIT_KV.put(key, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });
  return true;
}

// Отправка письма по SMTP через worker-mailer (использует cloudflare:sockets).
async function sendEmail({ name, email, projectType, message, lang }, env) {
  const m = MESSAGES[lang];
  const port = Number(env.SMTP_PORT) || 587;

  const mailer = await WorkerMailer.connect({
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // implicit TLS для 465, STARTTLS для остальных (587 и т.д.)
    credentials: {
      username: env.SMTP_USER,
      password: env.SMTP_PASS,
    },
    authType: "plain",
  });

  await mailer.send({
    from: { name: "Contact Form", email: env.SMTP_USER },
    to: { email: env.RECEIVER_EMAIL || env.SMTP_USER },
    replyTo: email,
    subject: m.emailSubject(name),
    text: `
${m.emailFieldName}: ${name}
${m.emailFieldEmail}: ${email}
${m.emailFieldProjectType}: ${projectType || "-"}

${m.emailFieldMessage}:
${message}
    `.trim(),
    html: `
      <h2>${m.emailSubject(name)}</h2>
      <p><b>${m.emailFieldName}:</b> ${escapeHtml(name)}</p>
      <p><b>${m.emailFieldEmail}:</b> ${escapeHtml(email)}</p>
      <p><b>${m.emailFieldProjectType}:</b> ${escapeHtml(projectType || "-")}</p>
      <p><b>${m.emailFieldMessage}:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `,
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response("Contact form backend is running", {
        headers: corsHeaders(env),
      });
    }

    if (url.pathname === "/api/contact" && request.method === "POST") {
      let body = {};
      try {
        body = await request.json();
      } catch {
        // пустое/битое тело — провалится на валидации ниже
      }

      const lang = getLang(request, body);
      const m = MESSAGES[lang];
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";

      // --- рейт-лимит ---
      const allowed = await checkRateLimit(ip, env);
      if (!allowed) {
        return jsonResponse({ error: m.tooManyRequests }, 429, env);
      }

      const { name, email, projectType, message, captchaToken } = body;

      // --- валидация ---
      if (!name || !name.trim()) {
        return jsonResponse({ error: m.invalidName }, 400, env);
      }
      if (!email || !isValidEmail(email)) {
        return jsonResponse({ error: m.invalidEmail }, 400, env);
      }
      if (!message || !message.trim()) {
        return jsonResponse({ error: m.invalidMessage }, 400, env);
      }

      // --- проверка капчи ---
      const captchaOk = await verifyCaptcha(captchaToken, ip, env);
      if (!captchaOk) {
        return jsonResponse({ error: m.captchaFailed }, 400, env);
      }

      // --- письмо ---
      try {
        await sendEmail({ name, email, projectType, message, lang }, env);
        return jsonResponse({ ok: true }, 200, env);
      } catch (err) {
        console.error("Send error:", err);
        return jsonResponse({ error: m.sendFailed }, 500, env);
      }
    }

    return new Response("Not found", { status: 404, headers: corsHeaders(env) });
  },
};