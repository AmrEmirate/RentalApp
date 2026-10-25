# Antigravity Agent Guidelines & Workflow Rules — RentalApp

Instruksi dan aturan kerja otomatis untuk AI Agent dalam repositori **RentalApp** (`RentalApp` frontend & `RentalApp-API` backend).

---

## 1. Aturan Wajib Pasca-Pengerjaan (Post-Task Validation)

Setiap kali agent selesai melakukan perubahan kode atau menambah fitur:

### A. Frontend (`RentalApp`)
```bash
cd RentalApp
npx tsc --noEmit
```
Pastikan menghasilkan **0 error**. *(Catatan: Dilarang menjalankan build lokal yang menghasilkan folder `dist/`).*

### B. Backend (`RentalApp-API`)
```bash
cd RentalApp-API
npx tsc --noEmit
```
Pastikan menghasilkan **0 error**. *(Catatan: Dilarang menjalankan `npm run build` atau `tsc` tanpa `--noEmit` secara lokal agar tidak menghasilkan folder `dist/` lokal).*

---

## 2. Larangan Folder dist
* Dilarang membuat atau meng-commit folder `dist/`.
* Seluruh folder `dist/` wajib berada dalam `.gitignore`.
* Kompilasi build Docker/produksi dilakukan otomatis di cloud / CI/CD.

---

## 3. Otomatisasi Git Commit & Push ke GitHub

Setelah kedua sisi bebas dari error (`tsc` 0 errors):
- **Frontend**: Pindah ke folder `RentalApp`, jalankan `git add .`, `git commit -m "..."`, dan `git push origin main`.
- **Backend**: Pindah ke folder `RentalApp-API`, jalankan `git add .`, `git commit -m "..."`, dan `git push origin main`.
