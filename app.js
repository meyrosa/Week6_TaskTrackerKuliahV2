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

function render() {
  // status loading / error
  statusEl.hidden = status === 'ready';
  statusEl.classList.toggle('gagal', status === 'error');
  btnRetry.hidden = status !== 'error';
  if (status === 'loading') statusTeks.textContent = 'Memuat tugas...';
  if (status === 'error') statusTeks.textContent = `Gagal memuat: ${pesanGagal}`;

  daftar.textContent = '';
  if (status !== 'ready') {
    kosong.hidden = true;
    counter.textContent = '';
    return;
  }

  const tampil = tugas.filter(t =>
    filterAktif === 'semua' ||
    (filterAktif === 'aktif' ? !t.selesai : t.selesai)
  );

  tampil.forEach(t => {
    const li = document.createElement('li');
    li.dataset.id = t.id;
    if (t.selesai) li.classList.add('done');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.selesai;

    const info = document.createElement('div');
    info.className = 'info';
    const judul = document.createElement('strong');
    judul.textContent = t.judul;
    const meta = document.createElement('small');
    meta.textContent = `${t.matkul} · deadline ${t.deadline}`;
    info.append(judul, meta);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'hapus';
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Hapus tugas');

    li.append(cb, info, del);
    daftar.append(li);
  });

  kosong.hidden = tampil.length > 0;
  counter.textContent = `${tugas.filter(t => !t.selesai).length} tugas aktif`;
  filters.querySelectorAll('button').forEach(b =>
    b.classList.toggle('on', b.dataset.filter === filterAktif)
  );
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const judul = inJudul.value.trim();
  const deadline = inDeadline.value;

  if (judul.length < 3) { errorEl.textContent = 'Judul minimal 3 karakter.'; return; }
  if (!deadline) { errorEl.textContent = 'Deadline wajib diisi.'; return; }
  errorEl.textContent = '';

  btnTambah.disabled = true;
  btnTambah.textContent = 'Mengirim...';
  try {
    const baru = await api('/api/tugas', {
      method: 'POST',
      body: JSON.stringify({ judul, matkul: inMatkul.value, deadline })
    });
    tugas.push(baru);                    // pakai data dari server (id dari server)
    inJudul.value = '';
    inDeadline.value = '';
    render();
  } catch (err) {
    errorEl.textContent = err.message;   // misal pesan 400 dari server
  } finally {
    btnTambah.disabled = false;
    btnTambah.textContent = 'Tambah';
  }
});
