let tugas = [];
let daftarMatkul = [];
let filterAktif = 'semua';
let status = 'loading';     
let pesanGagal = '';

const form = document.querySelector('#form-tugas');
const inJudul = document.querySelector('#judul');
const inMatkul = document.querySelector('#matkul');
const inDeadline = document.querySelector('#deadline');
const btnTambah = document.querySelector('#btn-tambah');
const errorEl = document.querySelector('#error');
const daftar = document.querySelector('#daftar');
const filters = document.querySelector('#filters');
const counter = document.querySelector('#counter');
const kosong = document.querySelector('#kosong');
const statusEl = document.querySelector('#status');
const statusTeks = document.querySelector('#status-teks');
const btnRetry = document.querySelector('#btn-retry');

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    let pesan = `Error ${res.status}`;
    try {
      const data = await res.json();
      pesan = data.error || data.message || pesan;
    } catch { /* body bukan JSON, pakai pesan default */ }
    throw new Error(pesan);
  }
  if (res.status === 204) return null;   
  return res.json();
}

async function muatAwal() {
  status = 'loading';
  render();
  try {
    const [dataTugas, dataMatkul] = await Promise.all([
      api('/api/tugas'),
      api('/api/matkul')
    ]);
    tugas = dataTugas;
    daftarMatkul = dataMatkul;
    isiSelectMatkul();
    status = 'ready';
  } catch (err) {
    status = 'error';
    pesanGagal = err.message;
  }
  render();
}

function isiSelectMatkul() {
  inMatkul.textContent = '';
  daftarMatkul.forEach(m => {
    const opt = document.createElement('option');
    opt.textContent = typeof m === 'string' ? m : m.nama;
    inMatkul.append(opt);
  });
}