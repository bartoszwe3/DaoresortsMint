import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, CheckCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function LeadGenModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ imie: '', telefon: '' });
  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imie || !formData.telefon) return;
    
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
              <h3 className="font-playfair text-2xl text-[#F5F0E8] font-bold mb-2">Porozmawiajmy</h3>
              <p className="text-[#8A9E8A] text-sm">Zostaw numer - oddzwonimy i odpowiemy na wszystkie pytania o resorcie.</p>
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
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-[#2D5A3D]" />
                </div>
                <input 
                  type="text" 
                  placeholder="Imię"
                  required
                  className="w-full bg-[#0E1208] border border-[#2D5A3D] rounded-none pl-11 pr-4 py-3.5 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  value={formData.imie}
                  onChange={(e) => setFormData({...formData, imie: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-[#2D5A3D]" />
                </div>
                <input 
                  type="tel" 
                  placeholder="Numer telefonu"
                  required
                  className="w-full bg-[#0E1208] border border-[#2D5A3D] rounded-none pl-11 pr-4 py-3.5 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  value={formData.telefon}
                  onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                />
              </div>

              <button 
                type="button"
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                className="w-full bg-[#C9A84C] hover:bg-[#b09342] text-[#0E1208] font-sans font-bold py-4 rounded-none transition-all shadow-btn-primary hover:shadow-btn-primary-hover flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {status === 'submitting' ? 'Wysyłanie...' : 'Zadzwoń do mnie →'}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-xs text-center">Wystąpił błąd. Spróbuj ponownie później.</p>
              )}
            </div>
          )}

          <p className="mt-8 text-[10px] text-[#8A9E8A] text-center leading-relaxed opacity-60">
            Klikając przycisk, wyrażasz zgodę na kontakt telefoniczny w celu przedstawienia szczegółów projektu DAOResorts.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
