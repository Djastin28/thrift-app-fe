import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getConditionLabel(condition) {
  const labels = {
    new: "Baru",
    like_new: "Seperti Baru",
    used: "Bekas",
  };
  return labels[condition] || condition;
}

export function getOrderStatusLabel(status) {
  const labels = {
    pending: "Menunggu",
    confirmed: "Dikonfirmasi",
    processing: "Diproses",
    shipped: "Dikirim",
    delivered: "Selesai",
    cancelled: "Dibatalkan",
  };
  return labels[status] || status;
}

export function getPaymentStatusLabel(status) {
  const labels = {
    unpaid: "Belum Dibayar",
    paid: "Sudah Dibayar",
    refunded: "Dikembalikan",
  };
  return labels[status] || status;
}

export function getPaymentMethodLabel(method) {
  const labels = {
    transfer: "Transfer Bank",
    cod: "Bayar di Tempat (COD)",
    ewallet: "E-Wallet",
  };
  return labels[method] || method;
}
