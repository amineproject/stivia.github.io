/**
 * Utilitas Integrasi WhatsApp untuk Top-Up Saldo Prompt STIVIA
 * Memudahkan guru dan pendidik menghubungi Administrator untuk pembelian saldo secara instan.
 */

// Nomor WhatsApp default Admin STIVIA (Dapat disesuaikan via variabel lingkungan atau di sini)
export const DEFAULT_ADMIN_WHATSAPP = '6281234567890';

export interface WhatsAppTopUpOptions {
  userEmail?: string | null;
  userName?: string | null;
  planName?: string | null;
  prompts?: number | null;
  priceLabel?: string | null;
}

/**
 * Menghasilkan URL tautan chat WhatsApp dengan pesan pesan template otomatis yang rapi dan sopan.
 */
export function getWhatsAppTopUpUrl(options?: WhatsAppTopUpOptions): string {
  // Ambil nomor dari environment jika ada, jika tidak gunakan default
  const rawNumber = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_WHATSAPP_NUMBER) || DEFAULT_ADMIN_WHATSAPP;
  // Bersihkan karakter non-numerik
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

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
