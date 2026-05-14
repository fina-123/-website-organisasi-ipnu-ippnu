import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import pool from './db.js';

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

app.get('/api/member-registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at FROM member_registrations ORDER BY submitted_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to load member registrations:', error);
    res.status(500).json({ error: 'Gagal memuat pendaftaran anggota.' });
  }
});

app.post('/api/member-registrations', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      birth_date,
      gender,
      address,
      organization,
      education,
      school,
      motivation,
      agree_terms,
    } = req.body;

    if (!full_name || !email || !phone || !birth_date || !gender || !address || !organization) {
      return res.status(400).json({ error: 'Data pendaftaran tidak lengkap.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format email tidak valid.' });
    }

    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Format nomor telepon tidak valid.' });
    }

    const id = crypto.randomUUID();
    const now = new Date();
    const submittedAt = now.toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await pool.execute(
      `INSERT INTO member_registrations
        (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        full_name,
        email,
        phone,
        birth_date,
        gender,
        address,
        organization,
        education || null,
        school || null,
        motivation || null,
        agree_terms ? 1 : 0,
        'pending',
        submittedAt,
      ]
    );

    res.status(201).json({ id });
  } catch (error) {
    console.error('Failed to save member registration:', error);
    res.status(500).json({ error: 'Gagal menyimpan data pendaftaran ke database.' });
  }
});

app.patch('/api/member-registrations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid.' });
    }

    const [result] = await pool.execute(
      'UPDATE member_registrations SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update member registration status:', error);
    res.status(500).json({ error: 'Gagal memperbarui status pendaftaran.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend server berjalan di http://localhost:${port}`);
});
