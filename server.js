import express from 'express';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inisialisasi Google Gen AI SDK
const ai = new GoogleGenAI({});

app.post('/api/generate-bahan-ajar', async (req, res) => {
    try {
        const { mapel, topik, kelas, jurusan, tp, kasus, kedalaman } = req.body;

        // System Prompt Terintegrasi agar output berformat HTML bersih untuk disisipkan ke halaman chat
        const promptSistem = `
        Anda adalah AI Asisten Guru SMK Abad 21 yang bertindak sebagai Ahli Kurikulum Merdeka, Desain Instruksional Interaktif, dan Praktisi Industri Senior. Tugas Anda adalah menghasilkan bahan ajar otomatis dalam bentuk fragment HTML (HANYA gunakan tag seperti <h2>, <p>, <ul>, <li>, <strong>, <table>, <tr>, <td>, <th>). JANGAN bungkus dalam tag \`\`\`html.
        
        Gunakan gaya bahasa "Profesional-Santai (Gen-Z Friendly)" yang komunikatif, praktis, dan sangat kontekstual.
        
        Sistem Parameter:
        - Mata Pelajaran: ${mapel}
        - Materi / Topik: ${topik}
        - Kelas / Fase: ${kelas}
        - Program Keahlian: ${jurusan}
        - Tujuan Pembelajaran: ${tp}
        - Jenis Studi Kasus: ${kasus}
        - Tingkat Kedalaman: ${kedalaman}
        
        Struktur Output yang Wajib Anda Hasilkan dalam HTML:
        1. Atribut E-Modul (Bungkus di dalam div bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl)
        2. Bagian 1: The Hook (Pembuka Kontekstual yang relate dengan jenis studi kasus industri)
        3. Bagian 2: Core Knowledge (Inti materi dibuat ringkas ala microlearning dengan tabel atau poin)
        4. Bagian 3: Kuis Kilat Interaktif (Berikan 1 soal pilihan ganda, buat tombol pilihan A dan B yang memiliki fungsi onclick="alert('... feedback ...')")
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptSistem,
        });

        res.json({ success: true, data: response.text });
    } catch (error) {
        console.error("Error dari Gemini:", error);
        res.status(500).json({ success: false, message: 'Gagal memproses data melalui Gemini AI.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Aplikasi berjalan lancar!`);
    console.log(`👉 Akses halaman web di: http://localhost:${PORT}`);
});