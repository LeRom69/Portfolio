const asset = (path) =>
  `${process.env.PUBLIC_URL}${path}`;

const projectsGD = [
  {
    id: 0,
    cover:  asset("/sprites/covers/planetary.png"),
    mainImage:  asset("/sprites/mainImages/planetary.png"),
    carouselImages: [
       asset("/sprites/slidesImg/design/planetary/1.png"),
       asset("/sprites/slidesImg/design/planetary/2.png"),
       asset("/sprites/slidesImg/design/planetary/3.png"),
       asset("/sprites/slidesImg/design/planetary/4.png"),
       asset("/sprites/slidesImg/design/planetary/5.png"),
       asset("/sprites/slidesImg/design/planetary/6.png"),
       asset("/sprites/slidesImg/design/planetary/7.png"),
       asset("/sprites/slidesImg/design/planetary/8.png"),
    ],
    title: {
      EN: "Poster Series\nThe Unknown Universe: Planetary Archive",
      UA: "Серія постерів\nНевідомий Всесвіт: Планетарний Архів",
    },
    desc: {
      EN: `The Unknown Universe: Planetary Archive is a poster series featuring 8 planets from unexplored regions of space. Each poster showcases a unique world with its own environment, atmosphere, and visual identity — from luminous crystal landscapes to endless oceans and bioluminescent ecosystems. The project blends science-fiction-inspired aesthetics with artistic composition and visual storytelling, offering a journey through unknown worlds where imagination and design meet.`,
      UA: `The Unknown Universe: Planetary Archive — серія постерів із 8 планет із невідомих регіонів космосу. Кожен постер демонструє унікальний світ із власним середовищем, атмосферою та візуальною ідентичністю — від світних кристалічних ландшафтів до нескінченних океанів та біолюмінесцентних екосистем. Проєкт поєднує науково-фантастичну естетику з художньою композицією та візуальним сторітелінгом, пропонуючи подорож невідомими світами на перетині уяви та дизайну.`,
    },
    textCreatSect: {
      EN: `At the heart of the Unknown Universe Archive project lies the development of a series of science-fiction posters visualizing exoplanets within the Planetary Exploration Program. The main challenge was to create a scalable design system where each poster functions as a standalone art object and as part of a unified line.

Visual identification is based on a unique color palette and lighting approach for each location: from the icy neon depths of Aqua Prime and frozen expanses of Cryon to the magmatic landscape of Pyron and bioluminescent forests of Noctis. High contrast and light accents emphasize the authenticity and atmospheric features of each environment.

A key design decision was integrating massive display typography into the composition. Planet names rendered in extended geometric grotesque interact with space — letters overlap landscape elements, creating depth and a three-dimensional effect.

The information architecture was designed on the principle of archive cards. Top and bottom blocks contain a strict service structure (classification, atmosphere parameters, coordinates, and ecosystem description). This balances artistic expression, adding realism and a utilitarian look to the product.`,
      UA: `В основі проєкту Unknown Universe Archive лежить розробка серії науково-фантастичних плакатів, що візуалізують екзопланети в межах програми Planetary Exploration Program. Головне завдання полягало у створенні масштабованої дизайн-системи, де кожен плакат функціонує як самостійний арт-об'єкт та частина єдиної лінійки.

Візуальна ідентифікація базується на унікальному колориті й роботі зі світлом для кожної локації: від крижаних неонових глибин Aqua Prime та замерзлих просторів Cryon до магматичного ландшафту Pyron і біолюмінесцентних лісів Noctis. Високий контраст і світлові акценти підкреслюють автентичність та атмосферні особливості середовищ.

Ключовим дизайн-рішенням стала інтеграція масивної акцидентної типографіки в композицію. Назви планет, виконані у витягнутому геометричному гротеску, взаємодіють із простором — літери заходять за елементи пейзажу, що створює глибину та тривимірний ефект.

Інформаційну архітектуру спроєктовано за принципом архівних карток. Верхній та нижній блоки містять строгу службову структуру (класифікація, параметри атмосфери, координати та опис екосистеми). Це врівноважує художню експресію, додаючи продукту реалістичності та утилітарного вигляду.`,
    },
    textProdSect: {
      EN: `Successfully completed the creation of the "Unknown Universe Archive" conceptual graphic poster series dedicated to the exploration of fictional planets. Each of the 8 works has a unique visual identity reflecting the distinctiveness of each exoplanet. The project achieved a harmonious combination of detailed digital illustrations, atmospheric color palette, and modern futuristic typography. The final poster series is fully ready for presentation, printing, or use in media projects.`,
      UA: `Успішно завершено створення серії концептуальних графічних постерів «Unknown Universe Archive», присвячених дослідженню вигаданих планет. Кожна з 8 робіт має унікальну візуальну айдентику, що відображає унікальність кожної екзопланети. У проєкті вдалося досягти гармонійного поєднання деталізованих цифрових ілюстрацій, атмосферної кольорової гами та сучасної футуристичної типографіки. Фінальна серія постерів повністю готова до презентації, друку або використання в медіапроєктах.`,
    },
    textAnnt: {
      EN: `The project is available on <a href="#" class="typewriter"><span>B</span><span>e</span><span>h</span><span>a</span><span>n</span><span>c</span><span>e</span></a>`,
      UA: `З проектом можна ознайомитися на <a href="https://www.behance.net/gallery/246916413/Planetary-Poster-Series-Portfolio-Project" class="typewriter"><span>B</span><span>e</span><span>h</span><span>a</span><span>n</span><span>c</span><span>e</span></a>`,
    },
    link: "visual-design",
    webName: "planetary-archive"
  },
  {
    id: 1,
    cover:  asset("/sprites/covers/sugarFairy.png"),
    mainImage:  asset("/sprites/mainImages/sugarFairy.png"),
    carouselImages: [
       asset("/sprites/slidesImg/design/sugarFairy/1.png"),
       asset("/sprites/slidesImg/design/sugarFairy/2.png"),
       asset("/sprites/slidesImg/design/sugarFairy/3.png"),
       asset("/sprites/slidesImg/design/sugarFairy/4.png"),
       asset("/sprites/slidesImg/design/sugarFairy/5.png"),
       asset("/sprites/slidesImg/design/sugarFairy/6.png"),
    ],
    title: {
      EN: "SugarFairy\nSweet Brand Identity",
      UA: "SugarFairy\nАйдентика солодкого бренду",
    },
    desc: {
      EN: "SugarFairy is a bakery logo design inspired by a fairytale atmosphere. The identity is built on soft forms, elegant typography, and delicate pastel tones to reflect warmth, craftsmanship, and a magical, story-like character of the brand.",
      UA: "SugarFairy — дизайн логотипу пекарні, натхненний казковою атмосферою. Айдентика побудована на м'яких формах, елегантній типографіці та ніжних пастельних тонах, що відображають теплоту, майстерність і магічний характер бренду.",
    },
    textCreatSect: {
      EN: `At the heart of the Sugar Fairy project lies the development of a holistic visual identity for a premium confectionery. The main goal was to create a refined, magical, and commercially effective brand that clearly communicates product premiumness and is oriented toward the aesthetic perception of the audience.

The central element of the identity became a combined logo — the silhouette of a confectionery fairy in the shape of a lollipop with wings. Light lines convey the mastery and lightness of the desserts, while pastel pink and sky blue shades emphasize quality and exclusivity. It can exist in various color solutions and in a simplified version without fill and gradients. This makes it flexible and suitable for a wide range of products and styles — from fairytale to business — ensuring brand recognition in any context.

Within the project, a scalable corporate identity carrier system was created. Packaging design combines brand graphics with premium finishing techniques, enhancing the tactile and visual product experience. Business cards use a concise information grid with emphasis on the mark and compositional cleanliness. The identity was also adapted for small utilitarian carriers — toppers, ribbons, and tags — ensuring brand recognition at all stages of interaction. As a result, the concept of a fairytale confectionery space was transformed into a practical marketing tool with a high level of visual culture.`,
      UA: `В основі проєкту Sugar Fairy лежить розробка цілісної візуальної ідентичності для кондитерської преміум класу. Головне завдання полягало у створенні витонченого, магічного й водночас комерційно ефективного бренду, що чітко транслює преміальність продукту та орієнтований на естетичне сприйняття аудиторії.

Центральним елементом айдентики став комбінований логотип — силует кондитерської феї у формі льодяника з крилами. Легкі лінії передають майстерність і легкість десертів, а пастельно‑рожеві та небесно‑блакитні відтінки підкреслюють якість та ексклюзивність. Він може існувати у різних кольорових рішеннях та у спрощеній версії без заливки й градієнтів. Це робить його гнучким і придатним для застосування в широкому спектрі продуктів та стилістик — від казкової до ділової, забезпечуючи впізнаваність бренду в будь‑якому контексті.

У межах проєкту створено масштабовану систему носіїв фірмового стилю. Дизайн упаковки поєднує фірмову графіку з преміальними методами оздоблення, що підсилює тактильний та візуальний досвід продукту. Для візиток використано лаконічну інформаційну сітку з акцентом на знак та чистоту композиції. Айдентика адаптована й для дрібних утилітарних носіїв — топерів, стрічок та бірок, забезпечуючи впізнаваність бренду на всіх етапах взаємодії. У результаті концепція казкового кондитерського простору трансформувалася у практичний маркетинговий інструмент із високим рівнем візуальної культури.`,
    },
    textProdSect: {
      EN: `After completion, this project produced a unique logo and formed a pastel palette in pink-blue tones that precisely positions the brand in the sweets niche.`,
      UA: `Після завершення, в межах цього проєкту створено унікальний логотип, а також сформовано пастельну палітру у рожево-блакитних тонах, що точно позиціонує бренд у ніші солодощів.`,
    },
    textAnnt: {
      EN: `Print and branded packaging mockups were developed. The identity is fully ready for scaling and production implementation.`,
      UA: `Розроблено макети поліграфії та брендованого пакування. Айдентика повністю готова до масштабування та впровадження у виробництво.`,
    },
    link: "visual-design",
    webName: "sugar-fairy"
  },
  {
    id: 2,
    cover:  asset("/sprites/covers/pinGo.png"),
    mainImage:  asset("/sprites/mainImages/pingoSushi.png"),
    carouselImages: [
       asset("/sprites/slidesImg/design/pingoSushi/1.png"),
       asset("/sprites/slidesImg/design/pingoSushi/2.png"),
       asset("/sprites/slidesImg/design/pingoSushi/3.png"),
       asset("/sprites/slidesImg/design/pingoSushi/4.png"),
       asset("/sprites/slidesImg/design/pingoSushi/5.png"),
       asset("/sprites/slidesImg/design/pingoSushi/6.png"),
    ],
    title: {
      EN: "PinGo Sushi\nLogo & Mascot Design",
      UA: "PinGo Sushi\nДизайн логотипу та маскоту",
    },
    desc: {
      EN: "Logo and mascot design for a modern sushi bar, combining clean visuals with a playful character to create a memorable brand identity.",
      UA: "Дизайн логотипу та маскоту для сучасного суші-бару, що поєднує чисту візуальність із грайливим персонажем для створення запам'ятовуваної айдентики бренду.",
    },
    textCreatSect: {
      EN: `At the heart of the Pingo Sushi project lies the development of a holistic visual identity for a Japanese cuisine restaurant chain. The main design goal was to create a bold, dynamic brand that conveys delivery speed and effectively differentiates itself in the food retail market.

The central element of the identity became the brand mascot — Pingo the penguin. The logo combines precise line geometry with the playful character of the mascot. The color palette is based on deep black and contrasting bright red tones. This solution references traditional Japanese aesthetics while simultaneously serving as a strong visual marker that attracts attention and stimulates appetite.

Brand scaling was realized through a thoughtful packaging system. The design of eco-friendly cardboard boxes and paper bags with large-scale mascot placement improves the User Experience during unboxing.

The identity is seamlessly adapted for utilitarian carriers: from branded sushi serving boards to corporate business cards. The consistent use of the mascot and strict black-red palette creates a strong mental brand connection at every stage of user interaction with the product.`,
      UA: `В основі проєкту Pingo Sushi лежить розробка цілісної візуальної ідентичності для мережі ресторанів японської кухні. Головне завдання дизайну полягало в створенні сміливого, динамічного бренда, який транслює швидкість доставки та ефективно диференціюється на ринку фуд-ритейлу.

Центральним елементом айдентики став фірмовий маскот — пінгвін-Пінго. Логотип поєднує вивірену геометрію ліній із грайливим характером персонажа. Колірна палітра базується на глибокому чорному та контрастному яскраво-червоному відтінках. Таке рішення апелює до традиційної японської естетики й одночасно слугує сильним візуальним маркером, що привертає увагу та стимулює апетит.

Масштабування бренду реалізовано через продуману систему паковання. Дизайн екологічних картонних коробок та паперових пакетів і масштабне нанесення маскота, що покращує User Experience під час анбоксингу.

Айдентика безшовно адаптована під утилітарні носії: від брендованих дощечок для подачі суші до корпоративних візиток. Наскрізне використання маскота й суворої чорно-червоної гами формує стійкий ментальний зв'язок із брендом на кожному етапі взаємодії користувача з продуктом.`,
    },
    textProdSect: {
      EN: `The Pingo Sushi branding development successfully transformed the concept into a competitive product. The original mascot and contrasting black-red palette created a strong visual marker for digital channels and physical carriers. The unified design system of packaging, merchandise, and print materials became an example of consistent brand communication across all touchpoints. It increased company recognition and formed a cohesive customer experience.`,
      UA: `Розробка брендингу для Pingo Sushi успішно перетворила концепцію на конкурентний продукт. Авторський маскот і контрастна чорно-червона палітра створили сильний візуальний маркер для цифрових каналів та фізичних носіїв. Єдина дизайн-система пакування, мерчу та поліграфії стала прикладом наскрізної комунікації бренду на всіх точках контакту. Вона підвищила впізнаваність компанії та сформувала цілісний клієнтський досвід.`,
    },
    textAnnt: {
      EN: `In this case study, it is demonstrated how a cohesive visual strategy transforms an idea into an effective communication tool. The central element of the identity is the mascot — PinGo the penguin, which humanizes the brand and builds an emotional connection with the customer. The character successfully combines animal symbolism with Asian cuisine through key details — the narutomaki on its head and the sushi rolls nearby. The black-and-white graphics of the character harmonize with the brand's overall style, while color accents draw focus to the product, making the mascot versatile for packaging and digital platforms.`,
      UA: `У навчальному кейсі показано, як узгоджена візуальна стратегія перетворює ідею на ефективний інструмент комунікації. Центральним елементом айдентики є маскот — пінгвін PinGo, що олюднює бренд і формує емоційний зв’язок із клієнтом. Образ вдало поєднує тваринну символіку з азійською кулінарією завдяки деталям — нарутомакі на голові та ролам поруч. Чорно-біла графіка персонажа узгоджується зі стилістикою бренду, а кольорові акценти акцентують продукт, роблячи маскота універсальним для пакування та цифрових платформ.`,
    },
    link: "visual-design",
    webName: "pingo-sushi"
  },
];

export default projectsGD;
