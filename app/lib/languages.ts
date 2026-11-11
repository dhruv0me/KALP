export type LanguageCode =
  | "en"
  | "hi"
  | "es"
  | "zh"
  | "ar"
  | "fr"
  | "bn"
  | "pt"
  | "ru"
  | "ja"
  | "de"
  | "ko"
  | "ta"
  | "te"
  | "mr"
  | "ur"
  | "id"
  | "tr"
  | "vi"
  | "it";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  dir: "ltr" | "rtl";
}

export const DEFAULT_LANGUAGE_CODE: LanguageCode = "en";

const DEFAULT_LANGUAGE: LanguageOption = {
  code: "en",
  name: "English",
  nativeName: "English",
  region: "Global / UK / USA / India",
  dir: "ltr",
};

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  DEFAULT_LANGUAGE,
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    region: "India",
    dir: "ltr",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    region: "Spain / Latin America",
    dir: "ltr",
  },
  {
    code: "zh",
    name: "Mandarin Chinese",
    nativeName: "普通话 / 中文",
    region: "China / Taiwan / Singapore",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    region: "Middle East / North Africa",
    dir: "rtl",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    region: "France / Canada / Africa",
    dir: "ltr",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    region: "Bangladesh / India",
    dir: "ltr",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    region: "Brazil / Portugal",
    dir: "ltr",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    region: "Russia / Eastern Europe",
    dir: "ltr",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    region: "Japan",
    dir: "ltr",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    region: "Germany / Austria / Switzerland",
    dir: "ltr",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    region: "South Korea / North Korea",
    dir: "ltr",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    region: "India / Sri Lanka / Singapore",
    dir: "ltr",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    region: "India",
    dir: "ltr",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    region: "India",
    dir: "ltr",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    region: "Pakistan / India",
    dir: "rtl",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    region: "Indonesia",
    dir: "ltr",
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    region: "Turkey",
    dir: "ltr",
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    region: "Vietnam",
    dir: "ltr",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    region: "Italy",
    dir: "ltr",
  },
];

export interface UiCopy {
  nav: {
    home: string;
    about: string;
    explore: string;
    howItWorks: string;
    contact: string;
    login: string;
    logout: string;
    language: string;
    selectLanguage: string;
  };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineEmphasis: string;
    headlineLine2End: string;
    description: string;
    exploreCta: string;
    startCta: string;
    scrollIndicator: string;
  };
  footer: {
    tagline: string;
    startCta: string;
    contactTitle: string;
    contactBody: string;
    builtFor: string;
  };
}

const EN_COPY: UiCopy = {
  nav: {
    home: "Home",
    about: "About Us",
    explore: "Explore Campaigns",
    howItWorks: "How It Works",
    contact: "Contact Us",
    login: "Log in",
    logout: "Log out",
    language: "Language",
    selectLanguage: "Select language",
  },
  hero: {
    eyebrow: "TRANSPARENT CROWDFUNDING FOR CAMPUS INNOVATION",
    headlineLine1: "Fund bold ideas.",
    headlineEmphasis: "Verify",
    headlineLine2End: "every step.",
    description:
      "A transparent, blockchain-oriented crowdfunding space built for student projects, college events, hackathon builds, and campus startups — keeping goals, progress, and project records open to every supporter.",
    exploreCta: "Explore Campaigns",
    startCta: "Start a Campaign",
    scrollIndicator: "SCROLL TO EXPLORE",
  },
  footer: {
    tagline:
      "Transparent crowdfunding for student projects, college events, hackathon builds, and campus startups.",
    startCta: "Start a Campaign",
    contactTitle: "Contact Us",
    contactBody:
      "Official support channels and campus onboarding details will be published here once active.",
    builtFor: "Built for transparent campus innovation.",
  },
};

