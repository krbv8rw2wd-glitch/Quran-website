/* ==============================
   SURAH LIST
   ============================== */

   const surahs = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة",
    "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر",
    "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان",
    "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر",
    "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية",
    "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن",
    "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق",
    "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة",
    "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج",
    "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين",
    "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل",
    "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];


/* ==============================
   TOAST NOTIFICATION
   ============================== */

let toastTimer = null;

function showToast(message) {

    let toast = document.getElementById("app-toast");

    if (!toast) {

        toast = document.createElement("div");
        toast.id = "app-toast";
        toast.className = "toast";
        document.body.appendChild(toast);

    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(
        () => toast.classList.remove("show"),
        2000
    );

}


/* ==============================
   HOME PAGE - SURAH LIST
   ============================== */

const surahList = document.getElementById("surah-list");

if (surahList) {

    surahs.forEach((surah, index) => {

        const number = index + 1;

        /* Real <a> link so Google can crawl all 114 surahs */

        const surahElement = document.createElement("a");
        surahElement.className = "surah";
        surahElement.href = `surah.html?surah=${number}`;

        surahElement.innerHTML = `
            <span class="surah-number">
                ${number}
            </span>

            <span class="surah-name">
                ${surah}
            </span>
        `;

        surahList.appendChild(surahElement);

    });

}


/* ==============================
   START READING
   ============================== */

function startReading() {

    const surahsSection = document.getElementById("surahs");

    if (surahsSection) {

        surahsSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* ==============================
   SURAH PAGE
   ============================== */

const ayahList = document.getElementById("ayah-list");

if (ayahList) {

    const params = new URLSearchParams(window.location.search);
    const surahNumber = params.get("surah");

    if (surahNumber) {
        loadSurah(surahNumber);
    }

}


/* ==============================
   LOAD SURAH
   ============================== */

async function loadSurah(number) {

    try {

        const response = await fetch(
            `https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani-quran-academy,en.sahih`
        );

        const result = await response.json();

        const arabicSurah = result.data[0];
        const englishSurah = result.data[1];


        /* DYNAMIC SEO */

        document.title = `سورة ${arabicSurah.name} - القرآن الكريم`;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute(
                "content",
                `اقرأ سورة ${arabicSurah.name} كاملة (${arabicSurah.numberOfAyahs} آية) بالرسم العثماني مع الترجمة الإنجليزية والاستماع للتلاوة بصوت الشيخ مشاري العفاسي.`
            );
        }

        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = `https://YOUR-DOMAIN.com/surah.html?surah=${number}`;
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute("content", `سورة ${arabicSurah.name} - القرآن الكريم`);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute("content", `https://YOUR-DOMAIN.com/surah.html?surah=${number}`);
        }


        /* SURAH TITLE */

        const title = document.getElementById("surah-title");
        if (title) {
            title.textContent = arabicSurah.name;
        }


        /* SURAH DETAILS */

        const details = document.getElementById("surah-details");
        if (details) {
            details.textContent =
                `السورة رقم ${number} • ${arabicSurah.numberOfAyahs} آية`;
        }


        /* AYAH LIST */

        if (!ayahList) {
            return;
        }

        ayahList.innerHTML = "";

        const bookmarks = getBookmarks();

        arabicSurah.ayahs.forEach((ayah, index) => {

            const translation = englishSurah.ayahs[index];

            const ayahElement = document.createElement("div");
            ayahElement.classList.add("ayah");
            ayahElement.id = `ayah-${ayah.numberInSurah}`;

            ayahElement.addEventListener(
                "click",
                () => {
                    saveReadingPosition(number, ayah.numberInSurah);
                }
            );

            const isBookmarked = bookmarks.some(
                bookmark =>
                    bookmark.ayah === ayah.number &&
                    bookmark.surah === Number(number)
            );

            ayahElement.innerHTML = `

                <div class="ayah-header">

                    <span class="ayah-number">
                        ${ayah.numberInSurah}
                    </span>

                    <button
                        class="play-button"
                        data-ayah="${ayah.number}"
                        data-surah="${number}"
                        data-surah-name="${arabicSurah.name}"
                        data-ayah-in-surah="${ayah.numberInSurah}"
                        onclick="playAyah(${ayah.number}, this)"
                        aria-label="تشغيل الآية"
                    >
                        ▶️
                    </button>

                    <button
                        class="bookmark-button ${isBookmarked ? "saved" : ""}"
                        onclick="toggleBookmark(${ayah.number}, ${number}, this)"
                        aria-label="حفظ الآية"
                        aria-pressed="${isBookmarked}"
                    >
                        🔖
                    </button>

                    <button
                        class="copy-button"
                        onclick="copyAyah(this)"
                        aria-label="نسخ الآية"
                    >
                        📋
                    </button>

                </div>

                <p class="ayah-text">
                    ${ayah.text}
                </p>

                <p class="translation" lang="en" dir="ltr">
                    ${translation.text}
                </p>

            `;

            ayahList.appendChild(ayahElement);

        });


        openRequestedAyah();


    } catch (error) {

        console.error(error);

        const title = document.getElementById("surah-title");

        if (title) {
            title.textContent = "حدث خطأ أثناء تحميل السورة";
        }

    }

}


/* ==============================
   SAVE READING POSITION
   ============================== */

function saveReadingPosition(surahNumber, ayahNumber) {

    try {

        localStorage.setItem(
            "lastReadingPosition",
            JSON.stringify({
                surah: Number(surahNumber),
                ayah: Number(ayahNumber)
            })
        );

    } catch (e) {
        console.warn("Could not save reading position", e);
    }

}


/* =========================
   AUDIO PLAYER
   ========================= */

let currentAudio = null;
let currentAyahElement = null;
let currentPlayButton = null;


/* PLAY AYAH */

function playAyah(ayahNumber, button) {

    if (
        currentAudio &&
        currentAudio.dataset.ayah == ayahNumber
    ) {

        if (currentAudio.paused) {

            currentAudio.play();
            button.textContent = "⏸️";
            button.classList.add("playing");

            if (audioMainButton) {
                audioMainButton.textContent = "⏸️";
            }

        } else {

            currentAudio.pause();
            button.textContent = "▶️";
            button.classList.remove("playing");

            if (audioMainButton) {
                audioMainButton.textContent = "▶️";
            }

        }

        return;
    }

    startAyahAudio(ayahNumber, button);

}


/* =========================
   START AYAH AUDIO
   ========================= */

function startAyahAudio(ayahNumber, button) {

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (currentAyahElement) {
        currentAyahElement.classList.remove("playing");
    }

    if (currentPlayButton) {
        currentPlayButton.textContent = "▶️";
        currentPlayButton.classList.remove("playing");
    }

    const audio = new Audio(
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`
    );

    audio.preload = "none";
    audio.dataset.ayah = ayahNumber;

    currentAudio = audio;
    currentPlayButton = button;
    currentAyahElement = button.closest(".ayah");


    /* SAVE CURRENT READING POSITION */

    const surahNumber = button.dataset.surah;
    const ayahInSurah = button.dataset.ayahInSurah;

    if (surahNumber && ayahInSurah) {

        saveReadingPosition(
            Number(surahNumber),
            Number(ayahInSurah)
        );

    }


    showAudioPlayer(ayahNumber, button);
    connectAudioPlayer();

    if (currentAyahElement) {
        currentAyahElement.classList.add("playing");

        currentAyahElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    if (currentPlayButton) {
        currentPlayButton.classList.add("playing");
    }

    button.textContent = "⏸️";

    audio.play();


    audio.addEventListener("ended", () => {

        if (currentPlayButton) {
            currentPlayButton.textContent = "▶️";
            currentPlayButton.classList.remove("playing");
        }

        if (currentAyahElement) {
            currentAyahElement.classList.remove("playing");
        }

        if (audioMainButton) {
            audioMainButton.textContent = "▶️";
        }

        playNextAyah(ayahNumber);

    });

}


/* =========================
   LISTEN TO WHOLE SURAH
   ========================= */

function listenToSurah() {

    const firstButton = document.querySelector(".play-button");

    if (!firstButton) {
        return;
    }

    playAyah(Number(firstButton.dataset.ayah), firstButton);

}


/* =========================
   PLAY NEXT AYAH
   ========================= */

function playNextAyah(currentAyahNumber) {

    const nextButton = findNextAyahButton(currentAyahNumber);

    if (!nextButton) {

        if (currentAudio) {
            currentAudio.pause();
        }

        if (currentPlayButton) {
            currentPlayButton.textContent = "▶️";
        }

        if (currentAyahElement) {
            currentAyahElement.classList.remove("playing");
        }

        currentAudio = null;
        currentAyahElement = null;
        currentPlayButton = null;

        return;
    }

    startAyahAudio(Number(nextButton.dataset.ayah), nextButton);

}


/* =========================
   FIND NEXT AYAH
   (works on surah, search & bookmarks pages)
   ========================= */

function findNextAyahButton(currentAyahNumber) {

    const buttons = document.querySelectorAll(
        ".play-button, .search-play-btn"
    );

    let foundCurrent = false;

    for (const button of buttons) {

        const ayahNumber = Number(button.dataset.ayah);

        if (foundCurrent) {
            return button;
        }

        if (ayahNumber === Number(currentAyahNumber)) {
            foundCurrent = true;
        }

    }

    return null;

}


/* ==============================
   FAST QURAN SEARCH
   ============================== */

let quranSearchData = null;


/* LOAD QURAN DATA ONCE */

async function loadQuranSearchData() {

    if (quranSearchData) {
        return quranSearchData;
    }

    try {

        const response = await fetch(
            "https://api.alquran.cloud/v1/quran/quran-uthmani"
        );

        const result = await response.json();

        quranSearchData = result.data.surahs;

        return quranSearchData;

    } catch (error) {

        console.error(error);
        return null;

    }

}


/* ==============================
   SEARCH INPUT
   ============================== */

const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");


if (searchInput) {

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            searchQuran();
        }

    });


    /* Show/hide the ✕ button as the user types */

    searchInput.addEventListener("input", function () {

        if (clearSearchBtn) {
            clearSearchBtn.classList.toggle(
                "visible",
                searchInput.value.length > 0
            );
        }

    });

}


/* ==============================
   CLEAR SEARCH
   ============================== */

function clearSearch() {

    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (input) {
        input.value = "";
        input.focus();
    }

    if (results) {
        results.innerHTML = "";
    }

    if (clearSearchBtn) {
        clearSearchBtn.classList.remove("visible");
    }

}


/* ==============================
   NORMALIZE ARABIC
   ============================== */

function normalizeArabic(text) {

    return text
        .replace(
            /[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g,
            ""
        )
        .replace(/ـ/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .toLowerCase()
        .trim();

}


/* ==============================
   NORMALIZE ARABIC + MAP
   ============================== */

function normalizeArabicWithMap(text) {

    let normalized = "";
    let map = [];

    for (let i = 0; i < text.length; i++) {

        let char = text[i];

        if (
            /[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/.test(char)
        ) {
            continue;
        }

        if (char === "ـ") {
            continue;
        }

        if (/[أإآٱ]/.test(char)) {
            char = "ا";
        }
        else if (char === "ى") {
            char = "ي";
        }
        else if (char === "ة") {
            char = "ه";
        }
        else if (char === "ؤ") {
            char = "و";
        }
        else if (char === "ئ") {
            char = "ي";
        }

        normalized += char.toLowerCase();
        map.push(i);

    }

    return { normalized, map };

}


/* ==============================
   HIGHLIGHT SEARCH WORD
   ============================== */

function highlightSearchWord(text, word) {

    if (!word) {
        return text;
    }

    const { normalized, map } = normalizeArabicWithMap(text);
    const normalizedWord = normalizeArabic(word);

    if (!normalizedWord) {
        return text;
    }

    let result = "";
    let lastOriginalIndex = 0;
    let searchFrom = 0;

    while (searchFrom < normalized.length) {

        const matchIndex = normalized.indexOf(normalizedWord, searchFrom);

        if (matchIndex === -1) {
            break;
        }

        const originalStart = map[matchIndex];

        const lastNormalizedIndex =
            matchIndex + normalizedWord.length - 1;

        const originalEnd = map[lastNormalizedIndex] + 1;

        result += text.substring(lastOriginalIndex, originalStart);

        result +=
            "<mark>" +
            text.substring(originalStart, originalEnd) +
            "</mark>";

        lastOriginalIndex = originalEnd;

        searchFrom = matchIndex + normalizedWord.length;

    }

    result += text.substring(lastOriginalIndex);

    return result;

}


/* ==============================
   CREATE SEARCH PREVIEW
   ============================== */

function createSearchPreview(text, word) {

    const normalizedWord = normalizeArabic(word);

    if (!normalizedWord) {
        return text;
    }

    const { normalized, map } = normalizeArabicWithMap(text);

    const matchIndex = normalized.indexOf(normalizedWord);

    if (matchIndex === -1) {
        return text;
    }

    const originalStart = map[matchIndex];

    const originalEnd =
        map[matchIndex + normalizedWord.length - 1];

    const previewLength = 80;

    let start = Math.max(0, originalStart - previewLength);

    let end = Math.min(
        text.length,
        originalEnd + 1 + previewLength
    );

    let preview = text.substring(start, end);

    if (start > 0) {
        preview = "… " + preview;
    }

    if (end < text.length) {
        preview += " …";
    }

    return highlightSearchWord(preview, word);

}


/* ==============================
   SEARCH QURAN
   ============================== */

async function searchQuran() {

    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (!input || !results) {
        return;
    }

    const word = input.value.trim();

    if (!word) {
        results.innerHTML = "<p>اكتب كلمة للبحث.</p>";
        return;
    }

    results.innerHTML = "<p>جاري البحث...</p>";

    const surahs = await loadQuranSearchData();

    if (!surahs) {
        results.innerHTML = "<p>حدث خطأ أثناء تحميل القرآن.</p>";
        return;
    }

    const matches = [];
    const searchWord = normalizeArabic(word);

    if (!searchWord) {
        results.innerHTML = "<p>اكتب كلمة صحيحة للبحث.</p>";
        return;
    }

    surahs.forEach(surah => {

        surah.ayahs.forEach(ayah => {

            const normalizedAyah = normalizeArabic(ayah.text);

            if (normalizedAyah.includes(searchWord)) {
                matches.push({ surah, ayah });
            }

        });

    });

    if (matches.length === 0) {
        results.innerHTML = "<p>لم يتم العثور على نتائج.</p>";
        return;
    }

    results.innerHTML = "";

    const countElement = document.createElement("p");
    countElement.classList.add("search-count");
    countElement.textContent = `تم العثور على ${matches.length} نتيجة`;
    results.appendChild(countElement);

    matches.slice(0, 50).forEach(match => {

        const resultElement = document.createElement("div");
        resultElement.classList.add("search-result");

        resultElement.innerHTML = `

            <div class="search-result-header">

                <strong>
                    ${match.surah.name}
                </strong>

                <span>
                    آية ${match.ayah.numberInSurah}
                </span>

            </div>

            <p class="search-ayah">
                ${createSearchPreview(match.ayah.text, word)}
            </p>

            <div class="search-result-actions">

                <button
                    class="search-play-btn"
                    data-ayah="${match.ayah.number}"
                    data-surah="${match.surah.number}"
                    data-surah-name="${match.surah.name}"
                    data-ayah-in-surah="${match.ayah.numberInSurah}"
                    onclick="playAyah(${match.ayah.number}, this)"
                    aria-label="تشغيل الآية"
                >
                    ▶️
                </button>

                <button
                    class="open-ayah-btn"
                    onclick="openSearchResult(
                        ${match.surah.number},
                        ${match.ayah.numberInSurah}
                    )"
                >
                    📖 فتح الآية
                </button>

            </div>

        `;

        results.appendChild(resultElement);

    });

    if (matches.length > 50) {

        const more = document.createElement("p");
        more.textContent =
            `تم العثور على ${matches.length} نتيجة. عرض أول 50 نتيجة.`;
        results.appendChild(more);

    }

}


/* ==============================
   OPEN SEARCH RESULT
   ============================== */

function openSearchResult(surahNumber, ayahNumber) {

    window.location.href =
        `surah.html?surah=${surahNumber}&ayah=${ayahNumber}`;

}


/* ==============================
   OPEN REQUESTED AYAH
   ============================== */

function openRequestedAyah() {

    const params = new URLSearchParams(window.location.search);
    const targetAyah = params.get("ayah");

    if (!targetAyah) {
        return;
    }

    const targetElement = document.getElementById(`ayah-${targetAyah}`);

    if (!targetElement) {
        return;
    }

    setTimeout(() => {

        targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        targetElement.classList.add("reading-position");

        setTimeout(() => {
            targetElement.classList.remove("reading-position");
        }, 5000);

    }, 500);

}


/* ==============================
   BOOKMARKS - SAFE STORAGE
   ============================== */

function getBookmarks() {

    try {

        const raw = localStorage.getItem("quranBookmarks");

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);

        return Array.isArray(parsed) ? parsed : [];

    } catch (e) {

        console.warn("Bookmarks unreadable, resetting.", e);
        return [];

    }

}


function saveBookmarks(bookmarks) {

    try {

        localStorage.setItem(
            "quranBookmarks",
            JSON.stringify(bookmarks)
        );

    } catch (e) {

        console.error("Could not save bookmarks", e);

    }

}


/* ==============================
   TOGGLE BOOKMARK
   ============================== */

function toggleBookmark(ayahNumber, surahNumber, button) {

    let bookmarks = getBookmarks();

    const index = bookmarks.findIndex(
        b => b.ayah === ayahNumber && b.surah === surahNumber
    );

    let saved;

    if (index > -1) {

        bookmarks.splice(index, 1);
        saved = false;

    } else {

        bookmarks.push({
            ayah: ayahNumber,
            surah: surahNumber
        });

        saved = true;

    }

    saveBookmarks(bookmarks);

    if (button) {

        button.classList.toggle("saved", saved);
        button.setAttribute("aria-pressed", saved ? "true" : "false");

    }

    showToast(
        saved
            ? "✅ تم حفظ الآية"
            : "🗑️ تم حذف الآية من المحفوظات"
    );

}


/* ==============================
   COPY AYAH
   ============================== */

async function copyAyah(button) {

    const ayah = button.closest(".ayah");

    if (!ayah) return;

    const textElement = ayah.querySelector(".ayah-text");

    if (!textElement) return;

    const text = textElement.textContent.trim();

    try {

        if (navigator.clipboard) {

            await navigator.clipboard.writeText(text);

        } else {

            const textarea = document.createElement("textarea");
            textarea.value = text;

            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();

        }

        const originalText = button.textContent;
        button.textContent = "✅";

        setTimeout(() => {
            button.textContent = originalText;
        }, 1500);

        showToast("📋 تم نسخ الآية");

    } catch (error) {

        console.error("Copy failed:", error);
        showToast("تعذّر نسخ الآية");

    }

}


/* ==============================
   DISPLAY BOOKMARKS
   ============================== */

const bookmarksList = document.getElementById("bookmarks-list");

if (bookmarksList) {
    loadBookmarks();
}


/* ==============================
   LOAD BOOKMARKS
   ============================== */

async function loadBookmarks() {

    const bookmarks = getBookmarks();

    const bookmarksCount = document.getElementById("bookmarks-count");
    const clearBookmarksButton = document.getElementById("clear-bookmarks");

    if (clearBookmarksButton) {
        clearBookmarksButton.style.display =
            bookmarks.length === 0 ? "none" : "block";
    }

    if (bookmarksCount) {

        const count = bookmarks.length;

        if (count === 0) {
            bookmarksCount.textContent = "لا توجد آيات محفوظة";
        } else if (count === 1) {
            bookmarksCount.textContent = "آية واحدة محفوظة";
        } else if (count === 2) {
            bookmarksCount.textContent = "آيتان محفوظتان";
        } else if (count <= 10) {
            bookmarksCount.textContent = `${count} آيات محفوظة`;
        } else {
            bookmarksCount.textContent = `${count} آية محفوظة`;
        }

    }

    if (bookmarks.length === 0) {

        bookmarksList.innerHTML = `
            <p class="empty-bookmarks">
                لا توجد آيات محفوظة حتى الآن.
            </p>
        `;

        return;

    }

    bookmarksList.innerHTML = "<p>جاري تحميل المحفوظات...</p>";

    try {

        const results = [];

        for (const bookmark of bookmarks) {

            const response = await fetch(
                `https://api.alquran.cloud/v1/ayah/${bookmark.ayah}/editions/quran-uthmani-quran-academy,en.sahih`
            );

            const data = await response.json();

            results.push({
                bookmark,
                arabic: data.data[0],
                english: data.data[1]
            });

        }

        bookmarksList.innerHTML = "";

        results.forEach(item => {

            const element = document.createElement("div");
            element.classList.add("search-result");

            element.innerHTML = `

                <div class="search-result-header">

                    <strong>
                        ${item.arabic.surah.name}
                    </strong>

                    <span>
                        آية ${item.arabic.numberInSurah}
                    </span>

                </div>

                <p class="search-ayah">
                    ${item.arabic.text}
                </p>

                <p class="translation" lang="en" dir="ltr">
                    ${item.english.text}
                </p>

                <div class="search-result-actions">

                    <button
                        class="search-play-btn"
                        data-ayah="${item.arabic.number}"
                        data-surah="${item.arabic.surah.number}"
                        data-surah-name="${item.arabic.surah.name}"
                        data-ayah-in-surah="${item.arabic.numberInSurah}"
                        onclick="playAyah(${item.arabic.number}, this)"
                        aria-label="تشغيل الآية"
                    >
                        ▶️
                    </button>

                    <button
                        class="open-ayah-btn"
                        onclick="openSearchResult(
                            ${item.arabic.surah.number},
                            ${item.arabic.numberInSurah}
                        )"
                    >
                        📖 فتح الآية
                    </button>

                    <button
                        class="delete-bookmark-btn"
                        onclick="removeBookmark(
                            ${item.bookmark.ayah},
                            ${item.bookmark.surah}
                        )"
                    >
                        حذف 🔖
                    </button>

                </div>

            `;

            bookmarksList.appendChild(element);

        });

    } catch (error) {

        console.error(error);

        bookmarksList.innerHTML = `
            <p>حدث خطأ أثناء تحميل المحفوظات.</p>
        `;

    }

}


