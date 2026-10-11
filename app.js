const STORAGE_KEY = 'tugas-kuliah';

let tugas = muat();           
let filterAktif = 'semua';    
let nextId = tugas.reduce((max, t) => Math.max(max, t.id), 0) + 1;

const form    = document.querySelector('#form-tugas');
const inJudul = document.querySelector('#judul');
const inMatkul = document.querySelector('#matkul');
const inDeadline = document.querySelector('#deadline');
const errorEl = document.querySelector('#error');
const daftar  = document.querySelector('#daftar');
const filters = document.querySelector('#filters');
const counter = document.querySelector('#counter');
const kosong  = document.querySelector('#kosong');

function muat() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function simpan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tugas));
}

function render() {
  const urut = [...tugas].sort((a, b) => a.deadline.localeCompare(b.deadline));

  const tampil = urut.filter(t =>
    filterAktif === 'semua' ||
    (filterAktif === 'aktif' ? !t.selesai : t.selesai)
  );

  daftar.textContent = '';
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
  const aktif = tugas.filter(t => !t.selesai).length;
  counter.textContent = `${aktif} tugas aktif`;        

  filters.querySelectorAll('button').forEach(b =>
    b.classList.toggle('on', b.dataset.filter === filterAktif)
  );
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const judul = inJudul.value.trim();
  const deadline = inDeadline.value;

  if (judul.length < 3) {
    errorEl.textContent = 'Judul minimal 3 karakter.';
    return;
  }
  if (!deadline) {
    errorEl.textContent = 'Deadline wajib diisi.';
    return;
  }
  errorEl.textContent = '';

  tugas.push({ id: nextId++, judul, matkul: inMatkul.value, deadline, selesai: false });
  inJudul.value = '';
  inDeadline.value = '';
  simpan();
  render();
});

daftar.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches('.hapus')) {
    tugas = tugas.filter(t => t.id !== id);
  } else if (e.target.matches('input[type="checkbox"]')) {
    const t = tugas.find(t => t.id === id);
    t.selesai = e.target.checked;
  } else {
    return;
  }
  simpan();
  render();
});

filters.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  filterAktif = e.target.dataset.filter;
  render();
});

render();