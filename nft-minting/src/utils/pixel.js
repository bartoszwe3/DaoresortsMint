// src/utils/pixel.js

/**
 * Śledzi standardowe zdarzenia Meta Pixel
 * @param {string} eventName - Nazwa zdarzenia (np. 'PageView', 'Lead', 'Purchase')
 * @param {object} options - Dodatkowe dane zdarzenia
 */
export const trackPixelEvent = (eventName, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, options);
    console.log(`[Meta Pixel] Tracked: ${eventName}`, options);
  }
};

/**
 * Śledzi niestandardowe zdarzenia Meta Pixel
 * @param {string} eventName - Nazwa zdarzenia
 * @param {object} options - Dodatkowe dane zdarzenia
 */
export const trackCustomPixelEvent = (eventName, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, options);
    console.log(`[Meta Pixel] Tracked Custom: ${eventName}`, options);
  }
};
