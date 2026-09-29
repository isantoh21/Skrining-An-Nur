const SUPABASE_URL = 'https://ucgpmljuplocjmbspnag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ3BtbGp1cGxvY2ptYnNwbmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTYwNzMsImV4cCI6MjEwNTg5MjA3M30.DTWsgiS8auTN81k1_5RUYILw92ka8yUpmPU2EqmuKx8';

const WAHA_BASE_URL = 'http://13.140.178.167:29001';
const WAHA_API_KEY = 'askdj2934u9jd923dj3jdoi23nuiurio32od23oed2omi3290rmmoiejrw';
const ADMIN_WHATSAPP = '62895359450508';

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
  // Run asynchronously in the background without affecting UI
  (async () => {
    const timestamp = new Date().toISOString();
    const submissionId = `skrining_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const formattedMessage = [
      '📋 *HASIL SKRINING BARU (GHQ-12)*',
      '*An-Nur Psycho Center*',
      '──────────────────────',
      `👤 *Nama:* ${data.name}`,
      `🎂 *Usia:* ${data.age} tahun`,
      `💼 *Pekerjaan:* ${data.occupation}`,
      `📱 *No. HP/WA:* ${data.phone}`,
      `📸 *Instagram:* ${data.instagram}`,
      '──────────────────────',
      `📊 *Skor Total:* ${data.score} / 36`,
      `⚠️ *Status:* ${data.needsAttention ? 'Indikasi Distres Psikologis' : 'Normal / Stabil'}`,
      `📝 *Keterangan:* ${
        data.needsAttention
          ? 'Terdapat indikasi distres psikologis atau disfungsi sosial.'
          : 'Tidak menunjukkan indikasi distres psikologis yang signifikan.'
      }`,
      `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}`
    ].join('\n');

    // 1. Simpan ke database Supabase (tabel annur_database)
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
            category: 'skrining_ghq12',
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

    // 2. Kirim notifikasi WhatsApp via WAHA ke admin
    const sendWhatsApp = async () => {
      try {
        await fetch(`${WAHA_BASE_URL}/api/sendText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': WAHA_API_KEY
          },
          body: JSON.stringify({
            session: 'default',
            chatId: `${ADMIN_WHATSAPP}@c.us`,
            text: formattedMessage
          })
        });
      } catch {
        // Silent fail in background
      }
    };

    // 3. Fallback Supabase Edge Function jika tersedia
    const sendEdgeFunction = async () => {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/notify-wa`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatId: `${ADMIN_WHATSAPP}@c.us`,
            message: formattedMessage,
            screening: data
          })
        });
      } catch {
        // Silent fail
      }
    };

    await Promise.allSettled([saveToSupabase(), sendWhatsApp(), sendEdgeFunction()]);
  })().catch(() => {
    // Silent catch
  });
}
