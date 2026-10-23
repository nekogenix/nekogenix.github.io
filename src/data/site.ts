export const locales = ['en', 'uk', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const languageNames = { en: 'English', uk: 'Українська', ru: 'Русский' };
export const repository = 'https://github.com/nekogenix/nekogenix-mod';
export const version = '1.0.0-prealpha.14';

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value);
}

export function pathFor(locale: Locale, page = '') {
  return `${locale === 'en' ? '/' : `/${locale}/`}${page ? `${page.replace(/^\/+|\/+$/g, '')}/` : ''}`;
}

export const copy = {
  en: {
    seoTitle: 'Discover Minecraft through a kitty’s eyes!',
    socialImageAlt: 'A ginger cat with armour and elytra in a Minecraft cave.',
    description:
      'Nekogenix brings detailed cat and neko gameplay to Minecraft, with feline abilities and custom skins while preserving vanilla items, armour and elytra.',
    nav: ['The mod', 'Abilities', 'Laboratory', 'Wiki'],
    get: 'Download Nekogenix',
    github: 'View on GitHub',
    wiki: 'Explore the wiki',
    menu: 'Open navigation',
    close: 'Close',
    language: 'Language',
    search: 'Search the wiki',
    searchHint: 'Transformation, recipes, skins…',
    noResults: 'No matching pages. Try another word.',
    searchHelp: 'Search titles and the full text of guides.',
    skip: 'Skip to content',
    back: 'Back to the mod',
    contents: 'On this page',
    previous: 'Previous',
    next: 'Next',
    groups: {
      start: 'Getting started',
      play: 'Abilities and appearance',
      reference: 'Settings and help',
    },
    wikiTitle: 'Nekogenix guides',
    wikiIntro:
      'Start with installation, then assemble a syringe and prepare your first injection. Each guide includes the ingredients and steps you need.',
    wikiEyebrow: 'THE NEKOGENIX WIKI',
    browse: 'Browse all guides',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    articles: 'guides',
    versionNote: 'Written for',
    source: 'Mod source',
    top: 'Back to top',
    recipe: 'Crafting',
    processing: 'Laboratory process',
    input: 'Ingredients',
    output: 'Result',
    returns: 'Returned',
    seconds: 'seconds',
    grid: 'Crafting grid',
    heroTag: '1.21.1 · NEOFORGE',
    heroTitle: 'Minecraft\nas a cat',
    heroText:
      'Nekogenix adds a gradual transformation with feline abilities, a kitty model and new animations, while preserving familiar armour, elytra and other game mechanics.',
    heroAlt:
      'Steve, Alex and a player in cat form on a village path beside a river in Minecraft with Nekogenix',
    scroll: 'About the mod',
    introTag: 'TRANSFORMATION',
    introTitle: 'From human to cat',
    introText:
      'A [Neko Injection](wiki/laboratory) starts the process. Your abilities appear gradually before your body takes its final form.',
    stages: [
      ['Human', 'Prepare the laboratory and take the injection.'],
      [
        'Neko',
        'Gain feline abilities. [Stop the transformation](wiki/transformation#stabilize) to keep this form.',
      ],
      [
        'Cat',
        'Complete the transformation into a cat with its own model and animations, and [manage your cat skins](#appearance).',
      ],
    ],
    abilityTag: 'MOVEMENT AND SENSES',
    abilityTitle: 'Feline abilities',
    abilities: [
      [
        'Double-jump',
        '[Jump again](wiki/abilities#agility) in mid-air. Sprinting and sneaking also become faster.',
        'agility',
      ],
      ['Feline Vision', 'Keep seeing even in complete darkness.', 'vision'],
      [
        'Soft Paws',
        '[Paw pads](wiki/abilities#paws) reduce fall damage and save you in critical situations.',
        'paws',
      ],
      [
        'Feline Scent',
        'As a cat, crouch for three seconds to [locate creatures](wiki/abilities#scent) through walls.',
        'scent',
      ],
    ],
    additionalAbilitiesLabel: 'More feline abilities',
    additionalAbilities: [
      [
        'Creepers fear you',
        '[Creepers](wiki/cat-life#creatures) keep their distance and no longer target you.',
      ],
      [
        'No phantoms',
        '[Phantoms](wiki/cat-life#creatures) no longer spawn because you have not slept.',
      ],
      [
        'Nine lives',
        'In Survival, [eight deaths](wiki/transformation#lives) preserve your neko or cat form. After the ninth, you become human again.',
      ],
      [
        'One-block passages',
        'In cat form, [walk and sprint](wiki/cat-life#movement) through spaces a human would have to crawl through.',
      ],
      [
        'A feline diet',
        '[Raw food](wiki/cat-life#food) is as filling as cooked food. Some of it no longer poisons you at all!',
      ],
      [
        'Other cats',
        '[Stray cats](wiki/cat-life#creatures) no longer run from you.',
      ],
    ],
    labTag: 'INGREDIENTS AND EQUIPMENT',
    labTitle: 'Laboratory',
    labIntro:
      'On your way to becoming a kitty, you’ll use all sorts of equipment, a whole super lab of your own!',
    labText: 'Choose an item to inspect it and see how it is used.',
    catTag: 'INVENTORY AND EQUIPMENT',
    catTitle: 'Playing as a cat',
    catText:
      'Use items, wear armour and fly with elytra. Your inventory stays with you. Cat form also changes [food and interactions with creatures](wiki/cat-life#food). Creepers and phantoms are no longer a problem!',
    skinTag: 'APPEARANCE',
    skinTitle: 'Cat skins',
    skinText:
      'Choose one of 11 Minecraft cat coats or [import a custom skin](wiki/cat-skins#file). The editor previews your cat in several poses.',
    downloadTitle: 'Download Nekogenix',
    downloadText:
      'The project is available on GitHub. Check the [installation instructions](wiki/getting-started) before adding it to your game.',
    downloadNote: 'CurseForge and Modrinth releases coming soon!',
    faqTitle: 'Common questions',
    faqs: [
      [
        'Can I play with friends?',
        'Yes. Install Nekogenix on the server and on every player’s client.',
      ],
      [
        'How long does transformation take?',
        'About 81 minutes, or 23 minutes with [paired injections](wiki/transformation#paired).',
      ],
      [
        'Can milk reverse the transformation?',
        'No. It can cause [poison or nausea](wiki/questions#milk).',
      ],
    ],
    credit: 'Made by Rudator & Wechirok.',
    assetCredits: 'Assets & licenses',
    footerText: 'Discover Minecraft through a kitty’s eyes!',
    notFound: 'Page not found',
    notFoundText: 'Check the address or return to the home page.',
    home: 'Return home',
    imageExpand: 'View full screenshot',
    imageClose: 'Close screenshot',
    videoPlay: 'Play video',
    videoPause: 'Pause video',
    videoExpand: 'Expand video',
    recipeLabels: {
      crafting: 'Crafting table',
      collecting: 'Collect a sample',
      tamedCat: 'Your tamed cat',
      fuel: 'Fuel',
      heat: 'Any heat source below the cauldron',
      brewingBatch: 'The stand brews one to three bottles at a time.',
      fullCauldron: 'Start with a full cauldron of water.',
    },
    videoDescriptions: {
      laboratory:
        'Crafting equipment and a Blank Nucleocard, brewing saliva and Sweet Amethyst, filling syringes, and becoming a cat. Game interface shown in English.',
      abilities:
        'Double-jump, feline vision, soft paws and feline scent in Minecraft with Nekogenix.',
      skins:
        'Importing a PNG cat skin and previewing it in the game. Interface shown in English.',
    },
  },
  uk: {
    seoTitle: 'Відкрий Minecraft очима котика!',
    socialImageAlt: 'Рудий котик у броні та з елітрами в печері Minecraft.',
    description:
      'Nekogenix додає продуманий ігролад за кота або неко з котячими здібностями й власними скінами, зберігаючи звичні предмети, броню та елітри Minecraft.',
    nav: ['Про мод', 'Здібності', 'Лабораторія', 'Вікі'],
    get: 'Завантажити Nekogenix',
    github: 'Переглянути на GitHub',
    wiki: 'Відкрити вікі',
    menu: 'Відкрити навігацію',
    close: 'Закрити',
    language: 'Мова',
    search: 'Пошук у вікі',
    searchHint: 'Перетворення, рецепти, скіни…',
    noResults: 'Сторінок не знайдено. Спробуйте інше слово.',
    searchHelp: 'Пошук у назвах і повному тексті посібників.',
    skip: 'До вмісту',
    back: 'Назад до мода',
    contents: 'На цій сторінці',
    previous: 'Попередня',
    next: 'Наступна',
    groups: {
      start: 'Початок гри',
      play: 'Здібності й зовнішність',
      reference: 'Налаштування й допомога',
    },
    wikiTitle: 'Посібники з Nekogenix',
    wikiIntro:
      'Почніть зі встановлення, потім зберіть шприц і приготуйте першу ін’єкцію. У кожному посібнику є потрібні складники та порядок дій.',
    wikiEyebrow: 'ВІКІ NEKOGENIX',
    browse: 'Усі посібники',
    theme: 'Тема',
    lightTheme: 'Світла',
    darkTheme: 'Темна',
    articles: 'посібників',
    versionNote: 'Для версії',
    source: 'Код мода',
    top: 'На початок',
    recipe: 'Виготовлення',
    processing: 'Лабораторний процес',
    input: 'Складники',
    output: 'Результат',
    returns: 'Повертається',
    seconds: 'секунд',
    grid: 'Сітка виготовлення',
    heroTag: '1.21.1 · NEOFORGE',
    heroTitle: 'Майнкрафт\nочима кота',
    heroText:
      'Nekogenix додає поступове перетворення з котячими здібностями, моделлю котика та новими анімаціями, зберігаючи звичну роботу з бронею, елітрами й іншими атрибутами гри.',
    heroAlt:
      'Стів, Алекс і гравець у формі кота на сільській стежці біля річки в Minecraft із Nekogenix',
    scroll: 'Про мод',
    introTag: 'ПЕРЕТВОРЕННЯ',
    introTitle: 'Від людини до кота',
    introText:
      '[Неко-ін’єкція](wiki/laboratory) запускає процес. Здібності з’являються поступово, перш ніж тіло набуде остаточної форми.',
    stages: [
      ['Людина', 'Підготуйте лабораторію та зробіть ін’єкцію.'],
      [
        'Неко',
        'Отримайте котячі здібності. [Зупиніть перетворення](wiki/transformation#stabilize), щоб зберегти цю форму.',
      ],
      [
        'Кіт',
        'Завершіть перетворення на кота з власною моделлю та анімаціями, [керуйте своїми котячими скінами](#appearance).',
      ],
    ],
    abilityTag: 'РУХ І ЧУТТЯ',
    abilityTitle: 'Котячі здібності',
    abilities: [
      [
        'Подвійний стрибок',
        '[Стрибайте вдруге](wiki/abilities#agility) у повітрі. Біг і рух навприсядки також стають швидшими.',
        'agility',
      ],
      [
        'Котячий зір',
        'Ви продовжуєте бачити навіть у цілковитій темряві.',
        'vision',
      ],
      [
        'М’які лапки',
        '[Подушечки лап](wiki/abilities#paws) зменшують шкоду від падіння та рятують вас у критичних ситуаціях.',
        'paws',
      ],
      [
        'Котячий нюх',
        'Ставши котом, присядьте на три секунди, щоб [знайти істот](wiki/abilities#scent) крізь стіни.',
        'scent',
      ],
    ],
    additionalAbilitiesLabel: 'Інші котячі здібності',
    additionalAbilities: [
      [
        'Крипери бояться вас',
        '[Крипери](wiki/cat-life#creatures) тримаються подалі й не обирають вас ціллю.',
      ],
      [
        'Без фантомів',
        '[Фантоми](wiki/cat-life#creatures) не з’являються через ваш недосип.',
      ],
      [
        'Дев’ять життів',
        'У виживанні [вісім смертей](wiki/transformation#lives) зберігають форму неко або кота. Після дев’ятої ви знову людина.',
      ],
      [
        'Проходи в один блок',
        'У формі кота [ходіть і бігайте](wiki/cat-life#movement) там, де людині доводиться повзти.',
      ],
      [
        'Котячий раціон',
        '[Сира їжа](wiki/cat-life#food) насичує вас так само, як приготована. А деяка взагалі більше не отруює!',
      ],
      ['Інші коти', '[Дикі коти](wiki/cat-life#creatures) не тікають від вас.'],
    ],
    labTag: 'СКЛАДНИКИ Й ОБЛАДНАННЯ',
    labTitle: 'Лабораторія',
    labIntro:
      'На твоєму шляху до перетворення на котика траплятимуться різні інструменти, у тебе буде ціла суперлаба!',
    labText:
      'Виберіть предмет, щоб роздивитися його й дізнатися, як його використовують.',
    catTag: 'ІНВЕНТАР І СПОРЯДЖЕННЯ',
    catTitle: 'Гра за кота',
    catText:
      'Користуйтеся предметами, носіть броню та літайте на елітрах. Інвентар залишається з вами. У котячій формі змінюються також [харчування та взаємодія з істотами](wiki/cat-life#food). Кріпери з фантомами тепер не проблема!',
    skinTag: 'ЗОВНІШНІСТЬ',
    skinTitle: 'Котячі скіни',
    skinText:
      'Виберіть одне з 11 забарвлень котів Minecraft або [імпортуйте власний скін](wiki/cat-skins#file). Редактор показує кота в кількох позах.',
    downloadTitle: 'Завантажити Nekogenix',
    downloadText:
      'Проєкт доступний на GitHub. Перед додаванням у гру перевірте [інструкцію зі встановлення](wiki/getting-started).',
    downloadNote: 'Релізи на CurseForge та Modrinth скоро!',
    faqTitle: 'Поширені запитання',
    faqs: [
      [
        'Можна грати з друзями?',
        'Так. Установіть Nekogenix на сервері й у клієнтах усіх гравців.',
      ],
      [
        'Скільки триває перетворення?',
        'Близько 81 хвилини або 23 хвилин із [парною ін’єкцією](wiki/transformation#paired).',
      ],
      [
        'Молоко скасовує перетворення?',
        'Ні. Воно може спричинити [отруєння або нудоту](wiki/questions#milk).',
      ],
    ],
    credit: 'Створили Rudator і Wechirok.',
    assetCredits: 'Матеріали й ліцензії',
    footerText: 'Відкрий для себе Minecraft очима котиків!',
    notFound: 'Сторінку не знайдено',
    notFoundText: 'Перевірте адресу або поверніться на головну.',
    home: 'На головну',
    imageExpand: 'Відкрити повний знімок',
    imageClose: 'Закрити знімок',
    videoPlay: 'Відтворити відео',
    videoPause: 'Призупинити відео',
    videoExpand: 'Розгорнути відео',
    recipeLabels: {
      crafting: 'Верстак',
      collecting: 'Збір зразка',
      tamedCat: 'Ваша приручена кішка',
      fuel: 'Паливо',
      heat: 'Будь-яке джерело тепла під казаном',
      brewingBatch:
        'За один цикл можна приготувати від однієї до трьох пляшечок.',
      fullCauldron: 'Перед початком повністю наповніть казан водою.',
    },
    videoDescriptions: {
      laboratory:
        'Створення обладнання й порожньої нуклеокарти, приготування слини та солодкого аметисту, наповнення шприців і перетворення на кота. Інтерфейс гри показано англійською.',
      abilities:
        'Подвійний стрибок, котячий зір, м’які лапки та котячий нюх у Minecraft із Nekogenix.',
      skins:
        'Імпорт котячого PNG-скіна та його перегляд у грі. Інтерфейс показано англійською.',
    },
  },
  ru: {
    seoTitle: 'Открой Minecraft глазами котика!',
    socialImageAlt: 'Рыжий котик в броне и с элитрами в пещере Minecraft.',
    description:
      'Nekogenix добавляет проработанный геймплей за кота или неко с кошачьими способностями и своими скинами, сохраняя привычные предметы, броню и элитры Minecraft.',
    nav: ['О моде', 'Способности', 'Лаборатория', 'Вики'],
    get: 'Скачать Nekogenix',
    github: 'Открыть на GitHub',
    wiki: 'Открыть вики',
    menu: 'Открыть навигацию',
    close: 'Закрыть',
    language: 'Язык',
    search: 'Поиск по вики',
    searchHint: 'Превращение, рецепты, скины…',
    noResults: 'Страницы не найдены. Попробуйте другое слово.',
    searchHelp: 'Поиск по названиям и полному тексту руководств.',
    skip: 'К содержимому',
    back: 'Назад к моду',
    contents: 'На этой странице',
    previous: 'Предыдущая',
    next: 'Следующая',
    groups: {
      start: 'Начало игры',
      play: 'Способности и внешность',
      reference: 'Настройки и помощь',
    },
    wikiTitle: 'Руководства по Nekogenix',
    wikiIntro:
      'Начните с установки, затем соберите шприц и приготовьте первую инъекцию. В каждом руководстве есть нужные ингредиенты и порядок действий.',
    wikiEyebrow: 'ВИКИ NEKOGENIX',
    browse: 'Все руководства',
    theme: 'Тема',
    lightTheme: 'Светлая',
    darkTheme: 'Тёмная',
    articles: 'руководств',
    versionNote: 'Для версии',
    source: 'Код мода',
    top: 'Наверх',
    recipe: 'Создание',
    processing: 'Лабораторный процесс',
    input: 'Ингредиенты',
    output: 'Результат',
    returns: 'Возвращается',
    seconds: 'секунд',
    grid: 'Сетка создания',
    heroTag: '1.21.1 · NEOFORGE',
    heroTitle: 'Майнкрафт\nот лица кота',
    heroText:
      'Nekogenix добавляет постепенное превращение с кошачьими способностями, моделью котика и новыми анимациями, сохраняя привычную работу с броней, элитрами и прочими атрибутами игры.',
    heroAlt:
      'Стив, Алекс и игрок в форме кота на деревенской тропе у реки в Minecraft с Nekogenix',
    scroll: 'О моде',
    introTag: 'ПРЕВРАЩЕНИЕ',
    introTitle: 'От человека к коту',
    introText:
      '[Неко-инъекция](wiki/laboratory) запускает процесс. Способности появляются постепенно, прежде чем тело примет окончательную форму.',
    stages: [
      ['Человек', 'Подготовьте лабораторию и сделайте инъекцию.'],
      [
        'Неко',
        'Получите кошачьи способности. [Остановите превращение](wiki/transformation#stabilize), чтобы сохранить эту форму.',
      ],
      [
        'Кот',
        'Завершите превращение в кота с собственной моделью и анимациями, [управляйте своими кошачьими скинами](#appearance).',
      ],
    ],
    abilityTag: 'ДВИЖЕНИЕ И ЧУВСТВА',
    abilityTitle: 'Кошачьи способности',
    abilities: [
      [
        'Двойной прыжок',
        '[Прыгайте второй раз](wiki/abilities#agility) в воздухе. Бег и передвижение на корточках тоже становятся быстрее.',
        'agility',
      ],
      [
        'Кошачье зрение',
        'Вы продолжаете видеть даже в кромешной тьме.',
        'vision',
      ],
      [
        'Мягкие лапки',
        '[Подушечки лап](wiki/abilities#paws) уменьшают урон от падения и спасают вас в критических ситуациях.',
        'paws',
      ],
      [
        'Кошачий нюх',
        'Став котом, присядьте на три секунды, чтобы [найти существ](wiki/abilities#scent) сквозь стены.',
        'scent',
      ],
    ],
    additionalAbilitiesLabel: 'Другие кошачьи способности',
    additionalAbilities: [
      [
        'Криперы боятся вас',
        '[Криперы](wiki/cat-life#creatures) держатся подальше и не выбирают вас целью.',
      ],
      [
        'Без фантомов',
        '[Фантомы](wiki/cat-life#creatures) не появляются из-за вашего недосыпа.',
      ],
      [
        'Девять жизней',
        'В выживании [восемь смертей](wiki/transformation#lives) сохраняют форму неко или кота. После девятой вы снова человек.',
      ],
      [
        'Проходы в один блок',
        'В форме кота [проходите и бегайте](wiki/cat-life#movement) там, где человеку приходится ползти.',
      ],
      [
        'Кошачий рацион',
        '[Сырая еда](wiki/cat-life#food) насыщает вас как приготовленная. А некоторая вообще перестала отравлять!',
      ],
      [
        'Другие коты',
        '[Дикие коты](wiki/cat-life#creatures) не убегают от вас.',
      ],
    ],
    labTag: 'ИНГРЕДИЕНТЫ И ОБОРУДОВАНИЕ',
    labTitle: 'Лаборатория',
    labIntro:
      'На твоем пути к становлению котика будут встречаться разный инструментарий, у тебя будет целая супер лаба!',
    labText:
      'Выберите предмет, чтобы рассмотреть его и узнать, как он используется.',
    catTag: 'ИНВЕНТАРЬ И СНАРЯЖЕНИЕ',
    catTitle: 'Игра за кота',
    catText:
      'Пользуйтесь предметами, носите броню и летайте на элитрах. Инвентарь остаётся с вами. В кошачьей форме меняются также [питание и взаимодействие с существами](wiki/cat-life#food). Криперы с фантомами теперь не проблема!',
    skinTag: 'ВНЕШНОСТЬ',
    skinTitle: 'Кошачьи скины',
    skinText:
      'Выберите одну из 11 расцветок котов Minecraft или [импортируйте собственный скин](wiki/cat-skins#file). Редактор показывает кота в нескольких позах.',
    downloadTitle: 'Скачать Nekogenix',
    downloadText:
      'Проект доступен на GitHub. Перед добавлением в игру проверьте [инструкцию по установке](wiki/getting-started).',
    downloadNote: 'CurseForge и Modrinth релизы скоро!',
    faqTitle: 'Частые вопросы',
    faqs: [
      [
        'Можно играть с друзьями?',
        'Да. Установите Nekogenix на сервер и в клиенты всех игроков.',
      ],
      [
        'Сколько длится превращение?',
        'Около 81 минуты или 23 минут с [парной инъекцией](wiki/transformation#paired).',
      ],
      [
        'Молоко отменяет превращение?',
        'Нет. Оно может вызвать [отравление или тошноту](wiki/questions#milk).',
      ],
    ],
    credit: 'Создали Rudator и Wechirok.',
    assetCredits: 'Материалы и лицензии',
    footerText: 'Открой для себя Minecraft от лица котиков!',
    notFound: 'Страница не найдена',
    notFoundText: 'Проверьте адрес или вернитесь на главную.',
    home: 'На главную',
    imageExpand: 'Открыть полный снимок',
    imageClose: 'Закрыть снимок',
    videoPlay: 'Воспроизвести видео',
    videoPause: 'Приостановить видео',
    videoExpand: 'Развернуть видео',
    recipeLabels: {
      crafting: 'Верстак',
      collecting: 'Сбор образца',
      tamedCat: 'Ваша приручённая кошка',
      fuel: 'Топливо',
      heat: 'Любой источник тепла под котлом',
      brewingBatch:
        'За один цикл можно приготовить от одной до трёх бутылочек.',
      fullCauldron: 'Перед началом полностью наполните котёл водой.',
    },
    videoDescriptions: {
      laboratory:
        'Создание оборудования и пустой нуклеокарты, приготовление слюны и сладкого аметиста, наполнение шприцев и превращение в кота. Интерфейс игры показан на английском.',
      abilities:
        'Двойной прыжок, кошачье зрение, мягкие лапки и кошачий нюх в Minecraft с Nekogenix.',
      skins:
        'Импорт кошачьего PNG-скина и его просмотр в игре. Интерфейс показан на английском.',
    },
  },
} as const;
