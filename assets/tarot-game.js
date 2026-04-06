let tarotData = [];
let selectedCards = [];
let maxSelect = 3;
let cardPool = [];

// GELİŞMİŞ HİKAYE VE ANLAM HAVUZU
const storyElements = {
    intros: [
        "Kaderin şu an {c1} kartının rehberliğinde şekilleniyor,",
        "Ruhun {c1} enerjisinin etkisi altındayken,",
        "Yolculuğun {c1} ile yeni bir evreye girerken,",
        "Evrenin sana ilk mesajı {c1} sembolüyle fısıldanıyor,",
        "Zihnin {c1} frekansıyla meşgul görünürken,",
        "Şu anki titreşimin doğrudan {c1} ile rezonansa giriyor,",
        "Görünmez bağlar seni {c1} eşiğine getirmişken,"
    ],
    connectors: [
        " öte yandan {c2} enerjisi devreye giriyor.",
        " buna paralel olarak {c2} fırtınası esmeye başlıyor.",
        " gizemli bir şekilde {c2} bu durumu destekliyor.",
        " tüm bunlar yaşanırken {c2} ile yeni bir kapı aralanıyor.",
        " ancak içsel bir boyutta {c2} seni sarmalıyor.",
        " derinden gelen bir fısıltıyla {c2} yönünü değiştiriyor.",
        " beklenen bir hamleyle {c2} dengeyi sağlıyor.",
        " sürpriz bir etkileşimle {c2} tüm tabloyu boyuyor."
    ],
    outcomes: [
        "Nihayetinde bu yolculuk {c3} kartının gölgesinde son bulacak.",
        "Gelecekte ise {c3} ile mutlak bir dönüşüm seni bekliyor.",
        "Tüm bu etkiler birleştiğinde {c3} sana rehberlik edecek.",
        "Ancak unutma ki son sözü {c3} söyleyecek.",
        "Ruhsal bir boyutta ise bu durumun meyvesi {c3} olacak.",
        "Zamanın ötesinde bir noktada {c3} mührünü vuracak.",
        "Kozmik planda bu sürecin tamamlayıcısı {c3} görünüyor.",
        "Yolun sonu, kaçınılmaz olarak {c3} ışığına çıkıyor."
    ]
};

// 1. Veri Yükleme
fetch('/assets/tarot-data.json')
    .then(res => res.json())
    .then(data => {
        tarotData = data.cards || data;
        cardPool = [...tarotData];
    })
    .catch(err => console.error("JSON Yükleme Hatası: ", err));

// 2. State Yönetimi (Sıfırlama)
function resetState() {
    selectedCards = [];
    cardPool = [...tarotData];
    document.getElementById('setup-area').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('result-area').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. Okumayı Başlat
function startReading(mode) {
    const category = document.getElementById('category').value;
    if (category === 'yesno') mode = 'single';

    document.getElementById('setup-area').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('result-area').style.display = 'none';

    maxSelect = (mode === 'single') ? 1 : (mode === 'triple' ? 3 : 5);
    selectedCards = [];
    document.getElementById('reveal-btn').style.display = 'none';

    const slotContainer = document.getElementById('slot-container');
    slotContainer.innerHTML = '';
    for (let i = 0; i < maxSelect; i++) {
        slotContainer.innerHTML += `<div id="slot-${i}" class="card-slot">?</div>`;
    }

    const deck = document.getElementById('main-deck');
    deck.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'tarot-card-back';
        cardDiv.onclick = function () {
            if (selectedCards.length < maxSelect) {
                const randomIndex = Math.floor(Math.random() * cardPool.length);
                const chosenCard = cardPool.splice(randomIndex, 1)[0];
                selectedCards.push(chosenCard);

                // Sinematik Efekt
                this.style.opacity = '0.1';
                this.style.pointerEvents = 'none';
                this.style.transform = 'translateY(-30px) rotate(10deg) scale(0.8)';

                const currentSlot = document.getElementById(`slot-${selectedCards.length - 1}`);
                currentSlot.classList.add('active');
                currentSlot.innerText = '★';

                if (selectedCards.length === maxSelect) {
                    const btn = document.getElementById('reveal-btn');
                    btn.style.display = 'block';
                    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };
        deck.appendChild(cardDiv);
    }
}

// 4. Profesyonel Hikaye Üretici
function generateStory() {
    if (selectedCards.length < 2) return "";

    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Kart isimlerini gold-text içine alıyoruz
    const formatCard = (card) => `<span class="gold-text">${card.name}</span>`;

    let story = rand(storyElements.intros).replace("{c1}", formatCard(selectedCards[0]));
    story += rand(storyElements.connectors).replace("{c2}", formatCard(selectedCards[1]));

    if (selectedCards.length > 2) {
        story += " " + rand(storyElements.outcomes).replace("{c3}", formatCard(selectedCards[selectedCards.length - 1]));
    }

    return `<div class="story-box"><p>${story}</p></div>`;
}

// 5. Sonuçları Göster
function showResult() {
    const category = document.getElementById('category').value;
    document.getElementById('game-area').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';

    const storyHtml = generateStory();

    let cardsHtml = '<div class="results-grid">';
    selectedCards.forEach(card => {
        let meaning = card[category] || card.desc || "Kehanet bu konuda sessiz kalmayı tercih ediyor...";

        // Evet/Hayır vurgusu
        let content = (category === 'yesno') ? `<strong class="gold-text">${meaning}</strong>` : meaning;

        cardsHtml += `
            <div class="result-card">
                <img src="/assets/images/${card.id}.jpg" 
                     onerror="this.onerror=null; this.src='/assets/images/0.jpg';" 
                     alt="${card.name}">
                <h3 class="gold-text">${card.name}</h3>
                <p>${content}</p>
            </div>`;
    });
    cardsHtml += '</div>';

    resultArea.innerHTML = storyHtml + cardsHtml + `
        <div class="text-center" style="margin-top: 50px;">
            <button onclick="resetState()" class="retry-btn">KADERİ YENİDEN YAZ</button>
        </div>`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