/* ==============================
   REMOVE BOOKMARK
   ============================== */

function removeBookmark(ayahNumber, surahNumber) {

    let bookmarks = getBookmarks();

    bookmarks = bookmarks.filter(
        bookmark =>
            !(
                bookmark.ayah === ayahNumber &&
                bookmark.surah === surahNumber
            )
    );

    saveBookmarks(bookmarks);

    loadBookmarks();

}


/* ==============================
   CLEAR ALL BOOKMARKS
   ============================== */

function clearAllBookmarks() {

    const bookmarks = getBookmarks();

    if (bookmarks.length === 0) {
        return;
    }

    const confirmed = confirm(
        "سيتم حذف جميع الآيات المحفوظة نهائيًا من هذا المتصفح.\n\nهل تريد المتابعة؟"
    );

    if (!confirmed) {
        return;
    }

    try {
        localStorage.removeItem("quranBookmarks");
    } catch (e) {
        console.warn(e);
    }

    loadBookmarks();

}


/* ==============================
   DARK / LIGHT MODE
   ============================== */

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    try {
        localStorage.setItem("quranTheme", isDark ? "dark" : "light");
    } catch (e) {
        console.warn(e);
    }

    updateThemeButton();

}


/* ==============================
   THEME BUTTON
   ============================== */

