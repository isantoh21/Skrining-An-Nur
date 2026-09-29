const SUPABASE_URL = 'https://ucgpmljuplocjmbspnag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ3BtbGp1cGxvY2ptYnNwbmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTYwNzMsImV4cCI6MjEwNTg5MjA3M30.DTWsgiS8auTN81k1_5RUYILw92ka8yUpmPU2EqmuKx8';

const WAHA_BASE_URL = 'http://13.140.178.167:29001';
const WAHA_API_KEY = 'askdj2934u9jd923dj3jdoi23nuiurio32od23oed2omi3290rmmoiejrw';

export interface ScreeningData {
  name: string;
  age: string;
  occupation: string;
  phone: string;
  instagram: string;
  score: number;
  needsAttention: boolean;
  answers: Record<number, number>;
}

export function saveAndNotifyInBackground(data: ScreeningData): void {
  // Dijalankan secara asinkron di background tanpa memblokir UI pengguna
  (async () => {
    const timestamp = new Date().toISOString();
    const submissionId = `skrining_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Pesan Reminder Campaign & Reservasi untuk Peserta
    const participantMessage = [
      `Halo Kak *${data.name}*, 👋`,
      '',
      'Terima kasih telah meluangkan waktu untuk mengisi *Skrining Kesehatan Mental* di *An-Nur Psycho Center*.',
      '',
      `📊 *Hasil Skrining Anda:* Skor ${data.score} / 36 (${data.needsAttention ? 'Perlu Perhatian Khusus' : 'Kondisi Baik / Stabil'})`,
      '',
      '🎁 *IKUTI CAMPAIGN & MENANGKAN DISKON SPESIAL!*',
      'Anda berkesempatan memenangkan *Undian Diskon Spesial* dari kami untuk layanan *Konsultasi Psikologi* atau *Psikotes* guna menindaklanjuti hasil skrining Anda.',
      '',
      '*Cara Mengikuti Campaign Sangat Mudah:*',
      '1️⃣ *Follow* akun Instagram kami: @annurpsychocenter',
      '2️⃣ *Screenshot tampilan hasil skrining di web skrining ini*',
      '3️⃣ *Posting screenshot hasil skrining tersebut di Instagram Stories* Anda & tag akun *@annurpsychocenter*',
      '',
      '📅 *Reservasi & Konsultasi Lanjutan:*',
      'Bila Anda ingin langsung berkonsultasi, menjadwalkan psikotes, atau menanyakan seputar hasil skrining, Anda dapat *langsung membalas pesan WhatsApp ini* untuk terhubung dengan tim admin kami.',
      '',
      'Salam hangat & sehat selalu,',
      '*An-Nur Psycho Center*'
    ].join('\n');

    // Tugas 1: Simpan ke database Supabase (tabel annur_database)
    const saveToSupabase = async () => {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/annur_database`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: submissionId,
            category: 'skrining',
            data: {
              nama: data.name,
              usia: data.age,
              pekerjaan: data.occupation,
              nomor_hp: data.phone,
              akun_instagram: data.instagram,
              skor_total: data.score,
              indikasi_distres: data.needsAttention,
              keterangan: data.needsAttention
                ? 'Terdapat indikasi distres psikologis atau disfungsi sosial.'
                : 'Tidak menunjukkan indikasi distres psikologis yang signifikan.',
              jawaban: data.answers,
              waktu_pengisian: timestamp
            }
          })
        });
      } catch {
        // Silent fail in background
      }
    };

    // Tugas 2: Kirim reminder campaign & info reservasi WhatsApp ke Peserta via WAHA
    const sendParticipantWhatsApp = async () => {
      try {
        let cleanPhone = data.phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '62' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('8')) {
          cleanPhone = '62' + cleanPhone;
        }

        if (cleanPhone.length >= 10) {
          await fetch(`${WAHA_BASE_URL}/api/sendText`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': WAHA_API_KEY
            },
            body: JSON.stringify({
              session: 'default',
              chatId: `${cleanPhone}@c.us`,
              text: participantMessage
            })
          });
        }
      } catch {
        // Silent fail in background
      }
    };

    // Tugas 3: Fallback Supabase Edge Function jika tersedia
    const sendEdgeFunction = async () => {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/notify-wa`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            participantMessage,
            screening: data
          })
        });
      } catch {
        // Silent fail
      }
    };

    await Promise.allSettled([
      saveToSupabase(),
      sendParticipantWhatsApp(),
      sendEdgeFunction()
    ]);
  })().catch(() => {
    // Silent catch
  });
}
