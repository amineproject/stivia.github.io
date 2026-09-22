/**
 * Utilitas Integrasi WhatsApp untuk Top-Up Saldo Prompt STIVIA
 * Memudahkan guru dan pendidik menghubungi Administrator untuk pembelian saldo secara instan.
 */

// Nomor WhatsApp bawaan Admin STIVIA jika belum diatur
export const DEFAULT_ADMIN_WHATSAPP = '6281234567890';

export interface WhatsAppTopUpOptions {
  userEmail?: string | null;
  userName?: string | null;
  planName?: string | null;
  prompts?: number | null;
  priceLabel?: string | null;
}

/**
 * Membersihkan dan memformat nomor WhatsApp ke standar internasional (contoh: 0812... -> 62812...)
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Mengambil nomor WhatsApp Admin aktif (prioritas: Pengaturan LocalStorage Admin > ENV > Default)
 */
export function getAdminWhatsAppNumber(): string {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('stivia_admin_whatsapp_number');
      if (stored && stored.trim().length >= 8) {
        return formatWhatsAppNumber(stored.trim());
      }
    } catch {
      // ignore
    }
  }

  const envNumber = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_ADMIN_WHATSAPP_NUMBER : '';
  if (envNumber && envNumber.trim().length >= 8) {
    return formatWhatsAppNumber(envNumber.trim());
  }

  return DEFAULT_ADMIN_WHATSAPP;
}

/**
 * Menyimpan nomor WhatsApp Admin baru (dapat diubah langsung dari UI oleh Admin)
 */
export function setAdminWhatsAppNumber(phoneNumber: string): string {
  const formatted = formatWhatsAppNumber(phoneNumber);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('stivia_admin_whatsapp_number', formatted);
    } catch {
      // ignore
    }
  }
  return formatted;
}

/**
 * Menghasilkan URL tautan chat WhatsApp dengan pesan template otomatis yang rapi dan sopan.
 */
export function getWhatsAppTopUpUrl(options?: WhatsAppTopUpOptions): string {
  const cleanNumber = getAdminWhatsAppNumber();

  const email = options?.userEmail || 'Email belum diisi';
  const name = options?.userName ? ` (${options.userName})` : '';
  const packageChoice = options?.planName 
    ? `${options.planName}${options.priceLabel ? ` - ${options.priceLabel}` : ''}`
    : 'Paket Saldo Prompt STIVIA';

  const messageLines = [
    'Halo Admin STIVIA! 👋',
    '',
    'Saya ingin melakukan top-up Saldo Prompt untuk akun saya di aplikasi STIVIA:',
    `• Email Akun : ${email}${name}`,
    `• Paket Pilihan : ${packageChoice}`,
    options?.prompts ? `• Jumlah Saldo : +${options.prompts} Prompt` : '',
    '',
    'Mohon petunjuk rekening tujuan transfer / kode QRIS pembayarannya. Terima kasih banyak!',
  ].filter((line) => line !== '');

  const encodedText = encodeURIComponent(messageLines.join('\n'));
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