function updateThemeButton() {

    const button = document.getElementById("theme-toggle");

    if (!button) return;

    const isDark = document.body.classList.contains("dark-mode");

    button.textContent = isDark ? "☀️" : "🌙";

}


/* ==============================
   LOAD SAVED THEME
   ============================== */

function loadTheme() {

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("quranTheme");
    } catch (e) {
        console.warn(e);
    }

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton();

}


loadTheme();


/* =========================
   MOBILE MENU
   ========================= */

function toggleMenu() {

    const nav = document.getElementById("main-nav");

    if (nav) {
        nav.classList.toggle("show");
    }

}


/* =========================
   SURAH NAVIGATION
   ========================= */

function goToPreviousSurah() {

    const params = new URLSearchParams(window.location.search);
    const currentSurah = Number(params.get("surah"));

    if (currentSurah > 1) {
        window.location.href = `surah.html?surah=${currentSurah - 1}`;
    }

}


function goToNextSurah() {

    const params = new URLSearchParams(window.location.search);
    const currentSurah = Number(params.get("surah"));

    if (currentSurah < 114) {
        window.location.href = `surah.html?surah=${currentSurah + 1}`;
    }

}


/* =========================
   READING PROGRESS
   ========================= */

window.addEventListener("scroll", updateReadingProgress);


