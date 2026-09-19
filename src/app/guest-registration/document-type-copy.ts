import { RegistrationLanguage } from './registration-copy';

type DocumentCode = 'IDENT' | 'IDELE' | 'CERID' | 'PASOR' | 'PATEN';

const DOCUMENT_TYPE_COPY: Record<RegistrationLanguage, Record<DocumentCode, string>> = {
  it: { IDENT: 'Carta di identità', IDELE: 'Carta d’identità elettronica', CERID: 'Certificato d’identità', PASOR: 'Passaporto ordinario', PATEN: 'Patente di guida' },
  en: { IDENT: 'Identity card', IDELE: 'Electronic identity card', CERID: 'Identity certificate', PASOR: 'Ordinary passport', PATEN: 'Driving licence' },
  pl: { IDENT: 'Dowód osobisty', IDELE: 'Elektroniczny dowód osobisty', CERID: 'Zaświadczenie tożsamości', PASOR: 'Paszport zwykły', PATEN: 'Prawo jazdy' },
  fr: { IDENT: 'Carte d’identité', IDELE: 'Carte d’identité électronique', CERID: 'Certificat d’identité', PASOR: 'Passeport ordinaire', PATEN: 'Permis de conduire' },
  de: { IDENT: 'Personalausweis', IDELE: 'Elektronischer Personalausweis', CERID: 'Identitätsbescheinigung', PASOR: 'Gewöhnlicher Reisepass', PATEN: 'Führerschein' },
  es: { IDENT: 'Documento de identidad', IDELE: 'Identificación electrónica', CERID: 'Certificado de identidad', PASOR: 'Pasaporte ordinario', PATEN: 'Permiso de conducir' },
  pt: { IDENT: 'Bilhete de identidade', IDELE: 'Identidade eletrónica', CERID: 'Certificado de identidade', PASOR: 'Passaporte comum', PATEN: 'Carta de condução' },
  ko: { IDENT: '신분증', IDELE: '전자 신분증', CERID: '신원 증명서', PASOR: '일반 여권', PATEN: '운전면허증' },
  ja: { IDENT: '身分証明書', IDELE: '電子身分証明書', CERID: '身元証明書', PASOR: '一般旅券', PATEN: '運転免許証' },
  zh: { IDENT: '身份证', IDELE: '电子身份证', CERID: '身份证明', PASOR: '普通护照', PATEN: '驾驶证' }
};

export function documentTypeLabel(code: string, language: RegistrationLanguage, fallback = ''): string {
  const normalizedCode = code === 'P' ? 'PASOR' : code;
  const labels: Readonly<Record<string, string>> = DOCUMENT_TYPE_COPY[language];
  return Object.hasOwn(labels, normalizedCode) ? labels[normalizedCode] : fallback || code;
}
