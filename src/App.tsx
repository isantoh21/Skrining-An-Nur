import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, RefreshCw, ShieldAlert, CheckCircle, Instagram, Gift } from 'lucide-react';
import { questions } from './data';
import { options, Answer } from './types';
import { saveAndNotifyInBackground } from './services/backendService';

type Screen = 'intro' | 'test' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [userInfo, setUserInfo] = useState({ name: '', age: '', occupation: '', phone: '', instagram: '' });

  const handlePhoneChange = (val: string) => {
    if (!val) {
      setUserInfo(prev => ({ ...prev, phone: '' }));
      return;
    }

    let digits = val.replace(/\D/g, '');
    if (!digits) {
      setUserInfo(prev => ({ ...prev, phone: '' }));
      return;
    }

    if (digits.startsWith('0')) {
      digits = '62' + digits.slice(1);
    } else if (digits.startsWith('8')) {
      digits = '62' + digits;
    } else if (!digits.startsWith('62') && !digits.startsWith('6') && digits.length >= 1) {
      digits = '62' + digits;
    }

    setUserInfo(prev => ({ ...prev, phone: digits.slice(0, 15) }));
  };

  const handlePhoneBlur = () => {
    if (userInfo.phone === '6' || userInfo.phone === '62') {
      setUserInfo(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleStart = () => {
    setScreen('test');
    setCurrentStep(0);
    setAnswers({});
  };

  const handleAnswer = (answer: Answer) => {
    const newAnswers = { ...answers, [currentStep]: answer };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalScore = Object.values(newAnswers).reduce((acc, val) => acc + val, 0);
      const finalNeedsAttention = finalScore >= 19;

      // Kirim data ke background (Supabase & WAHA) tanpa mengganggu UX pengguna
      saveAndNotifyInBackground({
        name: userInfo.name,
        age: userInfo.age,
        occupation: userInfo.occupation,
        phone: userInfo.phone,
        instagram: userInfo.instagram,
        score: finalScore,
        needsAttention: finalNeedsAttention,
        answers: newAnswers
      });

      setScreen('result');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((acc, val) => acc + val, 0);
  };

  const score = calculateScore();
  const needsAttention = score >= 19;

  return (
    <div className="min-h-screen bg-[#f8fbf9] text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className="h-32 w-auto drop-shadow-sm">
              <defs>
                <polygon id="star" points="0,-10 2.5,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -2.5,-3" fill="#1a9e43" />
              </defs>
              
              <ellipse cx="500" cy="500" rx="480" ry="350" fill="#1a9e43" />
              <ellipse cx="500" cy="500" rx="462" ry="334" fill="white" />
              <ellipse cx="500" cy="500" rx="452" ry="325" fill="#1a9e43" />
              <ellipse cx="500" cy="500" rx="445" ry="319" fill="#eef5dc" />

              <g transform="translate(0, 45)">
                <path d="M 360,475 A 140,140 0 0,1 640,475 Z" fill="white" stroke="#1a9e43" strokeWidth="5" />
                <line x1="330" y1="475" x2="670" y2="475" stroke="#1a9e43" strokeWidth="5" strokeLinecap="round"/>

                <line x1="500" y1="335" x2="500" y2="475" stroke="#1a9e43" strokeWidth="4"/>
                <path d="M 500,335 A 45,140 0 0,1 500,475" fill="none" stroke="#1a9e43" strokeWidth="4" />
                <path d="M 500,335 A 90,140 0 0,1 500,475" fill="none" stroke="#1a9e43" strokeWidth="4" />
                <path d="M 500,335 A 45,140 0 0,0 500,475" fill="none" stroke="#1a9e43" strokeWidth="4" />
                <path d="M 500,335 A 90,140 0 0,0 500,475" fill="none" stroke="#1a9e43" strokeWidth="4" />
                
                <path d="M 397,380 A 102.8,25 0 0,0 603,380" fill="none" stroke="#1a9e43" strokeWidth="4" />
                <path d="M 367.5,430 A 132.5,35 0 0,0 632.5,430" fill="none" stroke="#1a9e43" strokeWidth="4" />

                <path d="M 360,475 A 140,140 0 0,1 470,338 L 470,410 Q 450,440 470,475 Z" fill="#1a9e43" />
                <path d="M 520,475 L 530,420 Q 560,390 600,340 Q 630,330 635,380 L 610,400 Q 640,430 630,475 Z" fill="#1a9e43" />

                <polygon points="410,270 490,225 510,240 430,285" fill="#1a9e43" stroke="#1a9e43" strokeWidth="1" strokeLinejoin="round" />
                <polygon points="430,285 510,240 540,340 460,385" fill="white" stroke="#1a9e43" strokeWidth="5" strokeLinejoin="round" />
                <polygon points="410,270 430,285 460,385 440,370" fill="white" stroke="#1a9e43" strokeWidth="5" strokeLinejoin="round" />
                
                <line x1="416" y1="275" x2="446" y2="375" stroke="#1a9e43" strokeWidth="2" />
                <line x1="422" y1="279" x2="452" y2="379" stroke="#1a9e43" strokeWidth="2" />

                <g transform="translate(500, 500) scale(1.6)"><use href="#star" /></g>
                <g transform="translate(450, 503) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(400, 507) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(350, 512) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(300, 518) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(550, 503) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(600, 507) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(650, 512) scale(1.2)"><use href="#star" /></g>
                <g transform="translate(700, 518) scale(1.2)"><use href="#star" /></g>

                <text x="500" y="595" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="95" fill="#1a9e43" textAnchor="middle" letterSpacing="2">AN-NUR</text>
                
                <g transform="translate(500, 675) scale(0.85, 1.15)">
                  <text x="0" y="0" fontFamily="'Arial Narrow', Arial, sans-serif" fontWeight="bold" fontSize="60" fill="#1a9e43" textAnchor="middle">Psycho Center</text>
                </g>
              </g>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Skrining Kesehatan Mental
          </h1>
        </header>

        {/* Main Content Area */}
        <main className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-10 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            
            {screen === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-grow"
              >
                <h2 className="text-xl font-semibold mb-4">Tentang Tes Ini</h2>
                <div className="prose prose-slate prose-sm sm:prose-base mb-8 flex-grow">
                  <p>
                    Tes ini dirancang untuk mengetahui tentang keluhan yang mungkin Anda alami sekarang atau akhir-akhir ini, bukan keluhan yang Anda alami di masa lalu.
                  </p>
                  <p>
                    <strong>Instruksi:</strong> Jawablah semua 12 pertanyaan dengan memilih jawaban yang Anda pikir paling sesuai dengan kondisi Anda saat ini.
                  </p>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 my-6 shadow-sm">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Usia</label>
                      <input 
                        type="number" 
                        value={userInfo.age}
                        onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="Contoh: 25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
                      <input 
                        type="text" 
                        value={userInfo.occupation}
                        onChange={(e) => setUserInfo({...userInfo, occupation: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="Masukkan pekerjaan Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                      <input 
                        type="tel" 
                        inputMode="numeric"
                        value={userInfo.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onBlur={handlePhoneBlur}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="Contoh: 081234567890 atau 6281234567890"
                      />
                      <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                        <span>Format otomatis: <code className="text-brand-700 font-semibold bg-brand-50 px-1.5 py-0.5 rounded">62xxxxxxxxxx</code></span>
                        {userInfo.phone && (
                          <span className={userInfo.phone.length >= 11 ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                            {userInfo.phone.length >= 11 ? "✓ Format valid" : `${userInfo.phone.length}/11-14 digit`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Akun Instagram</label>
                      <input 
                        type="text" 
                        value={userInfo.instagram}
                        onChange={(e) => setUserInfo({...userInfo, instagram: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="Contoh: @username"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl text-amber-800 border border-amber-100 mt-6">
                    <p className="text-sm m-0 flex gap-3 items-start">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>Hasil tes ini bersifat indikatif dan tidak dapat menggantikan diagnosis profesional dari dokter atau psikolog.</span>
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleStart}
                  disabled={!userInfo.name || !userInfo.age || !userInfo.occupation || !userInfo.phone || userInfo.phone.length < 11 || !userInfo.instagram}
                  className="w-full sm:w-auto self-center sm:self-end flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mulai Tes
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {screen === 'test' && (
              <motion.div
                key="test"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-grow"
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Pertanyaan</span>
                    <span className="text-sm font-medium text-slate-500">
                      <strong className="text-brand-600">{currentStep + 1}</strong> / {questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-brand-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8 flex-grow">
                  <h3 className="text-2xl font-medium text-slate-800 leading-snug">
                    {questions[currentStep].text}
                  </h3>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3 mb-6">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`
                        w-full text-left p-4 rounded-xl border transition-all duration-200
                        flex items-center gap-4 group
                        ${
                          answers[currentStep] === option.value
                            ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                            : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
                        }
                      `}
                    >
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-colors
                        ${
                          answers[currentStep] === option.value
                            ? 'border-brand-600'
                            : 'border-slate-300 group-hover:border-brand-400'
                        }
                      `}>
                        {answers[currentStep] === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                        )}
                      </div>
                      <span className={`font-medium ${answers[currentStep] === option.value ? 'text-brand-900' : 'text-slate-700'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Navigation (Back) */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium px-4 py-2 -ml-4 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Sebelumnya
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full flex-grow items-center text-center py-6"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 ${needsAttention ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-brand-50 border-brand-100 text-brand-600'}`}>
                  {needsAttention ? <ShieldAlert className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Hasil Analisis</h2>
                <div className="text-4xl font-black text-slate-800 mb-6 tracking-tight">
                  Skor: {score} <span className="text-lg font-medium text-slate-400">/ 36</span>
                </div>

                <div className={`w-full p-6 rounded-2xl mb-6 text-left ${needsAttention ? 'bg-rose-50/50 border border-rose-100' : 'bg-brand-50/50 border border-brand-100'}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${needsAttention ? 'text-rose-900' : 'text-brand-900'}`}>
                    Interpretasi
                  </h3>
                  <p className={`mb-4 ${needsAttention ? 'text-rose-800' : 'text-brand-800'}`}>
                    {needsAttention 
                      ? "Berdasarkan hasil tes, Anda menunjukkan adanya indikasi distres psikologis atau disfungsi sosial." 
                      : "Berdasarkan hasil tes, Anda tidak menunjukkan indikasi distres psikologis yang signifikan."}
                  </p>
                  
                  {needsAttention ? (
                    <div className="bg-white/60 p-4 rounded-xl text-sm text-rose-900 font-medium border border-rose-100">
                      Disarankan bagi Anda untuk mengikuti sesi konseling lebih lanjut dengan profesional kesehatan mental (dokter atau psikolog) untuk pemeriksaan dan penanganan yang lebih tepat.
                    </div>
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl text-sm text-brand-900 font-medium border border-brand-100">
                      Tetap jaga kesehatan mental Anda dengan gaya hidup sehat, istirahat cukup, dan manajemen stres yang baik.
                    </div>
                  )}
                </div>

                <div className="w-full bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100 rounded-2xl p-6 mb-8 text-left shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand-900">
                    <Gift className="w-6 h-6 text-brand-600" />
                    Menangkan Voucher Konseling!
                  </h3>
                  
                  {/* Instagram Illustration */}
                  <div className="flex justify-center mb-6 mt-4">
                    <div className="relative w-48 h-80 bg-slate-900 rounded-[2rem] border-[6px] border-slate-800 overflow-hidden shadow-xl flex flex-col items-center">
                      {/* Phone Notch */}
                      <div className="absolute top-0 w-20 h-4 bg-slate-800 rounded-b-xl z-10"></div>
                      
                      {/* Story Content */}
                      <div className="w-full h-full bg-gradient-to-br from-brand-100 to-emerald-50 p-4 pt-10 flex flex-col relative">
                        {/* Fake Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-brand-200"></div>
                          </div>
                          <div className="w-16 h-2 rounded-full bg-brand-800/30"></div>
                        </div>
                        
                        {/* Mock Result Card */}
                        <div className="bg-white/90 rounded-xl p-3 shadow-sm mb-4 border border-brand-100">
                          <div className="w-12 h-12 rounded-full bg-brand-50 mx-auto mb-3 flex items-center justify-center">
                             <CheckCircle className="w-6 h-6 text-brand-500" />
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full mb-2"></div>
                          <div className="w-2/3 h-2 bg-slate-100 rounded-full mx-auto mb-2"></div>
                          <div className="w-1/2 h-2 bg-slate-100 rounded-full mx-auto"></div>
                        </div>
                        
                        {/* Mock Tag */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-600 shadow-sm whitespace-nowrap flex items-center gap-1 border border-brand-100">
                          <Instagram className="w-3 h-3" />
                          @annurpsychocenter
                        </div>
                        
                        {/* Fake Bottom UI */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-md flex items-center justify-between px-4">
                          <div className="w-full h-8 rounded-full border border-white/40 flex items-center px-3">
                            <div className="w-20 h-1.5 bg-white/50 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-4 text-brand-800 font-medium text-center">
                    Anda berkesempatan memenangkan voucher diskon konseling di <strong>An-Nur Psycho Center</strong> yang akan diundi oleh pihak biro.
                  </p>
                  <div className="bg-white/80 p-4 rounded-xl text-sm border border-brand-200 text-center">
                    <span className="block mb-2 text-xs uppercase tracking-wider text-brand-600 font-bold">Cara Ikut:</span>
                    Jangan lupa <strong>follow</strong> akun kami, <br/>foto/screenshot hasil skrining ini, lalu <br/><strong>post di Insta Stories</strong> Anda dan tag: <br/>
                    <a href="https://instagram.com/annurpsychocenter" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 mt-3 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-4 py-1.5 rounded-full font-bold shadow-sm hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4" /> @annurpsychocenter
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-medium px-6 py-3 transition-colors rounded-xl hover:bg-slate-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Ulangi Tes
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
        
        <footer className="mt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} An-Nur Psycho Center</p>
        </footer>

      </div>
    </div>
  );
}
