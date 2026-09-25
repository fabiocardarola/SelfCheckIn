import { RegistrationLanguage } from '../guest-registration/registration-copy';

export const PRIVACY_NOTICE_VERSION = '2026-09-25.1';
export interface PrivacyCopy {
  title: string;
  read: string;
  close: string;
  acknowledge: string;
  exit: string;
  heading: string;
  intro: string;
  explanation: string;
  exitTitle: string;
  exitText: string;
  return: string;
  saving: string;
  error: string;
  versionLabel: string;
  sections: { title: string; text: string }[];
}
export const PRIVACY_COPY: Record<RegistrationLanguage, PrivacyCopy> = {
  "it": {
    "title": "Informativa privacy",
    "read": "Leggi l’informativa privacy",
    "close": "Chiudi",
    "acknowledge": "Ho letto, continua",
    "exit": "Esci dal check-in",
    "heading": "La tua privacy è importante",
    "intro": "Prima di inserire i dati degli ospiti, consulta l’informativa di EnDimension s.r.l.",
    "explanation": "Il trattamento necessario alla prenotazione e agli obblighi di legge non richiede il tuo consenso. Il pulsante registra la presa visione.",
    "exitTitle": "Check-in interrotto",
    "exitText": "Puoi tornare all’informativa e riprendere il percorso. Per assistenza contatta l’host.",
    "return": "Torna all’informativa",
    "saving": "Salvataggio…",
    "error": "Impossibile salvare la presa visione. Riprova.",
    "versionLabel": "Versione",
    "sections": [
      {
        "title": "Titolare e contatti",
        "text": "Il titolare del trattamento è EnDimension s.r.l., Vicolo Del Curato 10, 00186 Roma (RM), P.IVA/CF 16855661001, REA RM-1679873. Per informazioni e per esercitare i tuoi diritti: info@endimension.eu."
      },
      {
        "title": "Dati e provenienza",
        "text": "Trattiamo i dati della prenotazione (nominativo, codice, struttura, date e numero di ospiti), i dati anagrafici, lo Stato di residenza, gli estremi dei documenti, la lingua, gli accessi e l’avanzamento del self check-in. Provengono da Airbnb o dal canale di prenotazione, da te se ci contatti direttamente, oppure da chi compila il check-in per tuo conto. Se inserisci i dati degli accompagnatori, rendi disponibile anche a loro questa informativa."
      },
      {
        "title": "Finalità e basi giuridiche",
        "text": "Gestiamo prenotazione, soggiorno e self check-in per eseguire il contratto o le misure precontrattuali richieste, ove applicabile (art. 6.1.b GDPR). Trattiamo inoltre i dati per identificare gli ospiti e comunicarli alla Polizia di Stato tramite Alloggiati Web, ai sensi dell’art. 109 TULPS, e per gli obblighi statistici della Regione Lazio tramite ROSS1000 (art. 6.1.c GDPR). Questi trattamenti necessari non richiedono consenso; il pulsante conferma la presa visione."
      },
      {
        "title": "Dati necessari",
        "text": "Senza i dati obbligatori non possiamo completare gli adempimenti e il check-in. Se hai difficoltà a utilizzare il servizio, contatta l’host."
      },
      {
        "title": "Destinatari",
        "text": "Accedono ai dati il personale autorizzato e i fornitori informatici che operano per conto del titolare, nominati responsabili quando necessario. Utilizziamo un server virtuale Register.it e backup Acronis. I dati richiesti sono comunicati alla Polizia di Stato e alla Regione Lazio tramite ROSS1000; le autorità li trattano secondo la propria disciplina. Non diffondiamo i dati al pubblico."
      },
      {
        "title": "Conservazione",
        "text": "I dati destinati esclusivamente alla pubblica sicurezza vengono rimossi dagli archivi operativi dopo l’acquisizione della ricevuta di avvenuta comunicazione. Quelli necessari alla statistica vengono mantenuti fino alla conferma di acquisizione dei movimenti dovuti da parte di ROSS1000. I dati condivisi vengono rimossi dopo entrambi gli adempimenti. La rimozione elimina o sostituisce definitivamente il valore originale, non lo nasconde soltanto sullo schermo. Le ricevute Alloggiati Web sono conservate separatamente per cinque anni. Eventuali dati necessari a distinti obblighi fiscali e contabili sono conservati separatamente per i termini di legge. La cancellazione nei nostri sistemi non cancella i dati presso le autorità."
      },
      {
        "title": "Profilazione",
        "text": "Non effettuiamo profilazione né adottiamo decisioni basate unicamente su trattamenti automatizzati con effetti giuridici o analogamente significativi sugli ospiti."
      },
      {
        "title": "Diritti",
        "text": "Nei limiti previsti dal GDPR puoi chiedere accesso, rettifica, cancellazione e limitazione, nonché portabilità e opposizione quando applicabili. La cancellazione non prevale sugli obblighi legali di conservazione. Scrivi a info@endimension.eu: il riscontro avviene di norma entro un mese; eventuali proroghe ti saranno comunicate. Puoi presentare reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) o all’autorità competente. Informativa ai sensi degli artt. 13 e, ove applicabile, 14 GDPR."
      }
    ]
  },
  "en": {
    "title": "Privacy notice",
    "read": "Read the privacy notice",
    "close": "Close",
    "acknowledge": "I have read it, continue",
    "exit": "Exit check-in",
    "heading": "Your privacy matters",
    "intro": "Before entering guest details, consult EnDimension s.r.l.’s privacy notice.",
    "explanation": "Processing needed for your booking and legal duties does not require consent. The button records acknowledgement of the notice.",
    "exitTitle": "Check-in interrupted",
    "exitText": "You can return to the notice and resume. Contact your host for assistance.",
    "return": "Return to the notice",
    "saving": "Saving…",
    "error": "Unable to save acknowledgement. Please try again.",
    "versionLabel": "Version",
    "sections": [
      {
        "title": "Controller and contact",
        "text": "The controller is EnDimension s.r.l., Vicolo Del Curato 10, 00186 Rome (RM), Italy, VAT/tax ID 16855661001, REA RM-1679873. For information and rights requests: info@endimension.eu."
      },
      {
        "title": "Data and sources",
        "text": "We process booking details (name, reference, property, dates and guest count), personal particulars, country of residence, identity document details, language, access and check-in progress. Data come from Airbnb or your booking channel, directly from you, or from the person completing check-in on your behalf. If you enter companions’ details, make this notice available to them too."
      },
      {
        "title": "Purposes and legal bases",
        "text": "We manage bookings, stays and check-in to perform the contract or requested pre-contractual steps, where applicable (GDPR Art. 6(1)(b)). We also identify guests and report required details to the Italian State Police through Alloggiati Web under Art. 109 TULPS, and fulfil Lazio Region’s statistical duties through ROSS1000 (GDPR Art. 6(1)(c)). These necessary activities do not require consent; the button acknowledges the notice."
      },
      {
        "title": "Required details",
        "text": "Without mandatory details we cannot complete the legal formalities and check-in. Contact your host if you have difficulty using the service."
      },
      {
        "title": "Recipients",
        "text": "Authorised staff and IT suppliers acting on the controller’s behalf may access data; suppliers are appointed as processors where required. We use a Register.it virtual server and Acronis backups. Required data go to the Italian State Police and Lazio Region through ROSS1000; the authorities process them under their own rules. Data are not made public."
      },
      {
        "title": "Retention",
        "text": "Data used only for public-security reporting are removed from operational records after receipt of the submission acknowledgement. Data needed for statistics are retained until ROSS1000 confirms acquisition of the required movements. Shared data are removed after both duties are completed. Removal deletes or permanently replaces the original value, rather than merely hiding it on screen. Alloggiati Web receipts are stored separately for five years. Data needed for separate tax or accounting duties are kept separately for the statutory periods. Deletion in our systems does not delete data held by the authorities."
      },
      {
        "title": "Profiling",
        "text": "We do not carry out profiling or make solely automated decisions that have legal or similarly significant effects on guests."
      },
      {
        "title": "Your rights",
        "text": "Subject to GDPR conditions, you may request access, rectification, erasure and restriction, and portability or object where applicable. Erasure does not override legal retention duties. Write to info@endimension.eu; we normally respond within one month and notify you of any extension. You may complain to the Italian data protection authority (www.garanteprivacy.it) or the competent authority. Notice under GDPR Arts. 13 and, where applicable, 14."
      }
    ]
  },
  "pl": {
    "title": "Informacja o prywatności",
    "read": "Przeczytaj informację o prywatności",
    "close": "Zamknij",
    "acknowledge": "Przeczytano, kontynuuj",
    "exit": "Zakończ meldowanie",
    "heading": "Twoja prywatność jest ważna",
    "intro": "Przed wpisaniem danych gości zapoznaj się z informacją EnDimension s.r.l.",
    "explanation": "Przetwarzanie niezbędne do rezerwacji i obowiązków prawnych nie wymaga zgody. Przycisk potwierdza zapoznanie się z informacją.",
    "exitTitle": "Meldowanie przerwane",
    "exitText": "Możesz wrócić do informacji i kontynuować. W razie potrzeby skontaktuj się z gospodarzem.",
    "return": "Wróć do informacji",
    "saving": "Zapisywanie…",
    "error": "Nie udało się zapisać potwierdzenia. Spróbuj ponownie.",
    "versionLabel": "Wersja",
    "sections": [
      {
        "title": "Administrator i kontakt",
        "text": "Administratorem jest EnDimension s.r.l., Vicolo Del Curato 10, 00186 Rzym (RM), Włochy, numer VAT/podatkowy 16855661001, REA RM-1679873. Informacje i realizacja praw: info@endimension.eu."
      },
      {
        "title": "Dane i ich źródła",
        "text": "Przetwarzamy dane rezerwacji (nazwisko, numer, obiekt, daty i liczba gości), dane osobowe, kraj zamieszkania, dane dokumentu tożsamości, język, dostęp i postęp meldowania. Dane pochodzą z Airbnb lub kanału rezerwacji, bezpośrednio od Ciebie albo od osoby wypełniającej formularz w Twoim imieniu. Udostępnij tę informację również osobom towarzyszącym, których dane wpisujesz."
      },
      {
        "title": "Cele i podstawy prawne",
        "text": "Obsługujemy rezerwację, pobyt i meldowanie w celu wykonania umowy lub żądanych działań przedumownych, gdy ma to zastosowanie (art. 6 ust. 1 lit. b RODO). Identyfikujemy gości i przekazujemy wymagane dane włoskiej Policji przez Alloggiati Web na podstawie art. 109 TULPS oraz realizujemy obowiązki statystyczne Regionu Lacjum przez ROSS1000 (art. 6 ust. 1 lit. c RODO). Zgoda nie jest wymagana; przycisk potwierdza zapoznanie się z informacją."
      },
      {
        "title": "Dane obowiązkowe",
        "text": "Bez danych obowiązkowych nie możemy dopełnić formalności ani meldowania. W razie trudności skontaktuj się z gospodarzem."
      },
      {
        "title": "Odbiorcy",
        "text": "Dostęp mają upoważnieni pracownicy i dostawcy IT działający w imieniu administratora, wyznaczeni jako podmioty przetwarzające, gdy jest to wymagane. Korzystamy z serwera wirtualnego Register.it i kopii Acronis. Wymagane dane otrzymują Policja i Region Lacjum przez ROSS1000, zgodnie z własnymi przepisami. Danych nie upubliczniamy."
      },
      {
        "title": "Przechowywanie",
        "text": "Dane służące wyłącznie zgłoszeniu policyjnemu usuwamy z rejestrów operacyjnych po otrzymaniu potwierdzenia zgłoszenia. Dane statystyczne przechowujemy do potwierdzenia przyjęcia wymaganych informacji przez ROSS1000. Dane wspólne usuwamy po obu czynnościach. Usunięcie oznacza skasowanie lub trwałe zastąpienie wartości, a nie tylko ukrycie na ekranie. Potwierdzenia Alloggiati Web przechowujemy oddzielnie przez pięć lat. Dane do odrębnych obowiązków podatkowych lub księgowych przechowujemy oddzielnie przez okres ustawowy. Usunięcie u nas nie usuwa danych u władz."
      },
      {
        "title": "Profilowanie",
        "text": "Nie profilujemy gości ani nie podejmujemy decyzji wyłącznie automatycznych wywołujących skutki prawne lub podobnie istotne."
      },
      {
        "title": "Prawa",
        "text": "Na warunkach RODO możesz żądać dostępu, sprostowania, usunięcia i ograniczenia, a w odpowiednich przypadkach przenoszenia danych i wnieść sprzeciw. Usunięcie nie uchyla obowiązków prawnych. Napisz na info@endimension.eu; zwykle odpowiadamy w ciągu miesiąca, informując o przedłużeniu. Możesz wnieść skargę do włoskiego organu ochrony danych (www.garanteprivacy.it) lub właściwego organu. Informacja na podstawie art. 13 i, gdy dotyczy, art. 14 RODO."
      }
    ]
  },
  "fr": {
    "title": "Information sur la confidentialité",
    "read": "Lire l’information sur la confidentialité",
    "close": "Fermer",
    "acknowledge": "J’ai lu, continuer",
    "exit": "Quitter le check-in",
    "heading": "Votre vie privée compte",
    "intro": "Avant de saisir les données des voyageurs, consultez l’information d’EnDimension s.r.l.",
    "explanation": "Les traitements nécessaires à la réservation et aux obligations légales ne nécessitent pas de consentement. Le bouton enregistre la prise de connaissance.",
    "exitTitle": "Check-in interrompu",
    "exitText": "Vous pouvez revenir à l’information et reprendre. Contactez votre hôte pour obtenir de l’aide.",
    "return": "Revenir à l’information",
    "saving": "Enregistrement…",
    "error": "Impossible d’enregistrer la prise de connaissance. Réessayez.",
    "versionLabel": "Version",
    "sections": [
      {
        "title": "Responsable et contact",
        "text": "Le responsable du traitement est EnDimension s.r.l., Vicolo Del Curato 10, 00186 Rome (RM), Italie, TVA/identifiant fiscal 16855661001, REA RM-1679873. Informations et droits : info@endimension.eu."
      },
      {
        "title": "Données et sources",
        "text": "Nous traitons les données de réservation (nom, référence, hébergement, dates et nombre de voyageurs), l’état civil, le pays de résidence, les références des pièces d’identité, la langue, les accès et la progression du check-in. Elles proviennent d’Airbnb ou du canal de réservation, directement de vous ou de la personne remplissant le formulaire pour vous. Communiquez cette information aux accompagnateurs dont vous saisissez les données."
      },
      {
        "title": "Finalités et bases légales",
        "text": "Nous gérons la réservation, le séjour et le check-in pour exécuter le contrat ou les mesures précontractuelles demandées, le cas échéant (art. 6.1.b RGPD). Nous identifions les voyageurs et transmettons les données requises à la Police italienne via Alloggiati Web selon l’art. 109 TULPS, et remplissons les obligations statistiques de la Région du Latium via ROSS1000 (art. 6.1.c RGPD). Ces traitements ne nécessitent pas de consentement ; le bouton confirme la prise de connaissance."
      },
      {
        "title": "Données obligatoires",
        "text": "Sans les données obligatoires, nous ne pouvons achever les formalités et le check-in. Contactez votre hôte en cas de difficulté."
      },
      {
        "title": "Destinataires",
        "text": "Le personnel autorisé et les fournisseurs informatiques agissant pour le responsable ont accès aux données, avec désignation comme sous-traitants si nécessaire. Nous utilisons un serveur virtuel Register.it et des sauvegardes Acronis. Les données requises sont transmises à la Police et à la Région du Latium via ROSS1000, qui les traitent selon leurs règles. Elles ne sont pas rendues publiques."
      },
      {
        "title": "Conservation",
        "text": "Les données servant uniquement à la déclaration de sécurité publique sont supprimées des archives opérationnelles après réception de l’accusé de transmission. Les données statistiques sont conservées jusqu’à confirmation par ROSS1000 de l’acquisition des mouvements requis. Les données communes sont supprimées après les deux formalités. La suppression efface ou remplace définitivement la valeur originale, sans se limiter à la masquer à l’écran. Les reçus Alloggiati Web sont conservés séparément cinq ans. Les données nécessaires aux obligations fiscales ou comptables distinctes sont conservées séparément selon les délais légaux. Leur suppression chez nous ne les supprime pas auprès des autorités."
      },
      {
        "title": "Profilage",
        "text": "Nous ne réalisons aucun profilage ni décision exclusivement automatisée produisant des effets juridiques ou similaires significatifs sur les voyageurs."
      },
      {
        "title": "Droits",
        "text": "Selon les conditions du RGPD, vous pouvez demander accès, rectification, effacement, limitation et, le cas échéant, portabilité ou opposition. L’effacement ne prime pas sur les obligations légales de conservation. Écrivez à info@endimension.eu : réponse normalement sous un mois, avec notification d’une éventuelle prolongation. Réclamation possible auprès du Garante italien (www.garanteprivacy.it) ou de l’autorité compétente. Information selon les art. 13 et, le cas échéant, 14 RGPD."
      }
    ]
  },
  "de": {
    "title": "Datenschutzhinweise",
    "read": "Datenschutzhinweise lesen",
    "close": "Schließen",
    "acknowledge": "Gelesen, weiter",
    "exit": "Check-in verlassen",
    "heading": "Deine Privatsphäre ist wichtig",
    "intro": "Lies vor der Eingabe der Gästedaten die Datenschutzhinweise von EnDimension s.r.l.",
    "explanation": "Für Buchung und gesetzliche Pflichten notwendige Verarbeitung erfordert keine Einwilligung. Der Button bestätigt die Kenntnisnahme.",
    "exitTitle": "Check-in unterbrochen",
    "exitText": "Du kannst zu den Hinweisen zurückkehren und fortfahren. Bei Fragen kontaktiere deinen Gastgeber.",
    "return": "Zurück zu den Hinweisen",
    "saving": "Speichern…",
    "error": "Kenntnisnahme konnte nicht gespeichert werden. Bitte erneut versuchen.",
    "versionLabel": "Version",
    "sections": [
      {
        "title": "Verantwortlicher und Kontakt",
        "text": "Verantwortlicher ist EnDimension s.r.l., Vicolo Del Curato 10, 00186 Rom (RM), Italien, Umsatzsteuer-/Steuernummer 16855661001, REA RM-1679873. Auskunft und Betroffenenrechte: info@endimension.eu."
      },
      {
        "title": "Daten und Herkunft",
        "text": "Wir verarbeiten Buchungsdaten (Name, Referenz, Unterkunft, Daten und Gästezahl), Personalien, Wohnsitzland, Ausweisdaten, Sprache, Zugriffe und Check-in-Fortschritt. Sie stammen von Airbnb oder dem Buchungskanal, direkt von dir oder von der Person, die den Check-in für dich ausfüllt. Stelle diese Hinweise auch Begleitpersonen bereit, deren Daten du eingibst."
      },
      {
        "title": "Zwecke und Rechtsgrundlagen",
        "text": "Wir verwalten Buchung, Aufenthalt und Check-in zur Vertragserfüllung bzw. angeforderten vorvertraglichen Maßnahmen, soweit zutreffend (Art. 6 Abs. 1 lit. b DSGVO). Wir identifizieren Gäste und melden erforderliche Daten gemäß Art. 109 TULPS über Alloggiati Web an die italienische Polizei sowie für statistische Pflichten über ROSS1000 an die Region Latium (Art. 6 Abs. 1 lit. c DSGVO). Dafür ist keine Einwilligung erforderlich; der Button bestätigt die Kenntnisnahme."
      },
      {
        "title": "Erforderliche Angaben",
        "text": "Ohne Pflichtangaben können wir die Formalitäten und den Check-in nicht abschließen. Bei Schwierigkeiten wende dich an deinen Gastgeber."
      },
      {
        "title": "Empfänger",
        "text": "Befugte Mitarbeiter und IT-Dienstleister im Auftrag des Verantwortlichen erhalten Zugriff; erforderlichenfalls werden Auftragsverarbeiter bestellt. Wir verwenden einen virtuellen Register.it-Server und Acronis-Backups. Erforderliche Daten gehen an Polizei und Region Latium über ROSS1000; die Behörden verarbeiten sie nach ihren Vorschriften. Es erfolgt keine Veröffentlichung."
      },
      {
        "title": "Speicherung",
        "text": "Nur für die Polizeimeldung benötigte Daten werden nach Eingang der Übermittlungsbestätigung aus den operativen Beständen entfernt. Statistikdaten bleiben bis ROSS1000 den Eingang der erforderlichen Bewegungen bestätigt. Gemeinsam benötigte Daten werden nach beiden Vorgängen entfernt. Dabei wird der Originalwert gelöscht oder endgültig ersetzt, nicht bloß am Bildschirm verborgen. Alloggiati-Web-Belege werden getrennt fünf Jahre aufbewahrt. Für gesonderte Steuer- oder Buchführungspflichten nötige Daten bleiben getrennt für die gesetzlichen Fristen gespeichert. Unsere Löschung entfernt keine Daten bei Behörden."
      },
      {
        "title": "Profiling",
        "text": "Wir betreiben kein Profiling und treffen keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung für Gäste."
      },
      {
        "title": "Rechte",
        "text": "Unter den Voraussetzungen der DSGVO kannst du Auskunft, Berichtigung, Löschung, Einschränkung sowie gegebenenfalls Übertragbarkeit verlangen oder Widerspruch einlegen. Gesetzliche Aufbewahrungspflichten gehen der Löschung vor. Schreibe an info@endimension.eu; wir antworten gewöhnlich binnen eines Monats und informieren über Verlängerungen. Beschwerden sind beim italienischen Garante (www.garanteprivacy.it) oder der zuständigen Aufsicht möglich. Hinweise gemäß Art. 13 und gegebenenfalls 14 DSGVO."
      }
    ]
  },
  "es": {
    "title": "Aviso de privacidad",
    "read": "Leer el aviso de privacidad",
    "close": "Cerrar",
    "acknowledge": "He leído, continuar",
    "exit": "Salir del check-in",
    "heading": "Tu privacidad importa",
    "intro": "Antes de introducir los datos de los huéspedes, consulta el aviso de EnDimension s.r.l.",
    "explanation": "Los tratamientos necesarios para la reserva y las obligaciones legales no requieren consentimiento. El botón registra la lectura del aviso.",
    "exitTitle": "Check-in interrumpido",
    "exitText": "Puedes volver al aviso y continuar. Contacta con tu anfitrión si necesitas ayuda.",
    "return": "Volver al aviso",
    "saving": "Guardando…",
    "error": "No se pudo guardar la confirmación de lectura. Inténtalo de nuevo.",
    "versionLabel": "Versión",
    "sections": [
      {
        "title": "Responsable y contacto",
        "text": "El responsable es EnDimension s.r.l., Vicolo Del Curato 10, 00186 Roma (RM), Italia, IVA/identificación fiscal 16855661001, REA RM-1679873. Información y derechos: info@endimension.eu."
      },
      {
        "title": "Datos y procedencia",
        "text": "Tratamos datos de reserva (nombre, referencia, alojamiento, fechas y número de huéspedes), datos personales, país de residencia, datos del documento de identidad, idioma, accesos y progreso del check-in. Proceden de Airbnb o del canal de reserva, directamente de ti o de quien completa el registro por ti. Facilita este aviso a los acompañantes cuyos datos introduzcas."
      },
      {
        "title": "Finalidades y bases jurídicas",
        "text": "Gestionamos la reserva, estancia y check-in para ejecutar el contrato o medidas precontractuales solicitadas, cuando corresponda (art. 6.1.b RGPD). Identificamos a los huéspedes y comunicamos los datos exigidos a la Policía italiana mediante Alloggiati Web conforme al art. 109 TULPS, y cumplimos las obligaciones estadísticas de la Región del Lacio mediante ROSS1000 (art. 6.1.c RGPD). No requieren consentimiento; el botón confirma la lectura."
      },
      {
        "title": "Datos obligatorios",
        "text": "Sin los datos obligatorios no podemos completar los trámites ni el check-in. Contacta con tu anfitrión si tienes dificultades."
      },
      {
        "title": "Destinatarios",
        "text": "Acceden el personal autorizado y los proveedores informáticos que actúan por cuenta del responsable, designados encargados cuando sea necesario. Utilizamos un servidor virtual Register.it y copias Acronis. Los datos exigidos se comunican a la Policía y a la Región del Lacio mediante ROSS1000, que los tratan conforme a sus normas. No se hacen públicos."
      },
      {
        "title": "Conservación",
        "text": "Los datos exclusivos de la comunicación policial se eliminan de los registros operativos tras recibir el justificante de transmisión. Los datos estadísticos se conservan hasta que ROSS1000 confirme la recepción de los movimientos debidos. Los compartidos se eliminan tras ambos trámites. La eliminación borra o sustituye definitivamente el valor original, no solo lo oculta en pantalla. Los justificantes Alloggiati Web se guardan por separado cinco años. Los datos necesarios para obligaciones fiscales o contables distintas se conservan separadamente durante los plazos legales. La eliminación en nuestros sistemas no elimina datos en poder de las autoridades."
      },
      {
        "title": "Perfiles",
        "text": "No elaboramos perfiles ni adoptamos decisiones exclusivamente automatizadas con efectos jurídicos o similares significativos sobre los huéspedes."
      },
      {
        "title": "Derechos",
        "text": "En las condiciones del RGPD puedes solicitar acceso, rectificación, supresión, limitación y, cuando proceda, portabilidad u oposición. La supresión no prevalece sobre obligaciones legales de conservación. Escribe a info@endimension.eu: respondemos normalmente en un mes e informamos de prórrogas. Puedes reclamar al Garante italiano (www.garanteprivacy.it) o a la autoridad competente. Aviso conforme a los arts. 13 y, cuando proceda, 14 RGPD."
      }
    ]
  },
  "pt": {
    "title": "Informação de privacidade",
    "read": "Ler a informação de privacidade",
    "close": "Fechar",
    "acknowledge": "Li, continuar",
    "exit": "Sair do check-in",
    "heading": "A sua privacidade importa",
    "intro": "Antes de introduzir os dados dos hóspedes, consulte a informação da EnDimension s.r.l.",
    "explanation": "O tratamento necessário à reserva e às obrigações legais não exige consentimento. O botão regista a tomada de conhecimento.",
    "exitTitle": "Check-in interrompido",
    "exitText": "Pode voltar à informação e continuar. Contacte o anfitrião para obter ajuda.",
    "return": "Voltar à informação",
    "saving": "A guardar…",
    "error": "Não foi possível guardar a confirmação. Tente novamente.",
    "versionLabel": "Versão",
    "sections": [
      {
        "title": "Responsável e contacto",
        "text": "O responsável é EnDimension s.r.l., Vicolo Del Curato 10, 00186 Roma (RM), Itália, IVA/número fiscal 16855661001, REA RM-1679873. Informações e direitos: info@endimension.eu."
      },
      {
        "title": "Dados e origem",
        "text": "Tratamos dados da reserva (nome, referência, alojamento, datas e número de hóspedes), dados pessoais, país de residência, elementos dos documentos de identificação, idioma, acessos e progresso do check-in. Provêm da Airbnb ou do canal de reserva, diretamente de si ou de quem preenche o registo em seu nome. Disponibilize esta informação aos acompanhantes cujos dados introduzir."
      },
      {
        "title": "Finalidades e bases legais",
        "text": "Gerimos a reserva, estadia e check-in para executar o contrato ou diligências pré-contratuais solicitadas, quando aplicável (art. 6.1.b RGPD). Identificamos os hóspedes e comunicamos os dados exigidos à Polícia italiana através de Alloggiati Web, nos termos do art. 109 TULPS, e cumprimos as obrigações estatísticas da Região do Lácio através de ROSS1000 (art. 6.1.c RGPD). Não é necessário consentimento; o botão confirma a tomada de conhecimento."
      },
      {
        "title": "Dados obrigatórios",
        "text": "Sem os dados obrigatórios não podemos concluir as formalidades e o check-in. Contacte o anfitrião em caso de dificuldade."
      },
      {
        "title": "Destinatários",
        "text": "Têm acesso o pessoal autorizado e os fornecedores informáticos que atuam por conta do responsável, designados subcontratantes quando necessário. Utilizamos um servidor virtual Register.it e cópias Acronis. Os dados exigidos são enviados à Polícia e à Região do Lácio através de ROSS1000; as autoridades tratam-nos segundo as suas regras. Não são divulgados publicamente."
      },
      {
        "title": "Conservação",
        "text": "Os dados exclusivos da comunicação policial são removidos dos registos operacionais após a receção do comprovativo de comunicação. Os dados estatísticos são mantidos até ROSS1000 confirmar a aquisição dos movimentos devidos. Os dados comuns são removidos após ambos os procedimentos. A remoção elimina ou substitui definitivamente o valor original, não o oculta apenas no ecrã. Os comprovativos Alloggiati Web são conservados separadamente por cinco anos. Dados necessários a obrigações fiscais ou contabilísticas distintas são mantidos separadamente pelos prazos legais. A eliminação nos nossos sistemas não elimina dados nas autoridades."
      },
      {
        "title": "Definição de perfis",
        "text": "Não definimos perfis nem tomamos decisões exclusivamente automatizadas com efeitos jurídicos ou igualmente significativos sobre os hóspedes."
      },
      {
        "title": "Direitos",
        "text": "Nas condições do RGPD pode pedir acesso, retificação, apagamento, limitação e, quando aplicável, portabilidade ou oposição. O apagamento não se sobrepõe a obrigações legais de conservação. Escreva para info@endimension.eu: respondemos normalmente num mês e comunicamos prorrogações. Pode reclamar ao Garante italiano (www.garanteprivacy.it) ou à autoridade competente. Informação nos termos dos arts. 13 e, quando aplicável, 14 RGPD."
      }
    ]
  },
  "ko": {
    "title": "개인정보 처리 안내",
    "read": "개인정보 처리 안내 읽기",
    "close": "닫기",
    "acknowledge": "읽었습니다, 계속",
    "exit": "체크인 종료",
    "heading": "개인정보 보호 안내",
    "intro": "투숙객 정보를 입력하기 전에 EnDimension s.r.l.의 안내를 확인하세요.",
    "explanation": "예약 및 법적 의무 이행에 필요한 처리는 동의를 요구하지 않습니다. 버튼은 안내 확인을 기록합니다.",
    "exitTitle": "체크인 중단",
    "exitText": "안내로 돌아가 계속할 수 있습니다. 도움이 필요하면 호스트에게 문의하세요.",
    "return": "안내로 돌아가기",
    "saving": "저장 중…",
    "error": "안내 확인을 저장하지 못했습니다. 다시 시도하세요.",
    "versionLabel": "버전",
    "sections": [
      {
        "title": "관리자 및 연락처",
        "text": "개인정보처리자는 EnDimension s.r.l., Vicolo Del Curato 10, 00186 Roma (RM), Italy입니다. 부가세/납세 번호 16855661001, REA RM-1679873. 문의 및 권리 행사: info@endimension.eu."
      },
      {
        "title": "정보 및 출처",
        "text": "예약 정보(이름, 예약 번호, 숙소, 숙박 날짜, 인원), 인적 사항, 거주 국가, 신분증 정보, 언어, 접속 및 체크인 진행 정보를 처리합니다. 정보는 Airbnb 등 예약 채널, 직접 문의한 본인 또는 대신 체크인을 작성하는 사람에게서 받습니다. 동반자의 정보를 입력하는 경우 이 안내를 동반자에게도 제공하세요."
      },
      {
        "title": "목적 및 법적 근거",
        "text": "해당되는 경우 계약 이행 또는 요청된 계약 전 조치를 위해 예약, 숙박 및 체크인을 관리합니다(GDPR 제6조 제1항 b호). TULPS 제109조에 따라 투숙객을 확인하고 Alloggiati Web을 통해 이탈리아 경찰에 필요한 정보를 전달하며, ROSS1000을 통해 라치오 지역의 통계 의무를 이행합니다(GDPR 제6조 제1항 c호). 이러한 필수 처리에는 동의가 필요하지 않으며 버튼은 안내 확인을 의미합니다."
      },
      {
        "title": "필수 정보",
        "text": "필수 정보가 없으면 법적 절차와 체크인을 완료할 수 없습니다. 이용에 어려움이 있으면 호스트에게 문의하세요."
      },
      {
        "title": "수신자",
        "text": "권한 있는 직원과 처리자를 대신하는 IT 제공업체가 접근하며 필요한 경우 수탁자로 지정됩니다. Register.it 가상 서버와 Acronis 백업을 사용합니다. 필요한 정보는 경찰 및 ROSS1000을 통한 라치오 지역에 전달되며 기관은 자체 규정에 따라 처리합니다. 정보는 공개하지 않습니다."
      },
      {
        "title": "보관",
        "text": "경찰 신고에만 사용하는 정보는 신고 접수 확인서를 받은 후 운영 기록에서 제거합니다. 통계에 필요한 정보는 ROSS1000이 필요한 입퇴실 자료의 접수를 확인할 때까지 보관합니다. 공통 정보는 두 의무가 모두 완료된 후 제거합니다. 제거는 화면에서 숨기는 것이 아니라 원래 값을 삭제하거나 영구적으로 대체하는 것입니다. Alloggiati Web 확인서는 별도로 5년간 보관합니다. 별도 세무·회계 의무에 필요한 정보는 법정 기간 동안 별도로 보관합니다. 당사 시스템에서 삭제해도 기관이 보유한 정보는 삭제되지 않습니다."
      },
      {
        "title": "프로파일링",
        "text": "프로파일링이나 투숙객에게 법적 또는 유사하게 중대한 영향을 미치는 전적으로 자동화된 의사결정을 하지 않습니다."
      },
      {
        "title": "권리",
        "text": "GDPR 조건에 따라 열람, 정정, 삭제, 처리 제한 및 해당되는 경우 이동권과 이의를 요청할 수 있습니다. 삭제권은 법적 보관 의무에 우선하지 않습니다. info@endimension.eu로 연락하세요. 통상 1개월 내 답변하며 연장 시 알립니다. 이탈리아 개인정보 감독기관(www.garanteprivacy.it) 또는 관할 기관에 민원을 제기할 수 있습니다. GDPR 제13조 및 해당되는 경우 제14조에 따른 안내입니다."
      }
    ]
  },
  "ja": {
    "title": "個人情報の取扱いについて",
    "read": "個人情報の取扱いを読む",
    "close": "閉じる",
    "acknowledge": "読みました、次へ",
    "exit": "チェックインを終了",
    "heading": "個人情報の保護について",
    "intro": "宿泊者情報を入力する前に、EnDimension s.r.l.の説明をご確認ください。",
    "explanation": "予約や法的義務の履行に必要な処理には同意は不要です。ボタンは説明を確認したことを記録します。",
    "exitTitle": "チェックインを中断しました",
    "exitText": "説明に戻って再開できます。お困りの場合はホストにお問い合わせください。",
    "return": "説明に戻る",
    "saving": "保存中…",
    "error": "確認を保存できませんでした。再試行してください。",
    "versionLabel": "バージョン",
    "sections": [
      {
        "title": "管理者と連絡先",
        "text": "管理者はEnDimension s.r.l., Vicolo Del Curato 10, 00186 Roma (RM), Italyです。VAT/税番号16855661001、REA RM-1679873。お問い合わせ・権利行使：info@endimension.eu。"
      },
      {
        "title": "データと取得元",
        "text": "予約情報（氏名、予約番号、宿泊施設、日程、人数）、個人情報、居住国、身分証明書の情報、言語、アクセスおよびチェックインの進行状況を処理します。取得元はAirbnb等の予約経路、直接連絡したご本人、または代理で入力する方です。同伴者の情報を入力する場合、この説明を同伴者にも提供してください。"
      },
      {
        "title": "目的と法的根拠",
        "text": "該当する場合、契約の履行または依頼された契約前の措置のために予約、滞在、チェックインを管理します（GDPR第6条1項b）。TULPS第109条に基づく本人確認とAlloggiati Webを通じたイタリア警察への報告、およびROSS1000を通じたラツィオ州の統計義務にも対応します（GDPR第6条1項c）。必要な処理に同意は不要で、ボタンは説明を確認したことを示します。"
      },
      {
        "title": "必須情報",
        "text": "必須情報がない場合、必要な手続きとチェックインを完了できません。利用にお困りの場合はホストへご連絡ください。"
      },
      {
        "title": "提供先",
        "text": "権限のある職員と管理者のために業務を行うIT提供者がアクセスし、必要に応じて処理者として指定されます。Register.itの仮想サーバーとAcronisのバックアップを使用します。必要な情報は警察とROSS1000経由でラツィオ州に提供され、各機関の規則で処理されます。一般公開はしません。"
      },
      {
        "title": "保存期間",
        "text": "警察への報告だけに用いるデータは、送信受領証の取得後に業務記録から削除します。統計に必要なデータはROSS1000が必要な入退室情報の取得を確認するまで保持します。共通データは両方の手続き完了後に削除します。削除とは原値を消去または恒久的に置換することで、画面上で隠すだけではありません。Alloggiati Webの受領証は別に5年間保存します。別途税務・会計上必要な情報は法定期間、分けて保存します。当社での削除は行政機関が保有するデータの削除にはなりません。"
      },
      {
        "title": "プロファイリング",
        "text": "プロファイリングや、宿泊者に法的または同様に重大な影響を与える完全自動の意思決定は行いません。"
      },
      {
        "title": "権利",
        "text": "GDPRの条件に従い、アクセス、訂正、消去、制限、および該当する場合はポータビリティや異議申立てを求められます。消去は法的保存義務に優先しません。info@endimension.euへご連絡ください。通常1か月以内に回答し、延長時は通知します。イタリアの監督機関（www.garanteprivacy.it）または管轄機関へ苦情を申し立てられます。GDPR第13条および該当する場合は第14条に基づく説明です。"
      }
    ]
  },
  "zh": {
    "title": "隐私告知书",
    "read": "阅读隐私告知书",
    "close": "关闭",
    "acknowledge": "已阅读，继续",
    "exit": "退出入住登记",
    "heading": "您的隐私很重要",
    "intro": "输入住客资料前，请查阅 EnDimension s.r.l. 的隐私告知书。",
    "explanation": "履行预订和法定义务所需的处理不以同意为依据。此按钮记录您已知悉本告知书。",
    "exitTitle": "入住登记已中断",
    "exitText": "您可以返回告知书继续操作。如需帮助，请联系房东。",
    "return": "返回告知书",
    "saving": "正在保存…",
    "error": "无法保存阅读确认，请重试。",
    "versionLabel": "版本",
    "sections": [
      {
        "title": "控制者及联系方式",
        "text": "数据控制者为 EnDimension s.r.l.，地址 Vicolo Del Curato 10, 00186 Roma (RM), Italy，增值税/税号 16855661001，REA RM-1679873。咨询及行使权利：info@endimension.eu。"
      },
      {
        "title": "数据及来源",
        "text": "我们处理预订资料（姓名、编号、住宿设施、日期和人数）、个人资料、居住国家、身份证件信息、语言、访问和入住登记进度。来源包括 Airbnb 等预订渠道、直接联系我们的本人或代您填写登记的人。如填写同行者的资料，请也向其提供本告知书。"
      },
      {
        "title": "目的与法律依据",
        "text": "在适用情况下，我们为履行合同或应要求采取订约前措施而管理预订、住宿和入住登记（GDPR 第6条第1款b项）。同时，根据 TULPS 第109条核实住客身份并通过 Alloggiati Web 向意大利警方报送必要资料，以及通过 ROSS1000 履行拉齐奥大区统计义务（GDPR 第6条第1款c项）。这些必要处理无需同意；按钮表示已知悉告知书。"
      },
      {
        "title": "必填资料",
        "text": "缺少必填资料时，我们无法完成必要手续和入住登记。如使用服务有困难，请联系房东。"
      },
      {
        "title": "接收方",
        "text": "获授权人员及代表控制者工作的 IT 服务商可以访问资料，必要时被指定为处理者。我们使用 Register.it 虚拟服务器和 Acronis 备份。必要资料向警方及通过 ROSS1000 向拉齐奥大区报送，各机关按其规则处理。资料不向公众公开。"
      },
      {
        "title": "保存期限",
        "text": "仅用于警方报送的资料在取得报送回执后从业务记录中移除。统计所需资料保留至 ROSS1000 确认收到应报送的入住、离店等记录。两项义务共用的资料在两项均完成后移除。移除意味着删除或永久替换原始值，而非仅在屏幕上隐藏。Alloggiati Web 回执单独保存五年。其他税务或会计义务所需资料按法定期限另行保存。我们系统中的删除不会删除机关持有的资料。"
      },
      {
        "title": "画像与自动决策",
        "text": "我们不进行画像，也不作出对住客产生法律或类似重大影响的完全自动化决策。"
      },
      {
        "title": "权利",
        "text": "在 GDPR 规定的条件下，您可申请访问、更正、删除、限制处理，以及适用时的数据可携带和反对处理。删除权不优先于法定保存义务。请联系 info@endimension.eu，通常一个月内答复，延期时会通知您。您可向意大利数据保护机关（www.garanteprivacy.it）或主管机关投诉。本告知依据 GDPR 第13条及适用时第14条提供。"
      }
    ]
  }
};