function updateReadingProgress() {

    const progressBar = document.getElementById("reading-progress");

    if (!progressBar) {
        return;
    }

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
        progressBar.style.width = "100%";
        return;
    }

    const progress = (scrollTop / documentHeight) * 100;

    progressBar.style.width = `${Math.min(progress, 100)}%`;

}


/* ==============================
   MINI AUDIO PLAYER
   ============================== */

const audioPlayer = document.getElementById("audio-player");
const audioMainButton = document.getElementById("audio-main-button");
const audioTitle = document.getElementById("audio-title");
const audioStatus = document.getElementById("audio-status");
const audioProgress = document.getElementById("audio-progress");
const audioCurrentTime = document.getElementById("audio-current-time");
const audioDuration = document.getElementById("audio-duration");


/* ==============================
   SHOW PLAYER
   ============================== */

function showAudioPlayer(ayahNumber, button) {

    if (!audioPlayer) {
        return;
    }

    const surahName =
        button.dataset.surahName || "القرآن الكريم";

    const ayahInSurah =
        button.dataset.ayahInSurah || ayahNumber;

    audioPlayer.classList.add("show");

    if (audioTitle) {
        audioTitle.textContent = `${surahName} • آية ${ayahInSurah}`;
    }

    if (audioStatus) {
        audioStatus.textContent = "جاري التشغيل";
    }

    if (audioMainButton) {
        audioMainButton.textContent = "⏸️";
    }

}


