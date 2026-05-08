import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, CheckCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function LeadGenModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ imie: '', telefon: '' });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imie || !formData.telefon || !consent) return;
    
    // Walidacja numeru telefonu (9-12 cyfr, po oczyszczeniu ze spacji/znaków)
    const cleanedPhone = formData.telefon.replace(/\D/g, '');
    if (cleanedPhone.length < 9 || cleanedPhone.length > 12) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          zrodlo: 'navbar_modal' 
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus(null);
          setFormData({ imie: '', telefon: '' });
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0E1208]/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#1C2614] border border-[#2D5A3D]/40 rounded-2xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative gold glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9A84C]/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-playfair text-2xl text-[#F5F0E8] font-bold mb-2">Zarezerwuj miejsce</h3>
              <p className="text-[#8A9E8A] text-sm">Zabezpiecz swoje miejsce w pierwszym prywatnym klubie wakacyjnym w Polsce.</p>
            </div>
            <button 
              onClick={onClose}
              className="text-[#8A9E8A] hover:text-[#C9A84C] transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <CheckCircle size={48} className="text-[#C9A84C] mb-4" />
              <h4 className="text-[#F5F0E8] text-lg font-medium mb-2">Dziękujemy!</h4>
              <p className="text-[#8A9E8A] text-sm">Twoja wiadomość została wysłana. Bartosz oddzwoni do Ciebie wkrótce.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
                <a 
                  href="/kontakt"
                  style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '18px', padding: '16px 40px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#B8973B'}
                  onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
                  className="w-full flex items-center justify-center text-center"
                >
                  Umów bezpłatną rozmowę →
                </a>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#F5F0E8', fontSize: '14px', opacity: 0.75, textAlign: 'center', maxWidth: '400px' }}>
                  2 000 PLN wchodzi w poczet budowy fundamentów po podpisaniu umowy docelowej i uzyskaniu pozwolenia na budowę. Do tego momentu depozyt jest w 100% zwrotny.
                </p>
                <p className="text-[#8A9E8A] text-xs text-center mt-2">
                  Masz pytania? Napisz na <a href="mailto:bartosz@silna.club" className="text-[#C9A84C] hover:underline">bartosz@silna.club</a>
                </p>
              </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
