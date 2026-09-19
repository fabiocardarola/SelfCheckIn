import { BookingService } from './booking.service';
import { DEMO_ARRIVAL, ArrivalConfig } from './arrival/arrival-config';
import { ArrivalComponent } from './arrival/arrival.component';
import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { GuestRegistrationComponent } from './guest-registration/guest-registration.component';

type LanguageCode = 'it' | 'en' | 'pl' | 'fr' | 'de' | 'es' | 'pt' | 'ko' | 'ja' | 'zh';
type View = 'language' | 'privacy' | 'declined' | 'journey' | 'step' | 'registration' | 'arrival';

interface Language { code: LanguageCode; name: string; greeting: string; flag: string; }
interface Copy {
  welcome: string; welcomeText: string; selectLanguage: string; privateNote: string;
  privacyEyebrow: string; privacyTitle: string; privacyIntro: string; privacyItems: string[]; privacyFooter: string;
  accept: string; decline: string; declinedTitle: string; declinedText: string; reconsider: string;
  journeyEyebrow: string; journeyTitle: string; journeyText: string; progress: string;
  completed: string; available: string; locked: string; start: string; continue: string; review: string;
  stepTitles: string[]; stepSummaries: string[]; stepDetails: string[];
  placeholder: string; markComplete: string; backToMap: string;
  allDone: string; allDoneText: string; restart: string; back: string; demo: string;
}

