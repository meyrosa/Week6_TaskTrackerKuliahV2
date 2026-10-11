(function () {
  let mode = "normal";
  let nextId = 3;
  const matkul = ["Basis Data", "Pemrograman Web", "Jaringan Komputer", "Keamanan Siber"];
  let tugas = [
    { id: 1, judul: "Lab 10 event delegation", matkul: "Pemrograman Web", deadline: "2026-10-08", selesai: false },
    { id: 2, judul: "ERD sistem perpustakaan", matkul: "Basis Data", deadline: "2026-10-12", selesai: true }
  ];

  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function handle(url, method, body) {
    const path = url.split("?")[0];
    if (path === "/api/matkul" && method === "GET") return json(matkul);
    if (path === "/api/tugas" && method === "GET") return json(tugas);
    if (path === "/api/tugas" && method === "POST") {
      if (!body.judul || body.judul.trim().length < 3) return json({ error: "Judul minimal 3 karakter" }, 400);
      if (!body.deadline) return json({ error: "Deadline wajib diisi" }, 400);
      const baru = { id: nextId++, judul: body.judul.trim(), matkul: body.matkul, deadline: body.deadline, selesai: false };
      tugas.push(baru);
      return json(baru, 201);
    }
    const m = path.match(/^\/api\/tugas\/(\d+)$/);
    if (m) {
      const id = Number(m[1]);
      const t = tugas.find(x => x.id === id);
      if (!t) return json({ error: "Tugas tidak ditemukan" }, 404);
      if (method === "PATCH") { Object.assign(t, body); return json(t); }
      if (method === "DELETE") { tugas = tugas.filter(x => x.id !== id); return new Response(null, { status: 204 }); }
    }
    return json({ error: "Endpoint tidak ditemukan" }, 404);
  }

  const realFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    if (!String(url).startsWith("/api/")) return realFetch(url, options);
    const method = (options.method || "GET").toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};

    if (mode === "offline") { await wait(300); throw new TypeError("Failed to fetch"); }
    await wait(mode === "lambat" ? 3000 : 300);
    if (mode === "tidak stabil" && Math.random() < 0.5) throw new TypeError("Failed to fetch");
    if (mode === "server 500") return json({ error: "Internal server error" }, 500);
    return handle(url, method, body);
  };

  window.__API = { setMode(m) { mode = m.toLowerCase(); } };
})();