/* ==============================
   UPDATE PLAYER
   ============================== */

function updateAudioPlayer() {

    if (!currentAudio) return;

    if (audioCurrentTime) {
        audioCurrentTime.textContent =
            formatAudioTime(currentAudio.currentTime);
    }

    if (audioDuration && currentAudio.duration) {
        audioDuration.textContent =
            formatAudioTime(currentAudio.duration);
    }

    if (audioProgress && currentAudio.duration) {
        audioProgress.value =
            (currentAudio.currentTime / currentAudio.duration) * 100;
    }

}


/* ==============================
   FORMAT TIME
   ============================== */

function formatAudioTime(seconds) {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (
        minutes + ":" + String(remainingSeconds).padStart(2, "0")
    );

}


/* ==============================
   MAIN PLAY / PAUSE
   ============================== */

function toggleMainAudio() {

    if (!currentAudio) return;

    if (currentAudio.paused) {

        currentAudio.play();

        if (currentPlayButton) currentPlayButton.textContent = "⏸️";
        if (audioMainButton) audioMainButton.textContent = "⏸️";

    } else {

        currentAudio.pause();

        if (currentPlayButton) currentPlayButton.textContent = "▶️";
        if (audioMainButton) audioMainButton.textContent = "▶️";

    }

}


/* ==============================
   NEXT FROM PLAYER
   ============================== */

