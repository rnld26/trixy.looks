// ============================================================
//  TRIXY.LOOKS — Cloudflare Worker
//  Handles: PIN auth + KV API (produk, jual, pengeluaran)
// ============================================================

const CORRECT_PIN = "222615"; // <-- GANTI PIN DI SINI

// ── CORS headers ──────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-PIN",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function checkPin(request) {
  const pin = request.headers.get("X-PIN");
  return pin === CORRECT_PIN;
}

// ── Main Handler ──────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── API routes ──────────────────────────────────────
    if (path.startsWith("/api/")) {

      // PIN check untuk semua API
      if (!checkPin(request)) {
        return json({ error: "PIN salah" }, 401);
      }

      // GET /api/verify-pin  → cek pin valid
      if (path === "/api/verify-pin" && request.method === "GET") {
        return json({ ok: true });
      }

      const key = path.replace("/api/", ""); // "produk" | "jual" | "pengeluaran"
      const VALID_KEYS = ["produk", "jual", "pengeluaran"];
      if (!VALID_KEYS.includes(key)) return json({ error: "Not found" }, 404);

      // GET → ambil data
      if (request.method === "GET") {
        const raw = await env.TRIXY_KV.get(key);
        return json(raw ? JSON.parse(raw) : []);
      }

      // POST → simpan data (body = array penuh)
      if (request.method === "POST") {
        const body = await request.json();
        await env.TRIXY_KV.put(key, JSON.stringify(body));
        return json({ ok: true });
      }

      // DELETE → hapus semua data key tertentu
      if (request.method === "DELETE") {
        await env.TRIXY_KV.put(key, JSON.stringify([]));
        return json({ ok: true });
      }
    }

    // ── Serve HTML ────────────────────────────────────
    // Semua route selain /api/ → serve index.html
    // (file HTML kamu harus di-serve dari sini atau lewat Pages)
    // Kalau pakai Workers + Assets, ini tidak diperlukan.
    // Kalau ingin embed HTML langsung di worker, uncomment blok di bawah:

    /*
    if (path === "/" || path === "/index.html") {
      return new Response(HTML_CONTENT, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    */

    return new Response("Not found", { status: 404 });
  },
};
