import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Yopi from './assets/opa-yopi.jpg';
import Eko from './assets/pa-eko.jpg';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";


// --- KONFIGURASI FIREBASE ---
// Ganti nilai placeholder dengan konfigurasi dari proyek Firebase Anda.
// Anda bisa mendapatkan ini dari Pengaturan Proyek (Project settings) di Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyCSWg2-y0BLu_l8kNT_fw_PWsLpimOKYhc",
  authDomain: "remembrance-day-dbb60.firebaseapp.com",
  projectId: "remembrance-day-dbb60",
  storageBucket: "remembrance-day-dbb60.firebasestorage.app",
  messagingSenderId: "354276902979",
  appId: "1:354276902979:web:958ac80b961821c7ed6cf6",
  measurementId: "G-V3EER7NV2D"
};

// Inisialisasi Firebase dan service yang akan digunakan
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// --- ICONS (SVG) ---
// Tidak ada perubahan, sudah bagus.
const MapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const Clock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const Calendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.43.2.5.28.08.08.14.18.18.33.04.14.04.58-.12 1.12-.16.54-.88 1.14-1.46 1.28-.58.14-1.12.1-1.58-.04s-.73-.24-1.35-.62c-.62-.38-1.23-.9-1.74-1.52-.5-.62-.9-1.34-1.14-2.06-.24-.72-.14-1.28.06-1.7.2-.42.42-.58.6-.72.18-.14.3-.2.42-.2s.25,0,.38.04c.12.04.2.06.26.24.06.18.2.62.24.68.04.06.06.12.02.22s-.1.16-.2.24c-.1.08-.14.12-.22.2s-.12.14-.04.28c.08.14.24.45.55.75.3.3.6.5.75.6s.22.1.28.04c.06-.08.14-.14.24-.22.1-.08.14-.12.2-.14.06-.02.14,0,.2,0s.45.2.53.24c.08.04.14.06.16.12s.04.16.02.24-.1.14-.14.18Z" /><path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.9.5.5 5.9.5 12c0 2.1.6 4.1 1.6 5.9l-1.5 5.5 5.7-1.5c1.8 1 3.8 1.6 5.9 1.6h.1c6.1 0 11.5-5.3 11.5-11.4 0-3-1.2-5.9-3.4-8.1zM12 21.5h-.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1.1 1.1-3.9-.2-.4c-1-1.6-1.6-3.6-1.6-5.6C1.5 6.4 6.4 1.5 12 1.5s10.5 4.9 10.5 10.5c0 5.6-4.9 10.5-10.5 10.5Z" /></svg>
);


// --- ANIMATION VARIANTS ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// --- HELPER COMPONENTS ---
const Section = ({ children, className = '' }) => (
  <motion.section
    className={`w-full py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden ${className}`}
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.section>
);

const SectionTitle = ({ children, className = '' }) => (
  <h2 className={`font-serif text-4xl md:text-5xl font-bold text-center mb-12 text-[#205781] ${className}`}>
    {children}
  </h2>
);

// --- UI COMPONENTS ---
const HeroSection = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F6F8D5] text-[#205781] p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#98D2C0]/10 via-transparent to-[#4F959D]/10"></div>
    <motion.div className="text-center z-10" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
      <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-6">Dalam Kenangan Penuh Kasih</h1>
    </motion.div>
    <motion.div className="relative flex flex-col md:flex-row gap-6 md:gap-10 mt-8 z-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 1 }}>
      <div className="text-center p-4">
        {/* Menggunakan URL placeholder untuk gambar. Anda bisa menggantinya dengan URL gambar Anda sendiri. */}
        <img src={Yopi} alt="Joppy Hendrik Langi" className="w-56 h-80 md:w-64 md:h-96 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-white" />
        <h3 className="font-serif text-2xl mt-4">Joppy Hendrik Langi</h3>
        <p className="font-sans text-[#4F959D]">✞ 27 Maret 2015</p>
        <p className="font-sans text-[#4F959D]">Peringatan 10 Tahun</p>
      </div>
      <div className="text-center p-4">
        <img src={Eko} alt="Victor Elko Langi" className="w-56 h-80 md:w-64 md:h-96 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-white" />
        <h3 className="font-serif text-2xl mt-4">Victor Elko Langi</h3>
        <p className="font-sans text-[#4F959D]">✞ 24 April 2024</p>
        <p className="font-sans text-[#4F959D]">Peringatan 1 Tahun</p>
      </div>
    </motion.div>
    <motion.p className="mt-7 max-w-2xl text-center text-md md:text-lg font-sans text-[#4F959D] z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}>
      Acara peringatan meninggalnya yang terkasih Alm. Joppy Langi (10 tahun) dan Alm. Victor Elko Langi (1 tahun)
    </motion.p>
  </div>
);

