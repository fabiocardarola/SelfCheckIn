import { RegistrationLanguage } from './registration-copy';

export const REGISTRATION_API_COPY: Record<RegistrationLanguage, { loading: string; saving: string; error: string; retry: string }> = {
  it: { loading: 'Caricamento dei dati salvati…', saving: 'Salvataggio dei dati…', error: 'Operazione non riuscita. I dati non sono stati confermati. Riprova; se il problema persiste, contatta la struttura.', retry: 'Riprova' },
  en: { loading: 'Loading saved guests…', saving: 'Saving guest details…', error: 'The operation failed. Your details have not been confirmed. Try again; if the problem persists, contact your host.', retry: 'Retry' },
  pl: { loading: 'Wczytywanie zapisanych danych…', saving: 'Zapisywanie danych…', error: 'Operacja nie powiodła się. Dane nie zostały potwierdzone. Spróbuj ponownie; jeśli problem nie ustąpi, skontaktuj się z gospodarzem.', retry: 'Spróbuj ponownie' },
  fr: { loading: 'Chargement des données enregistrées…', saving: 'Enregistrement des données…', error: 'L’opération a échoué. Vos données n’ont pas été confirmées. Réessayez ; si le problème persiste, contactez votre hôte.', retry: 'Réessayer' },
  de: { loading: 'Gespeicherte Daten werden geladen…', saving: 'Daten werden gespeichert…', error: 'Der Vorgang ist fehlgeschlagen. Deine Daten wurden nicht bestätigt. Versuche es erneut; wenn das Problem weiterhin besteht, kontaktiere deine Unterkunft.', retry: 'Erneut versuchen' },
  es: { loading: 'Cargando los datos guardados…', saving: 'Guardando los datos…', error: 'La operación ha fallado. Tus datos no se han confirmado. Inténtalo de nuevo; si el problema persiste, contacta con el alojamiento.', retry: 'Reintentar' },
  pt: { loading: 'A carregar os dados guardados…', saving: 'A guardar os dados…', error: 'A operação falhou. Os seus dados não foram confirmados. Tente novamente; se o problema persistir, contacte o alojamento.', retry: 'Tentar novamente' },
  ko: { loading: '저장된 정보를 불러오는 중…', saving: '정보를 저장하는 중…', error: '작업에 실패했습니다. 정보가 확인되지 않았습니다. 다시 시도하고 문제가 계속되면 숙소에 문의하세요.', retry: '다시 시도' },
  ja: { loading: '保存済みの情報を読み込んでいます…', saving: '情報を保存しています…', error: '処理に失敗しました。情報は確認されていません。再試行し、問題が続く場合は宿泊施設にご連絡ください。', retry: '再試行' },
  zh: { loading: '正在加载已保存的信息…', saving: '正在保存信息…', error: '操作失败，信息尚未确认。请重试；如果问题仍然存在，请联系住宿方。', retry: '重试' }
};
