import raw from "../../data/profile.json";

export interface Profile {
  name: string;
  title: string;
  company?: string;
  photo: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
  mobile?: string;
  email?: string;
  website?: string;
  website_label?: string;
  location_url?: string;
  address?: string;
  office_address?: string;
  tags?: string[];
  whatsapp_prefill?: string;
  note?: string;
  form_url?: string;
}

export const profile: Profile = raw;

/** Digits only, for wa.me links */
export function whatsappDigits(phone?: string): string {
  return (phone || "").replace(/\D/g, "");
}

export function whatsappUrl(phone?: string, text?: string): string {
  const digits = whatsappDigits(phone);
  if (!digits) return "#";
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function telUrl(phone?: string): string {
  if (!phone) return "#";
  const normalized = phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;
  return `tel:${normalized}`;
}

export function mailtoUrl(email?: string): string {
  return email ? `mailto:${email}` : "#";
}