const CountdownSection = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date('2025-07-06T12:00:00');
    const difference = +eventDate - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        Hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Menit: Math.floor((difference / 1000 / 60) % 60),
        Detik: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <Section className="bg-[#ffffff]">
      <SectionTitle>Waktu & Lokasi Acara</SectionTitle>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg text-[#4F959D] font-sans mb-8">Acara akan dimulai dalam:</p>
        <div className="flex justify-center gap-4 md:gap-8 text-[#205781] mb-12">
          {Object.entries(timeLeft).length ? Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center bg-[#F6F8D5] p-4 rounded-lg shadow-md w-24">
              <div className="text-4xl font-bold font-sans">{value}</div>
              <div className="text-sm font-serif">{unit}</div>
            </div>
          )) : <span className="text-2xl font-serif text-[#4F959D]">Acara telah berlangsung.</span>}
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-left font-sans text-[#205781]">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#98D2C0]"><h3 className="font-serif text-xl font-bold mb-2 flex items-center"><Calendar /> Tanggal</h3><p>Minggu, 6 Juli 2025</p></div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#98D2C0]"><h3 className="font-serif text-xl font-bold mb-2 flex items-center"><Clock /> Waktu</h3><p>12:00 WITA - Selesai</p></div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#98D2C0]"><h3 className="font-serif text-xl font-bold mb-2 flex items-center"><MapPin /> Lokasi</h3><p>Bitung, Amurang, Sulawesi Utara</p></div>
        </div>
        <div className="mt-12 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
          <iframe src="https://maps.google.com/maps?q=1.190609,124.581723&t=k&z=17&ie=UTF8&iwloc=&output=embed" width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Peta Lokasi Acara"></iframe>
        </div>
      </div>
    </Section>
  );
};