function playNextFromPlayer() {

    if (!currentAudio) return;

    playNextAyah(Number(currentAudio.dataset.ayah));

}


/* ==============================
   PREVIOUS FROM PLAYER
   ============================== */

function playPreviousFromPlayer() {

    if (!currentAudio) return;

    const buttons = Array.from(
        document.querySelectorAll(".play-button, .search-play-btn")
    );

    const currentNumber = Number(currentAudio.dataset.ayah);

    const currentIndex = buttons.findIndex(
        button => Number(button.dataset.ayah) === currentNumber
    );

    if (currentIndex === -1) return;

    if (currentIndex > 0) {

        const previousButton = buttons[currentIndex - 1];

        startAyahAudio(
            Number(previousButton.dataset.ayah),
            previousButton
        );

    }

}


/* ==============================
   PROGRESS BAR
   ============================== */

if (audioProgress) {

    audioProgress.addEventListener("input", function () {

        if (!currentAudio || !currentAudio.duration) return;

        currentAudio.currentTime =
            (Number(audioProgress.value) / 100) * currentAudio.duration;

    });

}


/* ==============================
   CLOSE PLAYER
   ============================== */

function closeAudioPlayer() {

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (currentPlayButton) {
        currentPlayButton.textContent = "▶️";
        currentPlayButton.classList.remove("playing");
    }

    if (currentAyahElement) {
        currentAyahElement.classList.remove("playing");
    }

    if (audioPlayer) {
        audioPlayer.classList.remove("show");
    }

    currentAudio = null;
    currentPlayButton = null;
    currentAyahElement = null;

}


/* ==============================
   AUDIO EVENTS
   ============================== */

function connectAudioPlayer() {

    if (!currentAudio) return;

    currentAudio.ontimeupdate = updateAudioPlayer;
    currentAudio.onloadedmetadata = updateAudioPlayer;

}


/* ==============================
   CONTINUE READING
   ============================== */

function continueReading() {

    let saved = null;

    try {
        saved = localStorage.getItem("lastReadingPosition");
    } catch (e) {
        console.warn(e);
    }

    if (!saved) return;

    const position = JSON.parse(saved);

    window.location.href =
        `surah.html?surah=${position.surah}&ayah=${position.ayah}`;

}


const continueReadingButton =
    document.getElementById("continue-reading");

if (continueReadingButton) {

    let saved = null;

    try {
        saved = localStorage.getItem("lastReadingPosition");
    } catch (e) {
        console.warn(e);
    }

    if (saved) {
        continueReadingButton.style.display = "inline-flex";
    }

}


/* ==============================
   AUDIO VOLUME
   ============================== */

const audioVolume = document.getElementById("audio-volume");

if (audioVolume) {

    audioVolume.addEventListener("input", function () {

        if (!currentAudio) return;

        currentAudio.volume = Number(this.value);

    });

}