const LANGUAGES: Language[] = [
  { code: 'it', name: 'Italiano', greeting: 'Benvenuto', flag: '🇮🇹' },
  { code: 'en', name: 'English', greeting: 'Welcome', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', greeting: 'Witamy', flag: '🇵🇱' },
  { code: 'fr', name: 'Français', greeting: 'Bienvenue', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', greeting: 'Willkommen', flag: '🇩🇪' },
  { code: 'es', name: 'Español', greeting: 'Bienvenido', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', greeting: 'Bem-vindo', flag: '🇵🇹' },
  { code: 'ko', name: '한국어', greeting: '환영합니다', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', greeting: 'ようこそ', flag: '🇯🇵' },
  { code: 'zh', name: '中文', greeting: '欢迎', flag: '🇨🇳' }
];

const COPY: Record<LanguageCode, Copy> = {
  it: {
    welcome: 'Benvenuto a casa', welcomeText: 'Il tuo arrivo, semplice e senza attese.', selectLanguage: 'Scegli la tua lingua', privateNote: 'Il percorso richiede circa 4 minuti',
    privacyEyebrow: 'Prima di iniziare', privacyTitle: 'La tua privacy è importante', privacyIntro: 'Per completare il check-in dobbiamo trattare alcuni dati personali.',
    privacyItems: ['Useremo i dati solo per gli obblighi di ospitalità.', 'I documenti saranno protetti e accessibili solo al personale autorizzato.', 'Puoi chiedere informazioni o la cancellazione dei dati quando consentito dalla legge.'], privacyFooter: 'Selezionando “Accetto” confermi di aver letto e compreso questa informativa.',
    accept: 'Sì, accetto', decline: 'No, non accetto', declinedTitle: 'Non puoi ancora proseguire', declinedText: 'L’accettazione dell’informativa è necessaria per registrare gli ospiti e completare il self check-in.', reconsider: 'Rileggi l’informativa',
    journeyEyebrow: 'La tua mappa di arrivo', journeyTitle: 'Quattro tappe e sei a casa!', journeyText: 'Segui il percorso nell’ordine indicato. Ogni tappa sblocca la successiva.', progress: 'Progresso', completed: 'Completato', available: 'Disponibile', locked: 'Bloccato', start: 'Inizia', continue: 'Continua', review: 'Rivedi',
    stepTitles: ['Registra i passaporti', 'Raggiungi l’appartamento', 'Apri il portone', 'Recupera le chiavi'], stepSummaries: ['Inserisci i dati degli ospiti', 'Segui il percorso sulla mappa', 'Usa il comando di apertura', 'Apri la box e prendi le chiavi'],
    stepDetails: ['Qui verrà guidata la registrazione dei documenti di tutti gli ospiti.', 'Qui troverai la mappa, l’indirizzo e le indicazioni personalizzate per raggiungere l’appartamento.', 'Qui troverai il pulsante e le istruzioni per aprire in sicurezza il portone su strada.', 'Qui troverai il codice e le istruzioni illustrate per aprire la box nera e recuperare le chiavi.'],
    placeholder: 'Anteprima della prima versione — il contenuto definitivo verrà collegato nelle prossime fasi.', markComplete: 'Segna come completato', backToMap: 'Torna alla mappa', allDone: 'Check-in completato!', allDoneText: 'Ottimo lavoro. Hai tutto ciò che ti serve per entrare e goderti il soggiorno.', restart: 'Ricomincia la demo', back: 'Indietro', demo: 'Demo interattiva'
  },
  en: {
    welcome: 'Welcome home', welcomeText: 'A simple arrival, with no waiting.', selectLanguage: 'Choose your language', privateNote: 'The journey takes about 4 minutes',
    privacyEyebrow: 'Before you start', privacyTitle: 'Your privacy matters', privacyIntro: 'To complete check-in, we need to process some personal data.', privacyItems: ['We will use your data only for hospitality obligations.', 'Documents will be protected and available only to authorised staff.', 'You may request information or deletion when permitted by law.'], privacyFooter: 'By selecting “I agree”, you confirm that you have read and understood this notice.',
    accept: 'Yes, I agree', decline: 'No, I disagree', declinedTitle: 'You cannot continue yet', declinedText: 'Accepting the privacy notice is required to register guests and complete self check-in.', reconsider: 'Read the notice again',
    journeyEyebrow: 'Your arrival map', journeyTitle: 'Four stops and you’re home!', journeyText: 'Follow the route in order. Each stop unlocks the next one.', progress: 'Progress', completed: 'Completed', available: 'Available', locked: 'Locked', start: 'Start', continue: 'Continue', review: 'Review',
    stepTitles: ['Register passports', 'Reach the apartment', 'Open the street door', 'Collect the keys'], stepSummaries: ['Enter guest details', 'Follow the route on the map', 'Use the opening control', 'Open the box and take the keys'], stepDetails: ['This is where the registration of every guest’s documents will be guided.', 'Here you will find the map, address and personalised directions to the apartment.', 'Here you will find the button and instructions to open the street door safely.', 'Here you will find the code and illustrated instructions to open the black box and collect the keys.'], placeholder: 'First-version preview — final content will be connected in the next phases.', markComplete: 'Mark as completed', backToMap: 'Back to the map', allDone: 'Check-in completed!', allDoneText: 'Great work. You have everything you need to enter and enjoy your stay.', restart: 'Restart demo', back: 'Back', demo: 'Interactive demo'
  },
  pl: {
    welcome: 'Witamy w domu', welcomeText: 'Prosty przyjazd, bez czekania.', selectLanguage: 'Wybierz język', privateNote: 'Całość zajmie około 4 minut', privacyEyebrow: 'Zanim zaczniesz', privacyTitle: 'Twoja prywatność jest ważna', privacyIntro: 'Aby zakończyć zameldowanie, musimy przetworzyć niektóre dane osobowe.', privacyItems: ['Użyjemy danych wyłącznie do obowiązków związanych z zakwaterowaniem.', 'Dokumenty będą chronione i dostępne tylko dla upoważnionego personelu.', 'Możesz poprosić o informacje lub usunięcie danych, gdy prawo na to pozwala.'], privacyFooter: 'Wybierając „Akceptuję”, potwierdzasz przeczytanie i zrozumienie informacji.', accept: 'Tak, akceptuję', decline: 'Nie akceptuję', declinedTitle: 'Nie możesz jeszcze kontynuować', declinedText: 'Akceptacja informacji o prywatności jest wymagana do rejestracji gości i zameldowania.', reconsider: 'Przeczytaj ponownie', journeyEyebrow: 'Mapa Twojego przyjazdu', journeyTitle: 'Cztery kroki i jesteś w domu!', journeyText: 'Idź po kolei. Każdy krok odblokowuje następny.', progress: 'Postęp', completed: 'Ukończono', available: 'Dostępne', locked: 'Zablokowane', start: 'Zacznij', continue: 'Kontynuuj', review: 'Zobacz', stepTitles: ['Zarejestruj paszporty', 'Dotrzyj do apartamentu', 'Otwórz drzwi budynku', 'Odbierz klucze'], stepSummaries: ['Wpisz dane gości', 'Podążaj trasą na mapie', 'Użyj przycisku otwierania', 'Otwórz skrzynkę i weź klucze'], stepDetails: ['Tutaj przeprowadzimy rejestrację dokumentów wszystkich gości.', 'Tutaj znajdziesz mapę, adres i wskazówki dojazdu do apartamentu.', 'Tutaj znajdziesz przycisk i instrukcje bezpiecznego otwierania drzwi.', 'Tutaj znajdziesz kod i ilustrowane instrukcje otwarcia czarnej skrzynki z kluczami.'], placeholder: 'Podgląd pierwszej wersji — treść końcowa zostanie dodana w kolejnych etapach.', markComplete: 'Oznacz jako ukończone', backToMap: 'Wróć do mapy', allDone: 'Zameldowanie zakończone!', allDoneText: 'Świetnie! Masz wszystko, czego potrzebujesz, aby wejść i cieszyć się pobytem.', restart: 'Uruchom demo ponownie', back: 'Wstecz', demo: 'Demo interaktywne'
  },
  fr: {
    welcome: 'Bienvenue chez vous', welcomeText: 'Une arrivée simple, sans attente.', selectLanguage: 'Choisissez votre langue', privateNote: 'Le parcours dure environ 4 minutes', privacyEyebrow: 'Avant de commencer', privacyTitle: 'Votre vie privée compte', privacyIntro: 'Pour terminer l’enregistrement, nous devons traiter certaines données personnelles.', privacyItems: ['Nous utiliserons vos données uniquement pour les obligations d’hébergement.', 'Les documents seront protégés et accessibles uniquement au personnel autorisé.', 'Vous pouvez demander des informations ou leur suppression lorsque la loi le permet.'], privacyFooter: 'En sélectionnant « J’accepte », vous confirmez avoir lu et compris cet avis.', accept: 'Oui, j’accepte', decline: 'Non, je refuse', declinedTitle: 'Vous ne pouvez pas encore continuer', declinedText: 'L’acceptation de l’avis de confidentialité est nécessaire pour enregistrer les voyageurs.', reconsider: 'Relire l’avis', journeyEyebrow: 'Votre carte d’arrivée', journeyTitle: 'Quatre étapes et vous êtes chez vous !', journeyText: 'Suivez le parcours dans l’ordre. Chaque étape débloque la suivante.', progress: 'Progression', completed: 'Terminé', available: 'Disponible', locked: 'Verrouillé', start: 'Commencer', continue: 'Continuer', review: 'Revoir', stepTitles: ['Enregistrer les passeports', 'Rejoindre l’appartement', 'Ouvrir la porte de rue', 'Récupérer les clés'], stepSummaries: ['Saisissez les données des voyageurs', 'Suivez l’itinéraire sur la carte', 'Utilisez la commande d’ouverture', 'Ouvrez la boîte et prenez les clés'], stepDetails: ['Ici sera guidé l’enregistrement des documents de tous les voyageurs.', 'Vous trouverez ici la carte, l’adresse et l’itinéraire personnalisé.', 'Vous trouverez ici le bouton et les instructions pour ouvrir la porte en sécurité.', 'Vous trouverez ici le code et les instructions illustrées pour ouvrir la boîte noire.'], placeholder: 'Aperçu de la première version — le contenu final sera ajouté lors des prochaines étapes.', markComplete: 'Marquer comme terminé', backToMap: 'Retour à la carte', allDone: 'Enregistrement terminé !', allDoneText: 'Bravo. Vous avez tout ce qu’il faut pour entrer et profiter du séjour.', restart: 'Recommencer la démo', back: 'Retour', demo: 'Démo interactive'
  },
  de: {
    welcome: 'Willkommen zu Hause', welcomeText: 'Einfach ankommen, ohne Wartezeit.', selectLanguage: 'Wähle deine Sprache', privateNote: 'Der Ablauf dauert etwa 4 Minuten', privacyEyebrow: 'Bevor du beginnst', privacyTitle: 'Deine Privatsphäre ist wichtig', privacyIntro: 'Für den Check-in müssen wir einige personenbezogene Daten verarbeiten.', privacyItems: ['Wir verwenden die Daten nur für die Pflichten der Beherbergung.', 'Dokumente werden geschützt und sind nur für befugtes Personal zugänglich.', 'Du kannst Auskunft oder Löschung verlangen, soweit gesetzlich zulässig.'], privacyFooter: 'Mit „Ich stimme zu“ bestätigst du, diesen Hinweis gelesen und verstanden zu haben.', accept: 'Ja, ich stimme zu', decline: 'Nein, ich stimme nicht zu', declinedTitle: 'Du kannst noch nicht fortfahren', declinedText: 'Die Zustimmung zum Datenschutzhinweis ist für die Gästeregistrierung erforderlich.', reconsider: 'Hinweis erneut lesen', journeyEyebrow: 'Deine Ankunftskarte', journeyTitle: 'Vier Stationen und du bist da!', journeyText: 'Folge dem Weg der Reihe nach. Jede Station schaltet die nächste frei.', progress: 'Fortschritt', completed: 'Erledigt', available: 'Verfügbar', locked: 'Gesperrt', start: 'Starten', continue: 'Weiter', review: 'Ansehen', stepTitles: ['Pässe registrieren', 'Apartment erreichen', 'Haustür öffnen', 'Schlüssel abholen'], stepSummaries: ['Gästedaten eingeben', 'Route auf der Karte folgen', 'Öffnungssteuerung benutzen', 'Box öffnen und Schlüssel nehmen'], stepDetails: ['Hier wird die Registrierung der Dokumente aller Gäste geführt.', 'Hier findest du Karte, Adresse und persönliche Wegbeschreibung.', 'Hier findest du Taste und Anleitung zum sicheren Öffnen der Haustür.', 'Hier findest du Code und bebilderte Anleitung für die schwarze Schlüsselbox.'], placeholder: 'Vorschau der ersten Version — die endgültigen Inhalte folgen in den nächsten Phasen.', markComplete: 'Als erledigt markieren', backToMap: 'Zurück zur Karte', allDone: 'Check-in abgeschlossen!', allDoneText: 'Sehr gut. Du hast alles, was du für deinen Aufenthalt brauchst.', restart: 'Demo neu starten', back: 'Zurück', demo: 'Interaktive Demo'
  },
  es: {
    welcome: 'Bienvenido a casa', welcomeText: 'Una llegada fácil y sin esperas.', selectLanguage: 'Elige tu idioma', privateNote: 'El recorrido dura unos 4 minutos', privacyEyebrow: 'Antes de empezar', privacyTitle: 'Tu privacidad importa', privacyIntro: 'Para completar el check-in debemos tratar algunos datos personales.', privacyItems: ['Usaremos tus datos solo para las obligaciones de alojamiento.', 'Los documentos estarán protegidos y solo el personal autorizado podrá acceder.', 'Puedes solicitar información o eliminación cuando la ley lo permita.'], privacyFooter: 'Al seleccionar «Acepto», confirmas que has leído y comprendido este aviso.', accept: 'Sí, acepto', decline: 'No acepto', declinedTitle: 'Aún no puedes continuar', declinedText: 'Aceptar el aviso de privacidad es necesario para registrar a los huéspedes.', reconsider: 'Leer de nuevo', journeyEyebrow: 'Tu mapa de llegada', journeyTitle: '¡Cuatro paradas y estás en casa!', journeyText: 'Sigue el recorrido en orden. Cada parada desbloquea la siguiente.', progress: 'Progreso', completed: 'Completado', available: 'Disponible', locked: 'Bloqueado', start: 'Empezar', continue: 'Continuar', review: 'Revisar', stepTitles: ['Registrar pasaportes', 'Llegar al apartamento', 'Abrir el portal', 'Recoger las llaves'], stepSummaries: ['Introduce los datos de huéspedes', 'Sigue la ruta del mapa', 'Usa el control de apertura', 'Abre la caja y toma las llaves'], stepDetails: ['Aquí se guiará el registro de documentos de todos los huéspedes.', 'Aquí encontrarás mapa, dirección e indicaciones personalizadas.', 'Aquí encontrarás el botón y las instrucciones para abrir el portal con seguridad.', 'Aquí encontrarás el código y las instrucciones ilustradas de la caja negra.'], placeholder: 'Vista previa de la primera versión; el contenido final se conectará en las próximas fases.', markComplete: 'Marcar como completado', backToMap: 'Volver al mapa', allDone: '¡Check-in completado!', allDoneText: 'Buen trabajo. Ya tienes todo lo necesario para entrar y disfrutar.', restart: 'Reiniciar demo', back: 'Atrás', demo: 'Demo interactiva'
  },
  pt: {
    welcome: 'Bem-vindo a casa', welcomeText: 'Uma chegada simples, sem esperas.', selectLanguage: 'Escolha o seu idioma', privateNote: 'O percurso demora cerca de 4 minutos', privacyEyebrow: 'Antes de começar', privacyTitle: 'A sua privacidade importa', privacyIntro: 'Para concluir o check-in, precisamos tratar alguns dados pessoais.', privacyItems: ['Usaremos os dados apenas para obrigações de alojamento.', 'Os documentos serão protegidos e acessíveis só por pessoal autorizado.', 'Pode pedir informações ou eliminação quando permitido por lei.'], privacyFooter: 'Ao selecionar “Aceito”, confirma que leu e compreendeu este aviso.', accept: 'Sim, aceito', decline: 'Não aceito', declinedTitle: 'Ainda não pode continuar', declinedText: 'Aceitar o aviso de privacidade é necessário para registar os hóspedes.', reconsider: 'Ler o aviso novamente', journeyEyebrow: 'O seu mapa de chegada', journeyTitle: 'Quatro etapas e está em casa!', journeyText: 'Siga o percurso por ordem. Cada etapa desbloqueia a seguinte.', progress: 'Progresso', completed: 'Concluído', available: 'Disponível', locked: 'Bloqueado', start: 'Começar', continue: 'Continuar', review: 'Rever', stepTitles: ['Registar passaportes', 'Chegar ao apartamento', 'Abrir a porta da rua', 'Recolher as chaves'], stepSummaries: ['Insira os dados dos hóspedes', 'Siga a rota no mapa', 'Use o controlo de abertura', 'Abra a caixa e retire as chaves'], stepDetails: ['Aqui será orientado o registo dos documentos de todos os hóspedes.', 'Aqui encontrará mapa, morada e indicações personalizadas.', 'Aqui encontrará o botão e as instruções para abrir a porta com segurança.', 'Aqui encontrará o código e as instruções ilustradas da caixa preta.'], placeholder: 'Pré-visualização da primeira versão — o conteúdo final será ligado nas próximas fases.', markComplete: 'Marcar como concluído', backToMap: 'Voltar ao mapa', allDone: 'Check-in concluído!', allDoneText: 'Muito bem. Tem tudo o que precisa para entrar e desfrutar da estadia.', restart: 'Reiniciar demonstração', back: 'Voltar', demo: 'Demonstração interativa'
  },
  ko: {
    welcome: '집에 오신 것을 환영합니다', welcomeText: '기다림 없이 간편하게 입실하세요.', selectLanguage: '언어를 선택하세요', privateNote: '약 4분이 소요됩니다', privacyEyebrow: '시작하기 전에', privacyTitle: '개인정보는 소중합니다', privacyIntro: '체크인을 완료하려면 일부 개인정보를 처리해야 합니다.', privacyItems: ['숙박 관련 의무에만 데이터를 사용합니다.', '문서는 안전하게 보호되며 승인된 직원만 접근합니다.', '법이 허용하는 경우 정보 확인 또는 삭제를 요청할 수 있습니다.'], privacyFooter: '“동의합니다”를 선택하면 이 안내를 읽고 이해했음을 확인합니다.', accept: '동의합니다', decline: '동의하지 않습니다', declinedTitle: '아직 계속할 수 없습니다', declinedText: '투숙객 등록과 셀프 체크인을 위해 개인정보 안내 동의가 필요합니다.', reconsider: '안내 다시 읽기', journeyEyebrow: '도착 안내 지도', journeyTitle: '네 단계면 집에 도착해요!', journeyText: '순서대로 진행하세요. 완료할 때마다 다음 단계가 열립니다.', progress: '진행률', completed: '완료', available: '사용 가능', locked: '잠김', start: '시작', continue: '계속', review: '다시 보기', stepTitles: ['여권 등록', '아파트로 이동', '건물 현관 열기', '열쇠 수령'], stepSummaries: ['투숙객 정보를 입력하세요', '지도 경로를 따라가세요', '열림 버튼을 사용하세요', '보관함을 열고 열쇠를 꺼내세요'], stepDetails: ['모든 투숙객의 신분증 등록을 여기서 안내합니다.', '지도, 주소, 아파트까지의 맞춤 길 안내를 제공합니다.', '건물 현관을 안전하게 여는 버튼과 안내를 제공합니다.', '검은 보관함을 열기 위한 코드와 그림 안내를 제공합니다.'], placeholder: '첫 번째 버전 미리보기 — 최종 내용은 다음 단계에서 연결됩니다.', markComplete: '완료로 표시', backToMap: '지도로 돌아가기', allDone: '체크인 완료!', allDoneText: '잘하셨어요. 이제 입실하고 편안히 머물 준비가 됐습니다.', restart: '데모 다시 시작', back: '뒤로', demo: '인터랙티브 데모'
  },
  ja: {
    welcome: 'おかえりなさい', welcomeText: '待ち時間なしで、かんたんに到着。', selectLanguage: '言語を選択してください', privateNote: '所要時間は約4分です', privacyEyebrow: '始める前に', privacyTitle: 'プライバシーを大切にします', privacyIntro: 'チェックイン完了のため、一部の個人情報を取り扱います。', privacyItems: ['宿泊に関する義務のためにのみデータを使用します。', '書類は保護され、許可されたスタッフのみが閲覧できます。', '法律で認められる場合、情報開示や削除を依頼できます。'], privacyFooter: '「同意する」を選択すると、この案内を読み理解したことを確認します。', accept: '同意します', decline: '同意しません', declinedTitle: 'まだ先へ進めません', declinedText: '宿泊者登録とセルフチェックインには、プライバシー案内への同意が必要です。', reconsider: '案内をもう一度読む', journeyEyebrow: '到着マップ', journeyTitle: '4つのステップで到着！', journeyText: '順番に進んでください。完了すると次のステップが開きます。', progress: '進捗', completed: '完了', available: '利用可能', locked: 'ロック中', start: '開始', continue: '続ける', review: '確認', stepTitles: ['パスポートを登録', 'アパートへ移動', '建物のドアを開ける', '鍵を受け取る'], stepSummaries: ['宿泊者情報を入力', '地図のルートを確認', '開錠ボタンを使用', 'ボックスを開けて鍵を取得'], stepDetails: ['すべての宿泊者の身分証登録をここでご案内します。', '地図、住所、アパートまでの個別ルートをご案内します。', '建物のドアを安全に開けるボタンと手順をご案内します。', '黒いボックスを開けるコードと図解手順をご案内します。'], placeholder: '初期バージョンのプレビューです。最終コンテンツは次の段階で接続します。', markComplete: '完了にする', backToMap: 'マップに戻る', allDone: 'チェックイン完了！', allDoneText: 'お疲れさまでした。入室して滞在を楽しむ準備が整いました。', restart: 'デモを最初から', back: '戻る', demo: 'インタラクティブデモ'
  },
  zh: {
    welcome: '欢迎回家', welcomeText: '轻松抵达，无需等待。', selectLanguage: '请选择语言', privateNote: '整个流程约需4分钟', privacyEyebrow: '开始之前', privacyTitle: '我们重视您的隐私', privacyIntro: '为了完成入住，我们需要处理部分个人信息。', privacyItems: ['我们仅将数据用于住宿登记义务。', '证件将受到保护，只有授权人员可以访问。', '在法律允许时，您可以要求查询或删除数据。'], privacyFooter: '选择“我同意”即表示您已阅读并理解本说明。', accept: '是，我同意', decline: '不同意', declinedTitle: '您暂时无法继续', declinedText: '登记住客和完成自助入住需要接受隐私说明。', reconsider: '重新阅读说明', journeyEyebrow: '您的抵达地图', journeyTitle: '四个步骤，轻松到家！', journeyText: '请按顺序操作。每完成一步就会解锁下一步。', progress: '进度', completed: '已完成', available: '可用', locked: '已锁定', start: '开始', continue: '继续', review: '查看', stepTitles: ['登记护照', '前往公寓', '打开楼门', '领取钥匙'], stepSummaries: ['填写住客信息', '按照地图路线前往', '使用开门按钮', '打开钥匙盒并取出钥匙'], stepDetails: ['这里将引导您登记所有住客的证件。', '这里将提供地图、地址和前往公寓的个性化路线。', '这里将提供安全打开街道楼门的按钮和说明。', '这里将提供打开黑色钥匙盒的密码和图示说明。'], placeholder: '这是第一版预览，最终内容将在后续阶段接入。', markComplete: '标记为已完成', backToMap: '返回地图', allDone: '入住办理完成！', allDoneText: '做得好！您已准备好进入公寓并享受旅程。', restart: '重新开始演示', back: '返回', demo: '互动演示'
  }
};

@Component({ selector: 'app-root', imports: [GuestRegistrationComponent, ArrivalComponent], templateUrl: './app.html', styleUrl: './app.scss' })
export class App {
  private readonly document = inject(DOCUMENT);
  protected readonly bookingService = inject(BookingService);
  protected readonly booking = this.bookingService.booking;
  protected readonly arrivalConfig = computed<ArrivalConfig>(() => {
    const booking = this.booking();
    const lat = booking?.lat;
    const lng = booking?.lng;
    const hasCoordinates = typeof lat === 'number' && typeof lng === 'number'
      && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
      && (lat !== 0 || lng !== 0);
    return {
      ...DEMO_ARRIVAL,
      destination: { address: [booking?.address, booking?.cap, booking?.city].filter(Boolean).join(' - ') || booking?.apartment || '', latitude: lat ?? 0, longitude: lng ?? 0 },
      enabled: { ...DEMO_ARRIVAL.enabled, uber: hasCoordinates, transit: hasCoordinates, walking: hasCoordinates }
    };
  });

  constructor() { void this.loadBooking(); }

  protected async loadBooking(): Promise<void> {
    await this.bookingService.login();
    const restored = this.bookingService.progress();
    const code = (restored?.language ?? this.booking()?.lang)?.toLowerCase().split(/[-_]/)[0];
    const language = LANGUAGES.find((item) => item.code === code)?.code ?? 'it';
    this.selectedLanguage.set(language);
    this.document.documentElement.lang = language;
    this.completedSteps.set(restored?.completedSteps ?? []);
    this.privacyAccepted.set(restored?.privacyAccepted ?? false);
    this.goTo(restored?.privacyAccepted ? 'journey' : restored?.language ? 'privacy' : 'language');
  }
  protected readonly languages = LANGUAGES;
  protected readonly selectedLanguage = signal<LanguageCode | null>(null);
  protected readonly view = signal<View>('language');
  protected readonly activeStep = signal(1);
  protected readonly completedSteps = signal<number[]>([]);
  protected readonly copy = computed(() => COPY[this.selectedLanguage() ?? 'it']);
  protected readonly selectedLanguageInfo = computed(() => LANGUAGES.find((language) => language.code === this.selectedLanguage()));
  protected readonly progress = computed(() => this.completedSteps().length * 25);

  protected readonly privacyAccepted = signal(false);
  protected readonly progressSaving = signal(false);
  protected readonly progressError = signal(false);
  private retryAction: (() => Promise<void>) | null = null;
  protected readonly progressFeedback = computed(() => {
    const messages: Record<LanguageCode, [string, string, string]> = {
      it: ['Salvataggio…', 'Impossibile salvare i progressi. Riprova.', 'Riprova'],
      en: ['Saving…', 'Unable to save progress. Please try again.', 'Retry'],
      pl: ['Zapisywanie…', 'Nie udało się zapisać postępu. Spróbuj ponownie.', 'Ponów'],
      fr: ['Enregistrement…', 'Impossible d’enregistrer la progression. Réessayez.', 'Réessayer'],
      de: ['Speichern…', 'Fortschritt konnte nicht gespeichert werden. Bitte erneut versuchen.', 'Erneut versuchen'],
      es: ['Guardando…', 'No se pudo guardar el progreso. Inténtalo de nuevo.', 'Reintentar'],
      pt: ['A guardar…', 'Não foi possível guardar o progresso. Tente novamente.', 'Tentar novamente'],
      ko: ['저장 중…', '진행 상황을 저장하지 못했습니다. 다시 시도하세요.', '다시 시도'],
      ja: ['保存中…', '進捗を保存できませんでした。もう一度お試しください。', '再試行'],
      zh: ['正在保存…', '无法保存进度，请重试。', '重试']
    };
    return messages[this.selectedLanguage() ?? 'it'];
  });

  private async persistProgress(action: () => Promise<void>): Promise<void> {
    if (this.progressSaving()) return;
    this.progressSaving.set(true);
    this.progressError.set(false);
    this.retryAction = action;
    try { await action(); this.retryAction = null; }
    catch { this.progressError.set(true); }
    finally { this.progressSaving.set(false); }
  }
  protected retryProgress(): void { if (this.retryAction) void this.persistProgress(this.retryAction); }

  protected readonly privacySaving = signal(false);
  protected readonly privacyError = signal(false);
  protected readonly privacyFeedback = computed(() => {
    const messages: Record<LanguageCode, [string, string]> = {
      it: ['Salvataggio della scelta…', 'Impossibile salvare la scelta. Riprova selezionando Sì o No.'],
      en: ['Saving your choice…', 'Unable to save your choice. Please select Yes or No to try again.'],
      pl: ['Zapisywanie wyboru…', 'Nie udało się zapisać wyboru. Spróbuj ponownie, wybierając Tak lub Nie.'],
      fr: ['Enregistrement de votre choix…', 'Impossible d’enregistrer votre choix. Réessayez en sélectionnant Oui ou Non.'],
      de: ['Deine Auswahl wird gespeichert…', 'Deine Auswahl konnte nicht gespeichert werden. Wähle erneut Ja oder Nein.'],
      es: ['Guardando tu elección…', 'No se pudo guardar tu elección. Selecciona Sí o No para volver a intentarlo.'],
      pt: ['A guardar a sua escolha…', 'Não foi possível guardar a sua escolha. Selecione Sim ou Não para tentar novamente.'],
      ko: ['선택 사항을 저장하는 중…', '선택 사항을 저장하지 못했습니다. 예 또는 아니요를 선택하여 다시 시도하세요.'],
      ja: ['選択を保存しています…', '選択を保存できませんでした。はい、またはいいえを選んで再試行してください。'],
      zh: ['正在保存您的选择…', '无法保存您的选择。请选择是或否重试。']
    };
    return messages[this.selectedLanguage() ?? 'it'];
  });

  protected async chooseLanguage(code: LanguageCode): Promise<void> {
    await this.persistProgress(async () => {
      const progress = await this.bookingService.saveProgress({ language: code });
      this.selectedLanguage.set(code);
      this.document.documentElement.lang = code;
      this.privacyAccepted.set(progress.privacyAccepted);
      this.completedSteps.set(progress.completedSteps);
      this.goTo(progress.privacyAccepted ? 'journey' : 'privacy');
    });
  }
  protected async acceptPrivacy(accepted: boolean): Promise<void> {
    if (this.privacySaving() || this.view() !== 'privacy') return;
    this.privacySaving.set(true);
    this.privacyError.set(false);
    try {
      await this.bookingService.request('sci_privacy', { accepted });
      this.privacyAccepted.set(accepted);
      this.privacySaving.set(false);
      this.goTo(accepted ? 'journey' : 'declined');
    } catch {
      this.privacyError.set(true);
    } finally {
      this.privacySaving.set(false);
    }
  }
  protected openStep(step: number): void { if (!this.privacyAccepted() || !this.isUnlocked(step)) return; this.activeStep.set(step); this.goTo(step === 1 ? 'registration' : step === 2 ? 'arrival' : 'step'); }
  protected async completeStep(step: number): Promise<void> {
    await this.persistProgress(async () => {
      const progress = await this.bookingService.saveProgress({ step });
      this.completedSteps.set(progress.completedSteps);
      this.goTo('journey');
    });
  }
  protected isCompleted(step: number): boolean { return this.completedSteps().includes(step); }
  protected isUnlocked(step: number): boolean { return step === 1 || this.completedSteps().includes(step - 1); }
  protected stepState(step: number): string { return this.isCompleted(step) ? this.copy().completed : this.isUnlocked(step) ? this.copy().available : this.copy().locked; }
  protected stepAction(step: number): string { return this.isCompleted(step) ? this.copy().review : step === 1 ? this.copy().start : this.copy().continue; }
  protected goBack(): void { const current = this.view(); if (current === 'privacy') this.goTo('language'); if (current === 'declined') this.goTo('privacy'); if (current === 'journey') this.goTo('privacy'); if (current === 'step' || current === 'registration' || current === 'arrival') this.goTo('journey'); }
  protected restart(): void { if (this.privacySaving() || this.progressSaving()) return; this.goTo('language'); }
  protected goTo(nextView: View): void {
    if (this.privacySaving()) return;
    this.privacyError.set(false);
    this.view.set(nextView);
    this.document.defaultView?.setTimeout(() => this.document.defaultView?.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }
}
