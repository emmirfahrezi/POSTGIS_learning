# 📖 Kamus Geospasial & Arsitektur Backend (StrukturNest)

Dokumen ini berisi rangkuman seluruh istilah-istilah spasial dan fungsi PostGIS yang kita gunakan dalam proyek ini, lengkap dengan penjelasan bahasa manusia dan contoh penggunaannya di dalam kode.

---

## 1. Konsep & Format Data

### GeoJSON
**GeoJSON** adalah standar bahasa internasional berbasis JSON yang digunakan untuk bertukar data peta di web. Ini adalah format yang dikirim dari Frontend ke API kita, dan dari API kita kembali ke Frontend.
- **Contoh di Kode (DTO):**
  ```typescript
  "geojson": {
    "type": "Point",
    "coordinates": [106.824578, -6.175392]
  }
  ```

### WKB (Well-Known Binary) / EWKB
Ini adalah **wujud asli** dari data spasial ketika disimpan di dalam *harddisk* database PostgreSQL. Bentuknya berupa deretan angka Hexadecimal (seperti `01010000...`) yang tidak bisa dibaca manusia, namun bisa diproses oleh komputer dengan kecepatan kilat untuk mencari jarak radius.

### WKT (Well-Known Text)
Ini adalah kebalikan dari WKB. WKT adalah format **Teks Murni** agar manusia bisa membaca bentuk spasial tersebut tanpa bantuan aplikasi peta. 
- **Contoh:** `POINT(106.824 -6.175)` atau `POLYGON(...)`

### SRID 4326 (Spatial Reference System Identifier)
Kenapa selalu ada angka `4326` di kode kita? Ini adalah kode standar dunia untuk **Sistem Koordinat GPS Bumi (WGS 84)**. PostGIS perlu tahu bahwa bumi itu bulat, dan angka 4326 inilah yang memberi tahu PostGIS tentang kelengkungan bumi tersebut agar perhitungan jarak meternya akurat.

---

## 2. Frontend Libraries

### Cesium (CesiumJS)
Sebuah *library* Frontend raksasa (pesaing Google Earth) yang digunakan untuk menampilkan peta Bumi secara **3D Interaktif**. Cesium sangat rakus memakan data **GeoJSON** untuk menggambar gedung atau pesawat di layarnya. Inilah tujuan akhir dari API yang kita bangun.

### Leaflet / Mapbox / OpenLayers
Sama seperti Cesium, namun umumnya digunakan untuk menampilkan peta dalam bentuk **2D** (seperti Google Maps biasa). Mereka juga berkomunikasi menggunakan GeoJSON.

---

## 3. Fungsi Sakti PostGIS di Kode Kita

Semua fungsi spasial di PostgreSQL selalu diawali dengan huruf **`ST_`** (Spatial Type).

### `ST_GeomFromGeoJSON`
- **Fungsi:** Menyulap teks GeoJSON dari Frontend menjadi wujud Biner (WKB) agar bisa disimpan di database.
- **Contoh di Kode (`location.service.ts`):**
  ```sql
  ST_GeomFromGeoJSON(${geojsonString})
  ```

### `ST_AsGeoJSON`
- **Fungsi:** Menyulap wujud Biner (WKB) di database kembali menjadi teks GeoJSON agar bisa dibaca oleh Cesium / Frontend.
- **Contoh di Kode (`location.service.ts`):**
  ```sql
  ST_AsGeoJSON(geom)::json as geojson
  ```

### `ST_AsText`
- **Fungsi:** Menyulap wujud Biner (WKB) menjadi teks murni WKT. Kita menggunakannya untuk membuat *Database View Debugging* untuk Mentormu.
- **Contoh di Kode (`create-view.js`):**
  ```sql
  SELECT ST_AsText(geom) AS geom_wkt
  ```

### `ST_SetSRID`
- **Fungsi:** Menempelkan "Sertifikat Kelengkungan Bumi (4326)" ke dalam objek geometri yang baru saja dibuat. Wajib dilakukan agar jarak meternya tidak ngaco.
- **Contoh di Kode (`location.service.ts`):**
  ```sql
  ST_SetSRID(ST_GeomFromGeoJSON(...), 4326)
  ```

### `ST_DWithin`
- **Fungsi:** Fungsi pencarian super cepat (memakai Index Spasial) untuk mendeteksi apakah sebuah lokasi berada di dalam **Radius** tertentu dari sebuah titik pusat. "D" artinya *Distance*, "Within" artinya *Di dalam*.
- **Contoh di Kode (`location.service.ts` - Nearby Search):**
  ```sql
  ST_DWithin(geom, TitikPusat, 5000) -- Cari yang jaraknya di bawah 5000 meter
  ```

### `ST_Distance`
- **Fungsi:** Menghitung jarak presisi (dalam satuan meter) antara dua titik atau dua Polygon.
- **Contoh di Kode (`location.service.ts` - Nearby Search):**
  ```sql
  ST_Distance(geom, TitikPusat, true) as "distanceInMeters"
  ```
  *(Angka `true` di belakang menandakan bahwa kita meminta PostGIS menghitung jarak melengkung mengikuti bentuk asli bumi, bukan jarak garis lurus di atas kertas datar).*

---
*Catatan: File ini ditulis otomatis sebagai panduan referensi arsitektur spasial untuk tim developer.*