const RSVPForm = ({ onRsvpSubmit }) => {
  const [formData, setFormData] = useState({ name: '', attendance: 'Hadir', guests: 1, message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.name.trim() === '') {
      setError('Nama tidak boleh kosong.');
      return;
    }
    onRsvpSubmit(formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', attendance: 'Hadir', guests: 1, message: '' });
      setIsSubmitted(false);
    }, 5000);
  };
  return (
    <Section className="bg-[#F6F8D5]">
      <SectionTitle>Konfirmasi Kehadiran</SectionTitle>
      <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl border-t-4 border-[#205781]">
        <AnimatePresence>
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h3 className="font-serif text-2xl text-[#205781]">Terima Kasih!</h3>
              <p className="text-[#4F959D] mt-2">Konfirmasi dan pesan Anda telah kami terima.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4F959D] font-sans">Nama Lengkap</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F959D] focus:ring-[#4F959D] sm:text-sm p-3 font-sans" />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <div>
                <label htmlFor="attendance" className="block text-sm font-medium text-[#4F959D] font-sans">Kehadiran</label>
                <select id="attendance" name="attendance" value={formData.attendance} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F959D] focus:ring-[#4F959D] sm:text-sm p-3 font-sans">
                  <option>Hadir</option>
                  <option>Tidak Hadir</option>
                </select>
              </div>
              {formData.attendance === 'Hadir' && (
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-[#4F959D] font-sans">Jumlah Tamu (termasuk Anda)</label>
                  <input type="number" name="guests" id="guests" min="1" value={formData.guests} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F959D] focus:ring-[#4F959D] sm:text-sm p-3 font-sans" />
                </div>
              )}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#4F959D] font-sans">Pesan Kenangan / Doa (opsional)</label>
                <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F959D] focus:ring-[#4F959D] sm:text-sm p-3 font-sans"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#205781] hover:bg-[#4F959D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F959D] transition-colors duration-300 font-serif text-lg">Kirim Konfirmasi</button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

const GuestMessages = ({ messages }) => {
  const marqueeStyle = `@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } } .animate-scroll { animation: scroll 40s linear infinite; }`;
  if (!messages || messages.length === 0) return null;
  // EDIT: Ubah kondisi agar selalu scrolling jika ada pesan
  const isScrolling = true;
  const displayMessages = isScrolling ? [...messages, ...messages] : messages;
  return (
    <Section className="bg-[#ffffff] !py-12">
      <style>{marqueeStyle}</style>
      <SectionTitle>Pesan & Doa</SectionTitle>
      <div className={`w-full max-w-7xl mx-auto relative ${isScrolling ? 'overflow-hidden' : ''}`} style={{ WebkitMaskImage: isScrolling ? `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` : 'none', maskImage: isScrolling ? `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` : 'none' }}>
        <div className={`flex ${isScrolling ? 'animate-scroll' : 'flex-wrap justify-center'}`}>
          {displayMessages.map((msg, index) => (
            <div key={msg.id || index} className="flex-shrink-0 w-80 sm:w-96 mx-4 bg-[#F6F8D5]/70 p-6 rounded-lg shadow-lg border-l-4 border-[#98D2C0]" style={{ fontFamily: "'Cutive Mono', monospace" }}>
              <p className="text-[#4F959D] text-md mb-4 italic">"{msg.message}"</p>
              <p className="font-bold text-right text-[#205781]">- {msg.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Footer = () => {
  const [copySuccess, setCopySuccess] = useState('');
  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setCopySuccess('Link disalin!');
    } catch (err) {
      setCopySuccess('Gagal menyalin.');
    }
    document.body.removeChild(el);
    setTimeout(() => setCopySuccess(''), 3000);
  };
  const shareToWhatsApp = () => {
    const message = encodeURIComponent(`Dengan penuh kasih, kami mengundang Anda untuk hadir dalam acara peringatan untuk Alm. Joppy Langi & Alm. Elko Langi. Info selengkapnya: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };
  return (
    <footer className="bg-[#205781] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto text-center font-sans">
        <p className="font-serif text-2xl text-[#F6F8D5] mb-2">Dengan Penuh Kasih & Syukur,</p>
        <p className="text-lg text-[#98D2C0] mb-6">Keluarga Besar Langi-Piay</p>
        <div className="flex justify-center items-center gap-4 mb-4">
          <button onClick={shareToWhatsApp} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-colors"><WhatsAppIcon /> Bagikan ke WhatsApp</button>
          <button onClick={copyToClipboard} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-colors"><CopyIcon /> Salin Tautan</button>
        </div>
        {copySuccess && <p className="text-sm text-[#98D2C0]">{copySuccess}</p>}
        <p className="text-xs text-[#98D2C0]/70 mt-8">"Jawab Yesus, 'Akulah kebangkitan dan hidup; barangsiapa percaya kepada-Ku, ia akan hidup walaupun ia sudah mati, dan setiap orang yang hidup dan percaya kepada-Ku, tidak akan mati selama-lamanya.'" - Yohanes 11:25-26</p>
      </div>
    </footer>
  );
};

// --- Komponen-komponen untuk Halaman Admin & Routing ---
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Email atau password salah.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4F959D]" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4F959D]" required />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#205781] text-white p-3 rounded-md hover:bg-[#4F959D] transition-colors disabled:bg-gray-400">{loading ? 'Loading...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ user, children }) => {
  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminPage = ({ rsvps }) => {
  const messages = rsvps.filter(rsvp => rsvp.message && rsvp.message.trim() !== '');
  const totalAttending = rsvps.filter(r => r.attendance === 'Hadir').reduce((sum, rsvp) => sum + (rsvp.guests || 0), 0);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Halaman Admin</h1>
          <button onClick={() => signOut(auth)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors">Logout</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ringkasan</h2>
          <p>Total Konfirmasi: <strong>{rsvps.length}</strong></p>
          <p>Total Tamu Akan Hadir: <strong>{totalAttending}</strong></p>
          <p>Total Pesan & Doa: <strong>{messages.length}</strong></p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Daftar Konfirmasi Kehadiran ({rsvps.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-50"><th className="p-3 font-semibold text-sm text-gray-600">Nama</th><th className="p-3 font-semibold text-sm text-gray-600">Status</th><th className="p-3 font-semibold text-sm text-gray-600">Tamu</th></tr>
              </thead>
              <tbody>
                {rsvps.length > 0 ? rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{rsvp.name}</td>
                    <td className="p-3 text-gray-600">{rsvp.attendance}</td>
                    <td className="p-3 text-gray-600">{rsvp.attendance === 'Hadir' ? rsvp.guests : '-'}</td>
                  </tr>
                )) : (<tr><td colSpan="3" className="p-3 text-center text-gray-500">Belum ada data RSVP.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pesan & Doa Masuk ({messages.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-50"><th className="p-3 font-semibold text-sm text-gray-600 w-1/4">Dari</th><th className="p-3 font-semibold text-sm text-gray-600 w-3/4">Pesan</th></tr>
              </thead>
              <tbody>
                {messages.length > 0 ? messages.map((msg) => (
                  <tr key={msg.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800 align-top">{msg.name}</td>
                    <td className="p-3 text-gray-600 whitespace-pre-wrap">{msg.message}</td>
                  </tr>
                )) : (<tr><td colSpan="2" className="p-3 text-center text-gray-500">Belum ada pesan yang masuk.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <a href="/" className="inline-block mt-8 bg-[#205781] text-white py-2 px-4 rounded hover:bg-[#4F959D] transition-colors">&larr; Kembali ke Undangan</a>
      </div>
    </div>
  );
};

const InvitationPage = ({ onRsvpSubmit, messages }) => (
  <main className="bg-white font-sans">
    <HeroSection />
    <CountdownSection />
    <RSVPForm onRsvpSubmit={onRsvpSubmit} />
    <GuestMessages messages={messages} />
    <Footer />
  </main>
);

// --- Main App Component (Router) ---
export default function App() {
  const [rsvps, setRsvps] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchData();
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rsvpCollection = collection(db, 'rsvps');
      const rsvpQuery = query(rsvpCollection, orderBy('timestamp', 'desc'));
      const rsvpSnapshot = await getDocs(rsvpQuery);
      const rsvpList = rsvpSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRsvps(rsvpList);
      let messageList = rsvpList.filter(rsvp => rsvp.message && rsvp.message.trim() !== '');
      setMessages(messageList);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      // Fallback jika gagal fetch data
      setMessages([
        { id: 'gagal1', name: 'Keluarga Sahabat', message: 'Semoga keluarga yang ditinggalkan diberi kekuatan dan ketabahan.' },
        { id: 'gagal2', name: 'Rekan Kerja', message: 'Turut berduka cita yang mendalam.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpSubmit = async (formData) => {
    try {
      const dataToSubmit = {
        ...formData,
        guests: formData.attendance === 'Hadir' ? parseInt(formData.guests, 10) || 1 : 0,
        timestamp: new Date()
      };
      await addDoc(collection(db, "rsvps"), dataToSubmit);
      fetchData(); // Fetch ulang data setelah submit untuk mendapatkan data terbaru
    } catch (e) {
      console.error("Error menambahkan dokumen: ", e);
    }
  };

  if (loading && user === undefined) {
    return <div className="min-h-screen flex items-center justify-center font-serif text-xl text-[#205781]">Memuat Undangan...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvitationPage onRsvpSubmit={handleRsvpSubmit} messages={messages} />} />
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              <AdminPage rsvps={rsvps} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