const TRANSLATIONS: Record<LanguageCode, UiCopy> = {
  en: EN_COPY,
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      explore: "अभियान देखें",
      howItWorks: "यह कैसे काम करता है",
      contact: "संपर्क करें",
      login: "लॉग इन",
      logout: "लॉग आउट",
      language: "भाषा",
      selectLanguage: "भाषा चुनें",
    },
    hero: {
      eyebrow: "कैंपस नवाचार के लिए पारदर्शी क्राउडफंडिंग",
      headlineLine1: "नए विचारों को समर्थन दें।",
      headlineEmphasis: "सत्यापित",
      headlineLine2End: "हर कदम।",
      description:
        "छात्र परियोजनाओं, कॉलेज कार्यक्रमों, हैकथॉन और कैंपस स्टार्टअप्स के लिए एक पारदर्शी क्राउडफंडिंग मंच — जहाँ लक्ष्य, प्रगति और रिकॉर्ड हर समर्थक के लिए खुले हैं।",
      exploreCta: "अभियान देखें",
      startCta: "अभियान शुरू करें",
      scrollIndicator: "नीचे स्क्रॉल करें",
    },
    footer: {
      tagline:
        "छात्र परियोजनाओं, कॉलेज कार्यक्रमों, हैकथॉन और कैंपस स्टार्टअप्स के लिए पारदर्शी क्राउडफंडिंग।",
      startCta: "अभियान शुरू करें",
      contactTitle: "संपर्क करें",
      contactBody:
        "आधिकारिक सहायता चैनल और कैंपस ऑनबोर्डिंग विवरण सक्रिय होने पर यहाँ प्रकाशित किए जाएँगे।",
      builtFor: "पारदर्शी कैंपस नवाचार के लिए निर्मित।",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre nosotros",
      explore: "Explorar campañas",
      howItWorks: "Cómo funciona",
      contact: "Contacto",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      language: "Idioma",
      selectLanguage: "Seleccionar idioma",
    },
    hero: {
      eyebrow: "FINANCIACIÓN COLECTIVA TRANSPARENTE PARA CAMPUS",
      headlineLine1: "Impulsa ideas audaces.",
      headlineEmphasis: "Verifica",
      headlineLine2End: "cada paso.",
      description:
        "Un espacio transparente de financiamiento colectivo para proyectos estudiantiles, eventos universitarios, hackatones y startups de campus, con metas y avances abiertos.",
      exploreCta: "Explorar campañas",
      startCta: "Iniciar campaña",
      scrollIndicator: "DESPLAZA PARA EXPLORAR",
    },
    footer: {
      tagline:
        "Financiación colectiva transparente para proyectos estudiantiles, eventos universitarios, hackatones y startups.",
      startCta: "Iniciar campaña",
      contactTitle: "Contacto",
      contactBody:
        "Los canales oficiales de soporte y detalles de registro se publicarán aquí cuando estén activos.",
      builtFor: "Construido para la innovación universitaria transparente.",
    },
  },
  zh: {
    nav: {
      home: "首页",
      about: "关于我们",
      explore: "浏览项目",
      howItWorks: "运作方式",
      contact: "联系我们",
      login: "登录",
      logout: "退出登录",
      language: "语言",
      selectLanguage: "选择语言",
    },
    hero: {
      eyebrow: "面向校园创新的透明众筹平台",
      headlineLine1: "支持大胆创意。",
      headlineEmphasis: "验证",
      headlineLine2End: "每一步进展。",
      description:
        "为学生项目、高校活动、黑客松作品和校园初创团队打造的透明众筹空间，目标、进度与记录向每位支持者公开。",
      exploreCta: "浏览项目",
      startCta: "发起项目",
      scrollIndicator: "向下滚动探索",
    },
    footer: {
      tagline: "专为学生项目、高校活动、黑客松与校园初创团队打造的透明众筹。",
      startCta: "发起项目",
      contactTitle: "联系我们",
      contactBody: "官方支持渠道与校园入驻信息将在启用后在此公布。",
      builtFor: "为透明的校园创新而建。",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      explore: "استكشاف الحملات",
      howItWorks: "كيف يعمل",
      contact: "اتصل بنا",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      language: "اللغة",
      selectLanguage: "اختر اللغة",
    },
    hero: {
      eyebrow: "تمويل جماعي شفاف للابتكار الجامعي",
      headlineLine1: "موّل الأفكار الجريئة.",
      headlineEmphasis: "تحقّق",
      headlineLine2End: "من كل خطوة.",
      description:
        "منصة تمويل جماعي شفافة لمشاريع الطلاب والفعاليات الجامعية والهاكاثونات والشركات الناشئة في الحرم الجامعي، مع إتاحة الأهداف والتقدم للجميع.",
      exploreCta: "استكشاف الحملات",
      startCta: "ابدأ حملة",
      scrollIndicator: "مرّر للاستكشاف",
    },
    footer: {
      tagline:
        "تمويل جماعي شفاف لمشاريع الطلاب والفعاليات الجامعية والهاكاثونات والشركات الناشئة.",
      startCta: "ابدأ حملة",
      contactTitle: "اتصل بنا",
      contactBody:
        "ستُنشر قنوات الدعم الرسمية وتفاصيل انضمام الجامعات هنا فور تفعيلها.",
      builtFor: "صُمم لابتكار جامعي شفاف.",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      explore: "Explorer les campagnes",
      howItWorks: "Comment ça marche",
      contact: "Contact",
      login: "Connexion",
      logout: "Déconnexion",
      language: "Langue",
      selectLanguage: "Choisir la langue",
    },
    hero: {
      eyebrow: "FINANCEMENT PARTICIPATIF TRANSPARENT SUR CAMPUS",
      headlineLine1: "Soutenez des idées audacieuses.",
      headlineEmphasis: "Vérifiez",
      headlineLine2End: "chaque étape.",
      description:
        "Un espace de financement transparent conçu pour les projets étudiants, événements universitaires, hackathons et startups de campus.",
      exploreCta: "Explorer les campagnes",
      startCta: "Lancer une campagne",
      scrollIndicator: "DÉFILER POUR EXPLORER",
    },
    footer: {
      tagline:
        "Financement participatif transparent pour projets étudiants, événements, hackathons et startups.",
      startCta: "Lancer une campagne",
      contactTitle: "Contact",
      contactBody:
        "Les canaux d'assistance officiels seront publiés ici dès leur activation.",
      builtFor: "Conçu pour l'innovation étudiante transparente.",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      explore: "ক্যাম্পেইন দেখুন",
      howItWorks: "কীভাবে কাজ করে",
      contact: "যোগাযোগ",
      login: "লগ ইন",
      logout: "লগ আউট",
      language: "ভাষা",
      selectLanguage: "ভাষা নির্বাচন করুন",
    },
    hero: {
      eyebrow: "ক্যাম্পাস উদ্ভাবনের জন্য স্বচ্ছ ক্রাউডফান্ডিং",
      headlineLine1: "সাহসী উদ্যোগে সহায়তা করুন।",
      headlineEmphasis: "যাচাই",
      headlineLine2End: "করুন প্রতিটি ধাপ।",
      description:
        "শিক্ষার্থীদের প্রকল্প, কলেজ ইভেন্ট, হ্যাকাথন এবং ক্যাম্পাস স্টার্টআপের জন্য স্বচ্ছ ক্রাউডফান্ডিং প্ল্যাটফর্ম।",
      exploreCta: "ক্যাম্পেইন দেখুন",
      startCta: "ক্যাম্পেইন শুরু করুন",
      scrollIndicator: "নিচে স্ক্রল করুন",
    },
    footer: {
      tagline:
        "শিক্ষার্থীদের প্রকল্প, কলেজ ইভেন্ট, হ্যাকাথন ও স্টার্টআপের জন্য স্বচ্ছ ক্রাউডফান্ডিং।",
      startCta: "ক্যাম্পেইন শুরু করুন",
      contactTitle: "যোগাযোগ",
      contactBody:
        "অফিশিয়াল সহায়তা চ্যানেল সক্রিয় হলে এখানে প্রকাশ করা হবে।",
      builtFor: "স্বচ্ছ ক্যাম্পাস উদ্ভাবনের জন্য নির্মিত।",
    },
  },
  pt: {
    nav: {
      home: "Início",
      about: "Sobre nós",
      explore: "Explorar campanhas",
      howItWorks: "Como funciona",
      contact: "Contato",
      login: "Entrar",
      logout: "Sair",
      language: "Idioma",
      selectLanguage: "Selecionar idioma",
    },
    hero: {
      eyebrow: "FINANCIAMENTO COLETIVO TRANSPARENTE NO CAMPUS",
      headlineLine1: "Apoie ideias ousadas.",
      headlineEmphasis: "Verifique",
      headlineLine2End: "cada etapa.",
      description:
        "Um espaço transparente de crowdfunding para projetos estudantis, eventos universitários, hackathons e startups acadêmicas.",
      exploreCta: "Explorar campanhas",
      startCta: "Criar campanha",
      scrollIndicator: "ROLE PARA EXPLORAR",
    },
    footer: {
      tagline:
        "Financiamento coletivo transparente para projetos estudantis, eventos, hackathons e startups.",
      startCta: "Criar campanha",
      contactTitle: "Contato",
      contactBody:
        "Os canais oficiais de suporte serão publicados aqui assim que estiverem ativos.",
      builtFor: "Feito para a inovação universitária transparente.",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      about: "О нас",
      explore: "Кампании",
      howItWorks: "Как это работает",
      contact: "Контакты",
      login: "Войти",
      logout: "Выйти",
      language: "Язык",
      selectLanguage: "Выбрать язык",
    },
    hero: {
      eyebrow: "ПРОЗРАЧНЫЙ КРАУДФАНДИНГ ДЛЯ КАМПУСНЫХ ИННОВАЦИЙ",
      headlineLine1: "Поддерживайте смелые идеи.",
      headlineEmphasis: "Проверяйте",
      headlineLine2End: "каждый шаг.",
      description:
        "Прозрачная платформа краудфандинга для студенческих проектов, вузовских мероприятий, хакатонов и кампусных стартапов.",
      exploreCta: "Смотреть кампании",
      startCta: "Запустить кампанию",
      scrollIndicator: "ПРОКРУТИТЕ ВНИЗ",
    },
    footer: {
      tagline:
        "Прозрачный краудфандинг для студенческих проектов, мероприятий, хакатонов и стартапов.",
      startCta: "Запустить кампанию",
      contactTitle: "Контакты",
      contactBody:
        "Официальные каналы поддержки будут опубликованы здесь после запуска.",
      builtFor: "Создано для прозрачных студенческих инициатив.",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      about: "私たちについて",
      explore: "プロジェクトを探す",
      howItWorks: "仕組み",
      contact: "お問い合わせ",
      login: "ログイン",
      logout: "ログアウト",
      language: "言語",
      selectLanguage: "言語を選択",
    },
    hero: {
      eyebrow: "キャンパス・イノベーションのための透明なクラウドファンディング",
      headlineLine1: "大胆なアイデアを支援。",
      headlineEmphasis: "検証",
      headlineLine2End: "すべてのステップを。",
      description:
        "学生プロジェクト、大学イベント、ハッカソン、学生スタートアップのための透明性の高いクラウドファンディングプラットフォーム。",
      exploreCta: "プロジェクトを探す",
      startCta: "プロジェクトを始める",
      scrollIndicator: "スクロールして探索",
    },
    footer: {
      tagline:
        "学生プロジェクト、大学イベント、ハッカソン、キャンパス発スタートアップのための透明なクラウドファンディング。",
      startCta: "プロジェクトを始める",
      contactTitle: "お問い合わせ",
      contactBody: "公式サポート窓口は準備が整い次第ここに公開されます。",
      builtFor: "透明なキャンパス・イノベーションのために。",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      explore: "Kampagnen entdecken",
      howItWorks: "So funktioniert's",
      contact: "Kontakt",
      login: "Anmelden",
      logout: "Abmelden",
      language: "Sprache",
      selectLanguage: "Sprache wählen",
    },
    hero: {
      eyebrow: "TRANSPARENTES CROWDFUNDING FÜR CAMPUS-INNOVATION",
      headlineLine1: "Mutige Ideen fördern.",
      headlineEmphasis: "Prüfen",
      headlineLine2End: "Sie jeden Schritt.",
      description:
        "Eine transparente Crowdfunding-Plattform für Studierendenprojekte, Hochschul-Events, Hackathons und Campus-Startups.",
      exploreCta: "Kampagnen entdecken",
      startCta: "Kampagne starten",
      scrollIndicator: "ZUM ENTDECKEN SCROLLEN",
    },
    footer: {
      tagline:
        "Transparentes Crowdfunding für Studierendenprojekte, Events, Hackathons und Campus-Startups.",
      startCta: "Kampagne starten",
      contactTitle: "Kontakt",
      contactBody:
        "Offizielle Support-Kanäle werden hier veröffentlicht, sobald sie aktiv sind.",
      builtFor: "Gebaut für transparente Campus-Innovation.",
    },
  },
  ko: {
    nav: {
      home: "홈",
      about: "소개",
      explore: "캠페인 탐색",
      howItWorks: "이용 방법",
      contact: "문의하기",
      login: "로그인",
      logout: "로그아웃",
      language: "언어",
      selectLanguage: "언어 선택",
    },
    hero: {
      eyebrow: "캠퍼스 혁신을 위한 투명한 크라우드펀딩",
      headlineLine1: "대담한 아이디어를 후원하세요.",
      headlineEmphasis: "검증",
      headlineLine2End: "모든 과정을 투명하게.",
      description:
        "학생 프로젝트, 대학 행사, 해커톤, 캠퍼스 스타트업을 위한 투명한 크라우드펀딩 플랫폼입니다.",
      exploreCta: "캠페인 탐색",
      startCta: "캠페인 시작하기",
      scrollIndicator: "스크롤하여 살펴보기",
    },
    footer: {
      tagline:
        "학생 프로젝트, 대학 행사, 해커톤, 캠퍼스 스타트업을 위한 투명한 크라우드펀딩.",
      startCta: "캠페인 시작하기",
      contactTitle: "문의하기",
      contactBody: "공식 지원 채널은 활성화되는 대로 이곳에 안내됩니다.",
      builtFor: "투명한 캠퍼스 혁신을 위해 만들어졌습니다.",
    },
  },
  ta: {
    nav: {
      home: "முகப்பு",
      about: "எங்களை பற்றி",
      explore: "திட்டங்களை காண்க",
      howItWorks: "செயல்படும் விதம்",
      contact: "தொடர்பு கொள்ள",
      login: "உள்நுழைக",
      logout: "வெளியேறுக",
      language: "மொழி",
      selectLanguage: "மொழியை தேர்ந்தெடுக்கவும்",
    },
    hero: {
      eyebrow: "வளாக புதுமைக்கான வெளிப்படையான நிதி திரட்டல்",
      headlineLine1: "புதிய யோசனைகளுக்கு ஆதரவு.",
      headlineEmphasis: "சரிபார்க்கவும்",
      headlineLine2End: "ஒவ்வொரு படியும்.",
      description:
        "மாணவர் திட்டங்கள், கல்லூரி நிகழ்வுகள், ஹேக்கத்தான்கள் மற்றும் வளாக ஸ்டார்ட்அப்களுக்கான வெளிப்படையான நிதி தளம்.",
      exploreCta: "திட்டங்களை காண்க",
      startCta: "திட்டம் தொடங்கவும்",
      scrollIndicator: "கீழே பார்க்கவும்",
    },
    footer: {
      tagline:
        "மாணவர் திட்டங்கள், கல்லூரி நிகழ்வுகள், ஹேக்கத்தான்கள் மற்றும் ஸ்டார்ட்அப்களுக்கான வெளிப்படையான தளம்.",
      startCta: "திட்டம் தொடங்கவும்",
      contactTitle: "தொடர்பு கொள்ள",
      contactBody:
        "அதிகாரப்பூர்வ உதவி சேனல்கள் செயல்பாட்டிற்கு வந்ததும் இங்கே வெளியிடப்படும்.",
      builtFor: "வெளிப்படையான வளாக புதுமைக்காக உருவாக்கப்பட்டது.",
    },
  },
  te: {
    nav: {
      home: "హోమ్",
      about: "మా గురించి",
      explore: "ప్రచారాలను చూడండి",
      howItWorks: "ఎలా పనిచేస్తుంది",
      contact: "సంప్రదించండి",
      login: "లాగిన్",
      logout: "లాగ్ అవుట్",
      language: "భాష",
      selectLanguage: "భాషను ఎంచుకోండి",
    },
    hero: {
      eyebrow: "క్యాంపస్ ఆవిష్కరణల కోసం పారదర్శక క్రౌడ్‌ఫండింగ్",
      headlineLine1: "ధైర్యమైన ఆలోచనలకు మద్దతు.",
      headlineEmphasis: "ధృవీకరించండి",
      headlineLine2End: "ప్రతి అడుగు.",
      description:
        "విద్యార్థి ప్రాజెక్టులు, కాలేజీ ఈవెంట్లు, హ్యాకథాన్‌లు మరియు క్యాంపస్ స్టార్టప్‌ల కోసం పారదర్శక నిధుల వేదిక.",
      exploreCta: "ప్రచారాలను చూడండి",
      startCta: "ప్రచారం ప్రారంభించండి",
      scrollIndicator: "క్రిందికి స్క్రోల్ చేయండి",
    },
    footer: {
      tagline:
        "విద్యార్థి ప్రాజెక్టులు, కాలేజీ ఈవెంట్లు, హ్యాకథాన్‌లు మరియు స్టార్టప్‌ల కోసం పారదర్శక క్రౌడ్‌ఫండింగ్.",
      startCta: "ప్రచారం ప్రారంభించండి",
      contactTitle: "సంప్రదించండి",
      contactBody:
        "అధికారిక మద్దతు వివరాలు అందుబాటులోకి వచ్చిన తర్వాత ఇక్కడ ప్రచురించబడతాయి.",
      builtFor: "పారదర్శక క్యాంపస్ ఆవిష్కరణ కోసం నిర్మించబడింది.",
    },
  },
  mr: {
    nav: {
      home: "मुख्यपृष्ठ",
      about: "आमच्याबद्दल",
      explore: "मोहिमा पहा",
      howItWorks: "हे कसे कार्य करते",
      contact: "संपर्क साधा",
      login: "लॉग इन",
      logout: "लॉग आउट",
      language: "भाषा",
      selectLanguage: "भाषा निवडा",
    },
    hero: {
      eyebrow: "कॅम्पस नवोपक्रमासाठी पारदर्शक क्राउडफंडिंग",
      headlineLine1: "नव्या कल्पनांना बळ द्या.",
      headlineEmphasis: "पडताळा",
      headlineLine2End: "प्रत्येक पाऊल.",
      description:
        "विद्यार्थी प्रकल्प, महाविद्यालयीन उपक्रम, हॅकाथॉन आणि कॅम्पस स्टार्टअप्ससाठी पारदर्शक क्राउडफंडिंग मंच.",
      exploreCta: "मोहिमा पहा",
      startCta: "मोहीम सुरू करा",
      scrollIndicator: "पाहण्यासाठी खाली स्क्रोल करा",
    },
    footer: {
      tagline:
        "विद्यार्थी प्रकल्प, महाविद्यालयीन उपक्रम, हॅकाथॉन आणि स्टार्टअप्ससाठी पारदर्शक क्राउडफंडिंग.",
      startCta: "मोहीम सुरू करा",
      contactTitle: "संपर्क साधा",
      contactBody:
        "अधिकृत मदत केंद्रे सुरू झाल्यावर येथे प्रकाशित केली जातील.",
      builtFor: "पारदर्शक कॅम्पस नवोपक्रमासाठी तयार केलेले.",
    },
  },
  ur: {
    nav: {
      home: "ہوم",
      about: "ہمارے بارے میں",
      explore: "مہمات دیکھیں",
      howItWorks: "یہ کیسے کام کرتا ہے",
      contact: "رابطہ کریں",
      login: "لاگ ان",
      logout: "لاگ آؤٹ",
      language: "زبان",
      selectLanguage: "زبان منتخب کریں",
    },
    hero: {
      eyebrow: "کیمپس جدت کے لیے شفاف کراؤڈ فنڈنگ",
      headlineLine1: "نئے خیالات کی حمایت کریں۔",
      headlineEmphasis: "تصدیق",
      headlineLine2End: "کریں ہر قدم۔",
      description:
        "طلبہ کے منصوبوں، کالج ایونٹس، ہیکاتھون اور کیمپس اسٹارٹ اپس کے لیے ایک شفاف کراؤڈ فنڈنگ پلیٹ فارم۔",
      exploreCta: "مہمات دیکھیں",
      startCta: "مہم شروع کریں",
      scrollIndicator: "مزید دیکھنے کے لیے اسکرول کریں",
    },
    footer: {
      tagline:
        "طلبہ کے منصوبوں، کالج ایونٹس، ہیکاتھون اور کیمپس اسٹارٹ اپس کے لیے شفاف کراؤڈ فنڈنگ۔",
      startCta: "مہم شروع کریں",
      contactTitle: "رابطہ کریں",
      contactBody:
        "باضابطہ سپورٹ چینلز فعال ہونے پر یہاں شائع کیے جائیں گے۔",
      builtFor: "شفاف کیمپس جدت کے لیے تیار کردہ۔",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang Kami",
      explore: "Jelajahi Kampanye",
      howItWorks: "Cara Kerja",
      contact: "Hubungi Kami",
      login: "Masuk",
      logout: "Keluar",
      language: "Bahasa",
      selectLanguage: "Pilih bahasa",
    },
    hero: {
      eyebrow: "URUN DANA TRANSPARAN UNTUK INOVASI KAMPUS",
      headlineLine1: "Danai ide berani.",
      headlineEmphasis: "Verifikasi",
      headlineLine2End: "setiap langkah.",
      description:
        "Ruang urun dana transparan untuk proyek mahasiswa, acara kampus, hackathon, dan startup mahasiswa dengan catatan terbuka.",
      exploreCta: "Jelajahi Kampanye",
      startCta: "Mulai Kampanye",
      scrollIndicator: "GULIR UNTUK MENJELAJAH",
    },
    footer: {
      tagline:
        "Urun dana transparan untuk proyek mahasiswa, acara kampus, hackathon, dan startup.",
      startCta: "Mulai Kampanye",
      contactTitle: "Hubungi Kami",
      contactBody:
        "Saluran dukungan resmi akan dipublikasikan di sini setelah aktif.",
      builtFor: "Dibangun untuk inovasi kampus yang transparan.",
    },
  },
  tr: {
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      explore: "Kampanyaları Keşfet",
      howItWorks: "Nasıl Çalışır",
      contact: "İletişim",
      login: "Giriş yap",
      logout: "Çıkış yap",
      language: "Dil",
      selectLanguage: "Dil seçin",
    },
    hero: {
      eyebrow: "KAMPÜS İNOVASYONU İÇİN ŞEFFAF KİTLE FONLAMASI",
      headlineLine1: "Cesur fikirleri destekle.",
      headlineEmphasis: "Doğrula",
      headlineLine2End: "her adımı.",
      description:
        "Öğrenci projeleri, üniversite etkinlikleri, hackathon çalışmaları ve kampüs girişimleri için şeffaf kitle fonlama alanı.",
      exploreCta: "Kampanyaları Keşfet",
      startCta: "Kampanya Başlat",
      scrollIndicator: "KEŞFETMEK İÇİN KAYDIRIN",
    },
    footer: {
      tagline:
        "Öğrenci projeleri, üniversite etkinlikleri, hackathonlar ve kampüs girişimleri için şeffaf kitle fonlaması.",
      startCta: "Kampanya Başlat",
      contactTitle: "İletişim",
      contactBody:
        "Resmi destek kanalları aktif olduğunda burada yayınlanacaktır.",
      builtFor: "Şeffaf kampüs inovasyonu için geliştirildi.",
    },
  },
  vi: {
    nav: {
      home: "Trang chủ",
      about: "Về chúng tôi",
      explore: "Khám phá chiến dịch",
      howItWorks: "Cách hoạt động",
      contact: "Liên hệ",
      login: "Đăng nhập",
      logout: "Đăng xuất",
      language: "Ngôn ngữ",
      selectLanguage: "Chọn ngôn ngữ",
    },
    hero: {
      eyebrow: "GỌI VỐN MINH BẠCH CHO ĐỔI MỚI SINH VIÊN",
      headlineLine1: "Tiếp sức ý tưởng táo bạo.",
      headlineEmphasis: "Xác minh",
      headlineLine2End: "từng bước đi.",
      description:
        "Không gian gọi vốn cộng đồng minh bạch dành cho dự án sinh viên, sự kiện đại học, hackathon và startup khuôn viên trường.",
      exploreCta: "Khám phá chiến dịch",
      startCta: "Tạo chiến dịch",
      scrollIndicator: "CUỘN ĐỂ KHÁM PHÁ",
    },
    footer: {
      tagline:
        "Nền tảng gọi vốn minh bạch cho dự án sinh viên, sự kiện đại học, hackathon và startup.",
      startCta: "Tạo chiến dịch",
      contactTitle: "Liên hệ",
      contactBody:
        "Các kênh hỗ trợ chính thức sẽ được công bố tại đây khi đi vào hoạt động.",
      builtFor: "Xây dựng cho đổi mới minh bạch trong trường học.",
    },
  },
  it: {
    nav: {
      home: "Home",
      about: "Chi siamo",
      explore: "Esplora campagne",
      howItWorks: "Come funziona",
      contact: "Contatti",
      login: "Accedi",
      logout: "Esci",
      language: "Lingua",
      selectLanguage: "Seleziona lingua",
    },
    hero: {
      eyebrow: "CROWDFUNDING TRASPARENTE PER L'INNOVAZIONE UNIVERSITARIA",
      headlineLine1: "Finanzia idee coraggiose.",
      headlineEmphasis: "Verifica",
      headlineLine2End: "ogni passo.",
      description:
        "Uno spazio di crowdfunding trasparente per progetti studenteschi, eventi universitari, hackathon e startup di campus.",
      exploreCta: "Esplora campagne",
      startCta: "Avvia campagna",
      scrollIndicator: "SCORRI PER ESPLORARE",
    },
    footer: {
      tagline:
        "Crowdfunding trasparente per progetti studenteschi, eventi universitari, hackathon e startup.",
      startCta: "Avvia campagna",
      contactTitle: "Contatti",
      contactBody:
        "I canali ufficiali di supporto saranno pubblicati qui una volta attivi.",
      builtFor: "Creato per l'innovazione universitaria trasparente.",
    },
  },
};

export function isSupportedLanguage(value: string): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((item) => item.code === value);
}

export function getLanguageOption(code: LanguageCode): LanguageOption {
  return (
    SUPPORTED_LANGUAGES.find((item) => item.code === code) ??
    SUPPORTED_LANGUAGES[0]
  );
}

export function getUiCopy(code: LanguageCode): UiCopy {
  return TRANSLATIONS[code] ?? EN_COPY;
}