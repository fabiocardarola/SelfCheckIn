import { RegistrationLanguage } from '../guest-registration/registration-copy';

interface ArrivalCopy {
  address: string; showDriver: string; copy: string; copied: string; copyFailed: string;
  title: string; origin: string; guests: string; unavailable: string;
  taxi: string; taxiDetail: string; call: string;
  ncc: string; quote: string; luggage: string; port: string; nccInfo: string; nccContact: string; whatsapp: string; close: string; nccMessage: string; unknownDate: string; noQuote: string;
  uberCurrent: string; freeNowWeb: string; uberDetail: string; uberOpen: string; freeNowDetail: string; freeNowOpen: string;
  transit: string; transitDetail: string; walking: string; walkingDetail: string;
  navigate: string; arrived: string; back: string;
}

export const ARRIVAL_COPY: Record<RegistrationLanguage, ArrivalCopy> = {
  it: {
    address: 'Il tuo indirizzo', showDriver: 'Mostra questo indirizzo al tassista o all’autista.', copy: 'Copia indirizzo', copied: 'Indirizzo copiato', copyFailed: 'Seleziona e copia l’indirizzo qui sopra.',
    title: 'Come raggiungerci', origin: 'Trasferimenti da FCO · A piedi dalla posizione attuale', guests: '{count} persone nella prenotazione', unavailable: 'Non disponibile per questo appartamento',
    taxi: 'Taxi', taxiDetail: 'Tariffa fissa da FCO, come previsto nella demo. Conferma condizioni e bagagli con il servizio taxi.', call: 'Chiama il taxi',
    ncc: 'Auto privata · NCC', quote: '{price} totali per {count} persone', noQuote: 'Preventivo su richiesta per questo gruppo.',
    luggage: "Bagagli inclusi nel prezzo.", port: "Dal porto di Civitavecchia: {price} totali, bagagli inclusi.", nccInfo: "Informazioni sul trasferimento", nccContact: "Contatta l’host per maggiori informazioni sul trasferimento con auto privata NCC.", whatsapp: "Apri WhatsApp", close: "Chiudi", nccMessage: "Sono {name}, prenotazione numero {pnr} con arrivo il {date}. Vorrei maggiori informazioni sul trasferimento con auto privata NCC.", unknownDate: "data da confermare",
    uberDetail: 'Apri Uber con partenza FCO e destinazione appartamento. Conferma il punto di incontro nell’app.', uberOpen: 'Apri Uber · da FCO', uberCurrent: 'Uber · dalla posizione attuale', freeNowWeb: 'Apri il sito FreeNow', freeNowDetail: 'Apri FreeNow dal collegamento ufficiale. Copia l’indirizzo qui sopra e inseriscilo come destinazione nell’app, poi conferma il punto di partenza. Se necessario, ti verrà proposto di scaricare l’app.', freeNowOpen: 'Apri FreeNow',
    transit: 'Autobus / metropolitana', transitDetail: 'Consulta collegamenti, cambi e orari da FCO in Google Maps.', walking: 'A piedi', walkingDetail: 'Percorso a piedi dalla posizione attuale all’appartamento. Consenti la posizione in Google Maps oppure inserisci il punto di partenza.',
    navigate: 'Apri il navigatore', arrived: 'Sono arrivato · continua', back: 'Torna alla mappa'
  },
  en: {
    address: 'Your address', showDriver: 'Show this address to your taxi or private driver.', copy: 'Copy address', copied: 'Address copied', copyFailed: 'Select and copy the address above.',
    title: 'How to get here', origin: 'Transfers from FCO · Walk from your current location', guests: '{count} people in your booking', unavailable: 'Unavailable for this apartment',
    taxi: 'Taxi', taxiDetail: 'Fixed fare from FCO as configured in this demo. Confirm conditions and luggage with the taxi service.', call: 'Call a taxi',
    ncc: 'Private car · NCC', quote: '{price} total for {count} people', noQuote: 'Request a quote for this group.',
    luggage: "Luggage is included in the price.", port: "From Civitavecchia port: {price} total, luggage included.", nccInfo: "Transfer information", nccContact: "Contact your host for more information about the private NCC transfer.", whatsapp: "Open WhatsApp", close: "Close", nccMessage: "I am {name}, booking number {pnr}, arriving on {date}. I would like more information about the private NCC transfer.", unknownDate: "date to be confirmed",
    uberDetail: 'Open Uber with FCO pickup and the apartment as destination. Confirm the meeting point in the app.', uberOpen: 'Open Uber · from FCO', uberCurrent: 'Uber · from current location', freeNowWeb: 'Open FreeNow website', freeNowDetail: 'Open FreeNow using its official link. Copy the address above and enter it as the destination in the app, then confirm your pickup point. You may be prompted to download the app.', freeNowOpen: 'Open FreeNow',
    transit: 'Bus / metro', transitDetail: 'Check connections, changes and schedules from FCO in Google Maps.', walking: 'On foot', walkingDetail: 'Walk from your current location to the apartment. Allow location access in Google Maps or enter your starting point.',
    navigate: 'Open directions', arrived: 'I have arrived · continue', back: 'Back to the map'
  },
  pl: {
    address: 'Twój adres', showDriver: 'Pokaż ten adres kierowcy.', copy: 'Kopiuj adres', copied: 'Adres skopiowany', copyFailed: 'Zaznacz i skopiuj adres powyżej.',
    title: 'Jak do nas dotrzeć', origin: 'Transfery z FCO · Pieszo z bieżącej lokalizacji', guests: '{count} osoby w rezerwacji', unavailable: 'Niedostępne dla tego apartamentu',
    taxi: 'Taksówka', taxiDetail: 'Stała cena z FCO w tej demonstracji. Potwierdź warunki i bagaż z przewoźnikiem.', call: 'Zadzwoń po taksówkę',
    ncc: 'Prywatny samochód · NCC', quote: '{price} łącznie dla {count} osób', noQuote: 'Wycena dla tej grupy na zapytanie.',
    luggage: "Bagaż jest wliczony w cenę.", port: "Z portu Civitavecchia: {price} łącznie, bagaż w cenie.", nccInfo: "Informacje o transferze", nccContact: "Skontaktuj się z gospodarzem, aby uzyskać więcej informacji o prywatnym transferze NCC.", whatsapp: "Otwórz WhatsApp", close: "Zamknij", nccMessage: "Nazywam się {name}, numer rezerwacji {pnr}, przyjazd: {date}. Proszę o więcej informacji o prywatnym transferze NCC.", unknownDate: "data do potwierdzenia",
    uberDetail: 'Otwórz Uber: odbiór FCO, cel apartament. Potwierdź miejsce spotkania w aplikacji.', uberOpen: 'Otwórz Uber · z FCO', uberCurrent: 'Uber · z bieżącej lokalizacji', freeNowWeb: 'Otwórz stronę FreeNow', freeNowDetail: 'Otwórz FreeNow przez oficjalny link. Skopiuj powyższy adres i wpisz go jako cel w aplikacji, a następnie potwierdź miejsce odbioru. Może pojawić się propozycja pobrania aplikacji.', freeNowOpen: 'Otwórz FreeNow',
    transit: 'Autobus / metro', transitDetail: 'Sprawdź połączenia, przesiadki i rozkłady z FCO w Google Maps.', walking: 'Pieszo', walkingDetail: 'Trasa piesza z bieżącej lokalizacji do apartamentu. Zezwól na lokalizację w Google Maps lub wpisz punkt początkowy.',
    navigate: 'Otwórz nawigację', arrived: 'Jestem na miejscu · dalej', back: 'Wróć do mapy'
  },
  fr: {
    address: 'Votre adresse', showDriver: 'Montrez cette adresse à votre chauffeur.', copy: 'Copier l’adresse', copied: 'Adresse copiée', copyFailed: 'Sélectionnez et copiez l’adresse ci-dessus.',
    title: 'Comment nous rejoindre', origin: 'Transferts depuis FCO · À pied depuis votre position', guests: '{count} personnes dans la réservation', unavailable: 'Indisponible pour cet appartement',
    taxi: 'Taxi', taxiDetail: 'Forfait depuis FCO prévu dans cette démo. Confirmez les conditions et les bagages avec le taxi.', call: 'Appeler un taxi',
    ncc: 'Voiture privée · NCC', quote: '{price} au total pour {count} personnes', noQuote: 'Devis sur demande pour ce groupe.',
    luggage: "Les bagages sont inclus dans le prix.", port: "Depuis le port de Civitavecchia : {price} au total, bagages inclus.", nccInfo: "Informations sur le transfert", nccContact: "Contactez votre hôte pour plus d’informations sur le transfert en voiture privée NCC.", whatsapp: "Ouvrir WhatsApp", close: "Fermer", nccMessage: "Je suis {name}, réservation numéro {pnr}, avec une arrivée le {date}. Je souhaite plus d’informations sur le transfert en voiture privée NCC.", unknownDate: "date à confirmer",
    uberDetail: 'Ouvrez Uber avec départ FCO et arrivée à l’appartement. Confirmez le point de rencontre dans l’application.', uberOpen: 'Ouvrir Uber · depuis FCO', uberCurrent: 'Uber · position actuelle', freeNowWeb: 'Ouvrir le site FreeNow', freeNowDetail: 'Ouvrez FreeNow via le lien officiel. Copiez l’adresse ci-dessus comme destination dans l’application, puis confirmez le départ. Le téléchargement de l’application peut être proposé.', freeNowOpen: 'Ouvrir FreeNow',
    transit: 'Bus / métro', transitDetail: 'Consultez les correspondances et horaires depuis FCO dans Google Maps.', walking: 'À pied', walkingDetail: 'Itinéraire à pied depuis votre position actuelle vers l’appartement. Autorisez la localisation dans Google Maps ou saisissez le point de départ.',
    navigate: 'Ouvrir l’itinéraire', arrived: 'Je suis arrivé · continuer', back: 'Retour à la carte'
  },
  de: {
    address: 'Deine Adresse', showDriver: 'Zeige diese Adresse deinem Fahrer.', copy: 'Adresse kopieren', copied: 'Adresse kopiert', copyFailed: 'Markiere und kopiere die Adresse oben.',
    title: 'So erreichst du uns', origin: 'Transfers ab FCO · Zu Fuß ab aktuellem Standort', guests: '{count} Personen in der Buchung', unavailable: 'Für dieses Apartment nicht verfügbar',
    taxi: 'Taxi', taxiDetail: 'Festpreis ab FCO laut dieser Demo. Bedingungen und Gepäck mit dem Taxidienst klären.', call: 'Taxi anrufen',
    ncc: 'Privatwagen · NCC', quote: '{price} insgesamt für {count} Personen', noQuote: 'Preis für diese Gruppe auf Anfrage.',
    luggage: "Gepäck ist im Preis enthalten.", port: "Ab Hafen Civitavecchia: insgesamt {price}, inklusive Gepäck.", nccInfo: "Informationen zum Transfer", nccContact: "Kontaktiere deinen Gastgeber für weitere Informationen zum privaten NCC-Transfer.", whatsapp: "WhatsApp öffnen", close: "Schließen", nccMessage: "Ich bin {name}, Buchungsnummer {pnr}, mit Ankunft am {date}. Ich möchte weitere Informationen zum privaten NCC-Transfer.", unknownDate: "Datum noch zu bestätigen",
    uberDetail: 'Uber mit Abholung am FCO und Ziel Apartment öffnen. Treffpunkt in der App bestätigen.', uberOpen: 'Uber öffnen · ab FCO', uberCurrent: 'Uber · aktueller Standort', freeNowWeb: 'FreeNow-Website öffnen', freeNowDetail: 'Öffne FreeNow über den offiziellen Link. Kopiere die Adresse oben als Ziel in die App und bestätige den Abholort. Gegebenenfalls wird der Download der App angeboten.', freeNowOpen: 'FreeNow öffnen',
    transit: 'Bus / U-Bahn', transitDetail: 'Verbindungen, Umstiege und Fahrpläne ab FCO in Google Maps ansehen.', walking: 'Zu Fuß', walkingDetail: 'Fußweg vom aktuellen Standort zum Apartment. Erlaube den Standortzugriff in Google Maps oder gib den Startpunkt ein.',
    navigate: 'Navigation öffnen', arrived: 'Ich bin da · weiter', back: 'Zurück zur Karte'
  },
  es: {
    address: 'Tu dirección', showDriver: 'Muestra esta dirección al conductor.', copy: 'Copiar dirección', copied: 'Dirección copiada', copyFailed: 'Selecciona y copia la dirección de arriba.',
    title: 'Cómo llegar', origin: 'Traslados desde FCO · A pie desde tu ubicación actual', guests: '{count} personas en la reserva', unavailable: 'No disponible para este apartamento',
    taxi: 'Taxi', taxiDetail: 'Tarifa fija desde FCO configurada en esta demo. Confirma las condiciones y el equipaje con el taxi.', call: 'Llamar al taxi',
    ncc: 'Coche privado · NCC', quote: '{price} en total para {count} personas', noQuote: 'Presupuesto bajo petición para este grupo.',
    luggage: "El equipaje está incluido en el precio.", port: "Desde el puerto de Civitavecchia: {price} en total, equipaje incluido.", nccInfo: "Información sobre el traslado", nccContact: "Contacta con el anfitrión para más información sobre el traslado en coche privado NCC.", whatsapp: "Abrir WhatsApp", close: "Cerrar", nccMessage: "Soy {name}, reserva número {pnr}, con llegada el {date}. Quisiera más información sobre el traslado en coche privado NCC.", unknownDate: "fecha por confirmar",
    uberDetail: 'Abre Uber con salida FCO y destino apartamento. Confirma el punto de encuentro en la aplicación.', uberOpen: 'Abrir Uber · desde FCO', uberCurrent: 'Uber · ubicación actual', freeNowWeb: 'Abrir sitio de FreeNow', freeNowDetail: 'Abre FreeNow con el enlace oficial. Copia la dirección de arriba como destino en la aplicación y confirma el punto de recogida. Puede ofrecerse la descarga de la aplicación.', freeNowOpen: 'Abrir FreeNow',
    transit: 'Autobús / metro', transitDetail: 'Consulta conexiones, transbordos y horarios desde FCO en Google Maps.', walking: 'A pie', walkingDetail: 'Ruta a pie desde tu ubicación actual hasta el apartamento. Permite la ubicación en Google Maps o introduce el punto de partida.',
    navigate: 'Abrir navegador', arrived: 'He llegado · continuar', back: 'Volver al mapa'
  },
  pt: {
    address: 'A sua morada', showDriver: 'Mostre esta morada ao motorista.', copy: 'Copiar morada', copied: 'Morada copiada', copyFailed: 'Selecione e copie a morada acima.',
    title: 'Como chegar', origin: 'Transferes desde FCO · A pé da localização atual', guests: '{count} pessoas na reserva', unavailable: 'Indisponível para este apartamento',
    taxi: 'Táxi', taxiDetail: 'Tarifa fixa desde FCO configurada nesta demonstração. Confirme condições e bagagem com o táxi.', call: 'Ligar para o táxi',
    ncc: 'Carro privado · NCC', quote: '{price} no total para {count} pessoas', noQuote: 'Orçamento sob consulta para este grupo.',
    luggage: "A bagagem está incluída no preço.", port: "Do porto de Civitavecchia: {price} no total, bagagem incluída.", nccInfo: "Informações sobre o transfer", nccContact: "Contacte o anfitrião para mais informações sobre o transfer em carro privado NCC.", whatsapp: "Abrir WhatsApp", close: "Fechar", nccMessage: "Sou {name}, reserva número {pnr}, com chegada em {date}. Gostaria de mais informações sobre o transfer em carro privado NCC.", unknownDate: "data a confirmar",
    uberDetail: 'Abra a Uber com partida FCO e destino apartamento. Confirme o ponto de encontro na aplicação.', uberOpen: 'Abrir Uber · desde FCO', uberCurrent: 'Uber · localização atual', freeNowWeb: 'Abrir site da FreeNow', freeNowDetail: 'Abra a FreeNow pelo link oficial. Copie o endereço acima como destino na aplicação e confirme o ponto de partida. Poderá ser sugerido o download da aplicação.', freeNowOpen: 'Abrir FreeNow',
    transit: 'Autocarro / metro', transitDetail: 'Consulte ligações, transbordos e horários desde FCO no Google Maps.', walking: 'A pé', walkingDetail: 'Percurso a pé da localização atual até ao apartamento. Permita a localização no Google Maps ou introduza o ponto de partida.',
    navigate: 'Abrir navegador', arrived: 'Já cheguei · continuar', back: 'Voltar ao mapa'
  },
  ko: {
    address: '숙소 주소', showDriver: '택시 또는 전용차 기사에게 이 주소를 보여 주세요.', copy: '주소 복사', copied: '주소가 복사되었습니다', copyFailed: '위 주소를 선택하여 복사해 주세요.',
    title: '숙소로 오시는 길', origin: 'FCO 출발 교통편 · 도보는 현재 위치에서 출발', guests: '예약 인원 {count}명', unavailable: '이 숙소에서는 이용할 수 없습니다',
    taxi: '택시', taxiDetail: '이 데모에 설정된 FCO 출발 정액 요금입니다. 조건과 수하물은 택시 업체에 확인하세요.', call: '택시 전화하기',
    ncc: '전용차 · NCC', quote: '{count}명 총 {price}', noQuote: '이 인원은 별도 견적이 필요합니다.',
    luggage: "요금에 수하물이 포함되어 있습니다.", port: "치비타베키아 항구 출발: 총 {price}, 수하물 포함.", nccInfo: "차량 이동 안내", nccContact: "NCC 전용차 이동에 대한 자세한 내용은 호스트에게 문의하세요.", whatsapp: "WhatsApp 열기", close: "닫기", nccMessage: "저는 {name}입니다. 예약 번호는 {pnr}이며 도착일은 {date}입니다. NCC 전용차 이동에 대해 자세히 알고 싶습니다.", unknownDate: "날짜 확인 필요",
    uberDetail: 'FCO 출발, 숙소 도착으로 Uber를 엽니다. 앱에서 만나는 장소를 확인하세요.', uberOpen: 'Uber 열기 · FCO 출발', uberCurrent: 'Uber · 현재 위치에서 출발', freeNowWeb: 'FreeNow 웹사이트 열기', freeNowDetail: '공식 링크로 FreeNow를 엽니다. 위 주소를 복사해 앱의 목적지로 입력한 뒤 출발지를 확인하세요. 앱 다운로드가 안내될 수 있습니다.', freeNowOpen: 'FreeNow 열기',
    transit: '버스 / 지하철', transitDetail: 'Google Maps에서 FCO 출발 연결편, 환승 및 시간을 확인하세요.', walking: '도보', walkingDetail: '현재 위치에서 숙소까지 도보 경로입니다. Google Maps에서 위치 접근을 허용하거나 출발지를 입력하세요.',
    navigate: '길 안내 열기', arrived: '도착했어요 · 계속', back: '지도로 돌아가기'
  },
  ja: {
    address: '宿泊先の住所', showDriver: 'タクシーや専用車の運転手にこの住所を見せてください。', copy: '住所をコピー', copied: '住所をコピーしました', copyFailed: '上の住所を選択してコピーしてください。',
    title: '宿泊先へのアクセス', origin: 'FCOからの移動 · 徒歩は現在地から', guests: '予約人数：{count}名', unavailable: 'この宿泊先では利用できません',
    taxi: 'タクシー', taxiDetail: 'このデモで設定されたFCOからの定額料金です。条件と荷物についてはタクシー会社に確認してください。', call: 'タクシーに電話',
    ncc: '専用車 · NCC', quote: '{count}名で合計{price}', noQuote: 'この人数の見積もりはお問い合わせください。',
    luggage: "料金には荷物も含まれています。", port: "チヴィタヴェッキア港から：合計{price}、荷物込み。", nccInfo: "送迎について問い合わせる", nccContact: "NCC専用車送迎の詳細はホストにお問い合わせください。", whatsapp: "WhatsAppを開く", close: "閉じる", nccMessage: "{name}です。予約番号は{pnr}、到着日は{date}です。NCC専用車送迎について詳しく教えてください。", unknownDate: "日付未確定",
    uberDetail: 'FCO出発、宿泊先到着でUberを開きます。アプリで待ち合わせ場所を確認してください。', uberOpen: 'Uberを開く · FCO出発', uberCurrent: 'Uber · 現在地から出発', freeNowWeb: 'FreeNowのサイトを開く', freeNowDetail: '公式リンクでFreeNowを開きます。上の住所をコピーしてアプリの目的地に入力し、乗車場所を確認してください。アプリのダウンロードが案内される場合があります。', freeNowOpen: 'FreeNowを開く',
    transit: 'バス / 地下鉄', transitDetail: 'Google MapsでFCOからの接続、乗り換え、時刻を確認できます。', walking: '徒歩', walkingDetail: '現在地から宿泊先までの徒歩ルートです。Google Mapsで位置情報を許可するか、出発地を入力してください。',
    navigate: '経路案内を開く', arrived: '到着しました · 次へ', back: 'マップに戻る'
  },
  zh: {
    address: '您的住宿地址', showDriver: '请向出租车或专车司机出示此地址。', copy: '复制地址', copied: '地址已复制', copyFailed: '请选择并复制上方地址。',
    title: '如何前往公寓', origin: '从FCO出发的交通 · 步行从当前位置出发', guests: '预订人数：{count}人', unavailable: '此公寓不提供该选项',
    taxi: '出租车', taxiDetail: '本演示设置的FCO出发固定车费。请向出租车服务确认条件及行李规定。', call: '致电出租车',
    ncc: '私人专车 · NCC', quote: '{count}人共计{price}', noQuote: '此人数需另行询价。',
    luggage: "价格已包含行李。", port: "从奇维塔韦基亚港出发：共计{price}，含行李。", nccInfo: "接送服务详情", nccContact: "如需了解NCC私人专车接送的更多信息，请联系房东。", whatsapp: "打开WhatsApp", close: "关闭", nccMessage: "我是{name}，预订编号{pnr}，到达日期为{date}。我想了解NCC私人专车接送的更多信息。", unknownDate: "日期待确认",
    uberDetail: '打开Uber，出发地为FCO，目的地为公寓。请在应用中确认会合地点。', uberOpen: '打开Uber · 从FCO出发', uberCurrent: 'Uber · 从当前位置出发', freeNowWeb: '打开FreeNow网站', freeNowDetail: '通过官方链接打开FreeNow。复制上方地址并在应用中输入为目的地，然后确认上车地点。可能会提示下载应用。', freeNowOpen: '打开FreeNow',
    transit: '公交 / 地铁', transitDetail: '在Google Maps查看FCO出发的路线、换乘及时间。', walking: '步行', walkingDetail: '从当前位置步行前往公寓。请允许Google Maps访问位置信息，或输入出发地。',
    navigate: '打开导航', arrived: '我已到达 · 继续', back: '返回地图'
  }
};
