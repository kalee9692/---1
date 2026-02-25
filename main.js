const drawButton = document.getElementById('draw-button');
const numberSpans = document.querySelectorAll('.number-group .number');
const bonusSpan = document.querySelector('.bonus-group .bonus');
const ballContainer = document.querySelector('.ball-container');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');

const translations = {
    en: {
        title: 'Lotto Number Drawer',
        draw: 'Draw Numbers',
        winning: 'Winning Numbers',
        contactTitle: 'Partnership Inquiry',
        contactSubtitle: 'Leave your details and message. We will get back to you.',
        contactNameLabel: 'Name',
        contactEmailLabel: 'Email',
        contactMessageLabel: 'Message',
        contactSubmit: 'Send Inquiry',
        commentsTitle: 'Comments',
        animalLink: 'Animal Face Test',
        themeToDark: 'Switch to Dark',
        themeToLight: 'Switch to Light',
        langToKo: '한국어',
        langToEn: 'English'
    },
    ko: {
        title: '로또 번호 추첨기',
        draw: '번호 추첨',
        winning: '당첨 번호',
        contactTitle: '제휴 문의',
        contactSubtitle: '연락처와 문의 내용을 남겨 주세요. 확인 후 회신드리겠습니다.',
        contactNameLabel: '이름',
        contactEmailLabel: '이메일',
        contactMessageLabel: '문의 내용',
        contactSubmit: '문의 보내기',
        commentsTitle: '댓글',
        animalLink: '동물상 테스트',
        themeToDark: '다크 모드',
        themeToLight: '화이트 모드',
        langToKo: '한국어',
        langToEn: 'English'
    }
};

const storageKeys = {
    theme: 'lottoTheme',
    lang: 'lottoLang'
};

function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
    document.documentElement.lang = lang;
}

function updateToggleLabels() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const currentLang = document.documentElement.lang || 'en';
    const dict = translations[currentLang] || translations.en;

    themeToggle.textContent = currentTheme === 'dark' ? dict.themeToLight : dict.themeToDark;
    langToggle.textContent = currentLang === 'ko' ? dict.langToEn : dict.langToKo;
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(storageKeys.theme, theme);
    updateToggleLabels();
    reloadDisqus(theme);
}

function setLanguage(lang) {
    localStorage.setItem(storageKeys.lang, lang);
    applyTranslations(lang);
    updateToggleLabels();
}

function initPreferences() {
    const savedTheme = localStorage.getItem(storageKeys.theme);
    const savedLang = localStorage.getItem(storageKeys.lang);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    setLanguage(savedLang || 'en');
}

drawButton.addEventListener('click', () => {
    drawNumbers();
});

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

langToggle.addEventListener('click', () => {
    const currentLang = document.documentElement.lang || 'en';
    setLanguage(currentLang === 'ko' ? 'en' : 'ko');
});

function createBall(number) {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.textContent = number;
    ball.style.backgroundColor = getColor(number);
    return ball;
}

function getColor(number) {
    if (number <= 10) {
        return '#fbc400'; // Yellow
    } else if (number <= 20) {
        return '#69c8f2'; // Blue
    } else if (number <= 30) {
        return '#ff7272'; // Red
    } else if (number <= 40) {
        return '#aaa'; // Gray
    } else {
        return '#b0d840'; // Green
    }
}

function drawNumbers() {
    ballContainer.innerHTML = '';
    // Create and animate balls
    for (let i = 0; i < 45; i++) {
        const ball = createBall(i + 1);
        ball.style.left = `${Math.random() * 80 + 10}%`;
        ball.style.top = `${Math.random() * 80 + 10}%`;
        ballContainer.appendChild(ball);
    }

    setTimeout(() => {
        const numbers = new Set();
        while (numbers.size < 7) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const winningNumbers = Array.from(numbers);
        const bonusNumber = winningNumbers.pop();

        numberSpans.forEach((span, index) => {
            span.textContent = winningNumbers[index];
            span.style.backgroundColor = getColor(winningNumbers[index]);
        });

        bonusSpan.textContent = bonusNumber;
        bonusSpan.style.backgroundColor = getColor(bonusNumber);

        ballContainer.innerHTML = '';
    }, 3000); // Wait for 3 seconds for the animation to run
}

initPreferences();

function loadDisqus(theme) {
    const disqusThread = document.getElementById('disqus_thread');
    if (!disqusThread) return;

    disqusThread.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://bluedragon-test1.disqus.com/embed.js';
    script.setAttribute('data-timestamp', +new Date());
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    script.id = 'disqus-embed';
    (document.head || document.body).appendChild(script);
}

function reloadDisqus(theme) {
    const existingScript = document.getElementById('disqus-embed');
    if (existingScript) {
        existingScript.remove();
    }
    loadDisqus(theme);
}

loadDisqus(document.documentElement.getAttribute('data-theme') || 'dark');
