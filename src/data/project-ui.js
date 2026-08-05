const asset = (path) =>
  `${process.env.PUBLIC_URL}${path}`;

const projectsUI = [
  {
    id: 0,
    cover:  asset("/sprites/covers/fruitBox.png"),
    mainImage: asset("/sprites/mainImages/fruitBox.png"),
    carouselImages: [
      asset("/sprites/slidesImg/ui/fruitBox/1.png"),
      asset("/sprites/slidesImg/ui/fruitBox/2.png"),
      asset("/sprites/slidesImg/ui/fruitBox/3.png"),
      asset("/sprites/slidesImg/ui/fruitBox/4.png"),
      asset("/sprites/slidesImg/ui/fruitBox/5.png"),
      asset("/sprites/slidesImg/ui/fruitBox/6.png"),
      asset("/sprites/slidesImg/ui/fruitBox/7.png"),
      asset("/sprites/slidesImg/ui/fruitBox/8.png"),
      asset("/sprites/slidesImg/ui/fruitBox/9.png"),
      asset("/sprites/slidesImg/ui/fruitBox/10.png"),
    ],
    video: `<div style="position: relative; padding-top: 56.25%; width: 100%">
    <iframe src="https://kinescope.io/embed/4UbfXwP7t1EVuQ84AeDfth" allow="autoplay; 
    fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; 
    clipboard-write; screen-wake-lock;" frameborder="0" 
    allowfullscreen style="position: absolute; width: 100%; height: 100%; 
    top: 0; left: 0;"></iframe></div>`,
    title: {
      EN: "Fruit Box\nUI/UX for Fruit Delivery",
      UA: "Fruit Box\nUI/UX для доставки фруктів",
    },
    desc: {
      EN: "A responsive website with a vibrant design and user-friendly interface for quickly ordering fruit.",
      UA: "Адаптивний сайт з яскравим дизайном та зручним інтерфейсом для швидкого замовлення фруктів.",
    },
    textCreatSect: {
      EN: `Fruit Box — transforming the idea of exotic fruit delivery into a convenient digital service through a structured UI/UX design process.

It all started with audience research and conceptualization, where the main goal was to convey an atmosphere of freshness and premium quality. The brand's aesthetics formed the foundation of the visual language — the site's clean white space became a contrasting canvas for vibrant food photography, while delicate color accents helped guide the user's eye. During the information architecture phase, intuitive product selection logic was established. One of the key ideas was giving users flexible order management: instantly filtering the assortment by occasion or box size, and customizing set parameters in one click directly from the catalog or cart.

Special attention was paid to the final interaction stage — checkout. To reduce cart abandonment, the checkout interface was simplified to a single screen where an interactive map, address selection, and quick payment system integration work as one, minimizing cognitive load. Since mobile traffic is a priority for e-commerce, the entire project was built on a Mobile-First principle. Complex desktop grids and multi-level filters were transformed into thumb-friendly horizontal scrolls and adaptive touch elements. The result is a cohesive, conversion-focused ecosystem that smoothly guides Fruit Box customers from the first click to payment.`,
      UA: `Fruit Box — це перетворення ідеї доставки екзотичних фруктів у зручний цифровий сервіс, реалізований через структурований процес UI/UX‑дизайну.

Все почалося з дослідження аудиторії та концептуалізації, де головним завданням було передати атмосферу свіжості та преміальності. Естетика бренду лягла в основу візуальної мови, де чистий білий простір сайту став контрастним полотном для яскравих фуд-фотографій, а делікатні кольорові акценти допомогли розставити пріоритети для ока користувача. На етапі проєктування інформаційної архітектури було закладено інтуїтивну логіку вибору продукту. Однією з основних ідей було надання можливості гнучко керувати замовленням: миттєво фільтрувати асортимент за приводами чи розмірами коробок, а також кастомізувати параметри сету в один клік прямо з каталогу або кошика.

Особливу увагу було приділено фінальному етапу взаємодії — оформленню замовлення. Щоб знизити відсоток покинутих кошиків, інтерфейс чекауту було спрощено до одного екрана, де інтерактивна карта, вибір адреси та інтеграція швидких платіжних систем працюють як єдине ціле, зводячи когнітивне навантаження до мінімуму. Оскільки мобільний трафік є пріоритетним для e-commerce, весь проєкт створювався за принципом Mobile-First. Складні десктопні сітки та багаторівневі фільтри трансформувалися у зручні для пальців горизонтальні скроли та адаптивні тач-елементи. У результаті ми отримали цілісну, конверсійну екосистему, яка м'яко веде клієнта Fruit Box від першого кліку до моменту оплати.`,
    },
    textProdSect: {
      EN: `The project resulted in a responsive Fruit Box online store design with a clean, fresh UI and refined UX.

Thanks to the minimalist design, all attention is focused on vibrant products, and the user journey is simplified to a minimum. The project features an interface with order filtering by tags, a delivery page with a map, and a cart with quick payments — all for a simple and comfortable checkout experience.`,
      UA: `Результатом проєкту став адаптивний дизайн інтернет-магазину Fruit Box із чистим, свіжим UI та пропрацьованим UX.

Завдяки лаконічному дизайну вся увага фокусується на яскравих продуктах, а шлях користувача спрощено до мінімуму. У межах проєкту реалізовано інтерфейс із фільтрацією замовлень за тегами, сторінкою доставки з картою та кошиком зі швидкими платежами — усе для простого й комфортного оформлення покупки.`,
    },
    link: "uiux-design",
    webName: "fruit-delivery"
  },
  {
    id: 1,
    cover: asset("/sprites/covers/sushiBar.png"),
    mainImage: asset("/sprites/mainImages/sushiBar.png"),
    carouselImages: [
      asset("/sprites/slidesImg/ui/sushiBar/1.png"),
      asset("/sprites/slidesImg/ui/sushiBar/2.png"),
      asset("/sprites/slidesImg/ui/sushiBar/3.png"),
      asset("/sprites/slidesImg/ui/sushiBar/4.png"),
      asset("/sprites/slidesImg/ui/sushiBar/5.png"),
      asset("/sprites/slidesImg/ui/sushiBar/6.png"),
      asset("/sprites/slidesImg/ui/sushiBar/7.png"),
      asset("/sprites/slidesImg/ui/sushiBar/8.png"),
      asset("/sprites/slidesImg/ui/sushiBar/9.png"),
      asset("/sprites/slidesImg/ui/sushiBar/10.png"),
      asset("/sprites/slidesImg/ui/sushiBar/11.png"),
      asset("/sprites/slidesImg/ui/sushiBar/12.png"),
      asset("/sprites/slidesImg/ui/sushiBar/13.png"),
      asset("/sprites/slidesImg/ui/sushiBar/14.png"),
      asset("/sprites/slidesImg/ui/sushiBar/15.png"),
      asset("/sprites/slidesImg/ui/sushiBar/16.png"),
    ],
    video: `<div style="position: relative; padding-top: 56.25%; width: 100%"><iframe src="https://kinescope.io/embed/i1MxJZeHi5uR8i4NJZL67a" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;" frameborder="0" allowfullscreen style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"></iframe></div>`,
    title: {
      EN: "PinGo Sushi\nUI/UX for Sushi Delivery",
      UA: "PinGo Sushi\nUI/UX для доставки суші",
    },
    desc: {
      EN: "Minimalism meets culinary tradition — a stylish desktop prototype for a sushi bar platform.",
      UA: "Де мінімалізм перетинається з кулінарною традицією: стильний десктопний прототип платформи суші-бару.",
    },
    textCreatSect: {
      EN: `Pingo Sushi is a modern food ordering platform that combines the aesthetics of a Japanese restaurant with the speed of a digital service. The main goal of the project was to turn food selection into a fast and visually appealing process.

The visual concept is based on a premium dark theme with deep graphite tones referencing traditional Japanese interiors, and bright red accents on CTA elements to stimulate appetite. Navigation is realized through an interactive category slider, a "Top Sales" block with a countdown, and a full menu with a clear sidebar structure.

Special attention was paid to UX checkout optimization: thanks to a split screen, users simultaneously see their order composition, an integrated map, and payment methods. After payment, they immediately reach a page with a real-time delivery progress bar. To increase loyalty, a personal account was developed with a one-click reorder function and gamified limited-time gift cards.

Through deep work on the structure, we created a seamless interface that smoothly guides the customer from the first click to the satisfied wait for the courier.`,
      UA: `Pingo Sushi — це сучасна платформа для замовлення страв, яка поєднує естетику японського ресторану з високою швидкістю цифрового сервісу. Головною метою проєкту було перетворення вибору їжі на швидкий та візуально привабливий процес.

Основою візуального концепту стала преміальна темна тема з глибокими графітовими відтінками, що відсилають до традиційних японських інтер'єрів, та яскраво-червоними акцентами на CTA-елементах для стимуляції апетиту. Навігацію реалізували через інтерактивний слайдер категорій, блок «Top Sales» із лічильником акцій та повноцінне меню із чіткою сайдбар-структурою.

Особливу увагу приділили UX-оптимізації чекауту: завдяки розділеному екрану користувач одночасно бачить склад замовлення, інтегровану карту та платіжні методи, а після оплати одразу потрапляє на сторінку з прогрес-баром доставки в реальному часі. Для підвищення лояльності розробили особистий кабінет із функцією повтору замовлення в один клік та гейміфікованими gift-картками обмеженої дії.

У результаті глибокої роботи над структурою вдалося створити безшовний інтерфейс, який плавно веде клієнта від першого кліку до задоволеного очікування кур'єра.`,
    },
    textProdSect: {
      EN: `A stylish and conversion-focused web interface was developed for the sushi ordering platform, perfectly combining the authentic atmosphere of a premium venue with high functionality. The aesthetic UI design with deep dark tones, wood textures, and vivid dish photography stimulates appetite, while the refined UX with an intuitive side menu and promotional timers ensures easy navigation.

The created interface became an effective business tool that maximized simplicity and shortened the customer's path to purchase.`,
      UA: `Розроблено стильний та конверсійний веб-інтерфейс для платформи для замовлення суші, який ідеально поєднує автентичну атмосферу преміального закладу із високою функціональністю. Естетичний UI-дизайн із глибокими темними тонами, текстурами дерева та соковитими фотографіями страв збуджує апетит, а продуманий UX з інтуїтивним бічним меню та акційними таймерами забезпечує легку навігацію.

Створений інтерфейс став ефективним бізнес-інструментом, який максимально спростив та скоротив шлях клієнта до покупки.`,
    },
    link: "uiux-design",
    webName: "pingo-sushi-delivery"
  },
  {
    id: 2,
    cover: asset("/sprites/covers/coffeeBook.png"),
    mainImage: asset("/sprites/mainImages/coffeeBook.png"),
    carouselImages: [
      asset("/sprites/slidesImg/ui/coffeeBook/1.png"),
      asset("/sprites/slidesImg/ui/coffeeBook/2.png"),
      asset("/sprites/slidesImg/ui/coffeeBook/3.png"),
      asset("/sprites/slidesImg/ui/coffeeBook/4.png"),
      asset("/sprites/slidesImg/ui/coffeeBook/5.png"),
    ],
    video: `<div style="position: relative; padding-top: 56.25%; width: 100%">
    <iframe src="https://kinescope.io/embed/jPcgRRwVzmgUbbo7GvdMCE" allow="autoplay; fullscreen; 
    picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; 
    screen-wake-lock;" frameborder="0" allowfullscreen style="position: absolute; width: 100%; 
    height: 100%; top: 0; left: 0;"></iframe></div>`,
    title: {
      EN: "CoffeeBook\nLanding Page & Booking Platform",
      UA: "CoffeeBook\nЛендінг і платформа для бронювання",
    },
    desc: {
      EN: `"CoffeeBook" is a landing page and booking platform designed to make discovering and reserving cafés effortless.`,
      UA: `"CoffeeBook" — лендінг платформи, створений для швидкого пошуку та зручного бронювання кав'ярень.`,
    },
    textCreatSect: {
      EN: `CoffeeBook is an online platform that helps people discover and book cafés easily, quickly, and without stress. In a busy everyday life, people look for more than just good coffee — they want a comfortable place to work, meet friends, or simply relax, without long waits or uncertainty.

The platform connects cozy cafés with an easy booking experience, letting users browse and reserve a spot in just a few clicks.

This landing creates a seamless, enjoyable user journey. Users can filter cafés, explore them on an interactive map, and reserve a table in seconds.

UI/UX design transforms a simple booking service into a warm, welcoming, and engaging café experience.`,
      UA: `CoffeeBook — це онлайн-платформа, яка допомагає людям легко, швидко та без стресу знаходити та бронювати кав'ярні. У насиченому повсякденному житті люди шукають більше, ніж просто гарну каву — вони хочуть комфортне місце для роботи, зустрічей із друзями або відпочинку, без довгого очікування та невизначеності.

Платформа з'єднує затишні кав'ярні з простим досвідом бронювання, дозволяючи переглядати та резервувати місце буквально за кілька кліків.

Цей лендінг створює безперебійний, приємний шлях користувача. Можна фільтрувати кав'ярні, досліджувати їх на інтерактивній карті та бронювати столик за лічені секунди.

UI/UX-дизайн перетворює простий сервіс бронювання на тепле, привабливе та захоплюючий кавовий досвід.`,
    },
    textProdSect: {
      EN: `The project resulted in a responsive Coffee Book service with a cozy coffee UI and refined UX. Thanks to the stylish visual structure, quick filtering, and one-click booking directly from the venue card, the user journey became as simple as possible.

The project successfully combined atmospheric design and ergonomics, turning the search for a table into a quick and pleasant process on both desktop and smartphones.`,
      UA: `Результатом проєкту став адаптивний сервіс Coffee Book із затишним кавовим UI та вивіреним UX. Завдяки стильній візуальній структурі, швидкій фільтрації та бронюванню в один клік прямо з картки закладу, шлях користувача став максимально простим.

Проєкт успішно поєднав атмосферний дизайн та ергономічність, перетворивши пошук столика на швидкий і приємний процес як на десктопі, так і на смартфонах.`,
    },
    link: "uiux-design",
    webName: "coffee-book"
  },
  {
    id: 3,
    cover: asset("/sprites/covers/wonderland.png"),
    mainImage: asset("/sprites/mainImages/wonderland.png"),
    carouselImages: [
      asset("/sprites/slidesImg/ui/wonderland/1.png"),
      asset("/sprites/slidesImg/ui/wonderland/2.png"),
      asset("/sprites/slidesImg/ui/wonderland/3.png"),
      asset("/sprites/slidesImg/ui/wonderland/4.png"),
      asset("/sprites/slidesImg/ui/wonderland/5.png"),
    ],
    title: {
      EN: "Wonderland Tales\nDigital Reading App for Kids",
      UA: "Wonderland Tales\nЦифровий застосунок читання для дітей",
    },
    desc: {
      EN: "A bright and user-friendly design with a custom UI kit and original icons, created to make reading simple and engaging.",
      UA: "Яскравий і зручний дизайн із власним UI-кітом та оригінальними іконками, створений для простого та захоплюючого читання.",
    },
    textCreatSect: {
      EN: `The Wonderland Tales project is a mobile ecosystem of interactive children's books, created to immerse children in the reading and listening process through gamification. The main goal was to develop a seamless UX that combines high child engagement and flexible parental control.

The app's visual concept is built on a rich palette with an emphasis on natural greens and deep tones that create an immersive atmosphere. For convenient navigation, a multi-level filtering system was implemented, allowing parents to adapt content by age (3–5, 6–8, 9–12 years), genres, reading duration, and format. A concise bottom panel provides quick access to the app's main sections.

The reading and listening interface was designed with an emphasis on reducing cognitive load. Book cards have clear progress indicators and a quick mode selection ("Read" or "Listen"). The reader screen focuses on illustrations and large text, while audio controls and navigation appear only when needed. Users can create personal bookmarks and highlight text in real time without interrupting the process.

The retention strategy is implemented through customization and an achievement system in the personal account. Children see their progress on an interactive shelf of saved books and receive collectible sticker rewards. The profile editing interface offers a set of bright game avatars, and the system settings menu is placed in a separate block where sync, notifications, and screen behavior during reading can be flexibly managed.`,
      UA: `Проєкт Wonderland Tales — це мобільна екосистема інтерактивних дитячих книг, створена для занурення дитини в процес читання та прослуховування через гейміфікацію. Головна мета полягала в розробці безшовного UX, який поєднує високу залученість дитини та гнучкий батьківський контроль.

Візуальна концепція додатка побудована на насиченій палітрі з акцентом на природні зелені та глибокі відтінки, що створюють атмосферу занурення. Для зручності навігації реалізовано багаторівневу систему фільтрації, яка дозволяє батькам адаптувати контент за віком (3–5, 6–8, 9–12 років), жанрами, тривалістю читання та форматом. Лаконічна нижня панель забезпечує швидкий доступ до основних розділів додатка.

Інтерфейс для читання та прослуховування спроєктовано з акцентом на зниження когнітивного навантаження. Картки книг мають зрозумілі індикатори прогресу та швидкий вибір режиму («Read» або «Listen»). Екран читалки зосереджений на ілюстраціях і великому тексті, а елементи керування аудіо та навігація з'являються лише за потреби. Користувачі можуть створювати персональні закладки й виділяти текст у реальному часі без переривання процесу.

Стратегія утримання реалізована через кастомізацію та систему досягнень в особистому кабінеті. Дитина бачить свій прогрес на інтерактивній полиці збережених книг та отримує колекційні стікери-нагороди. Інтерфейс редагування профілю пропонує набір яскравих ігрових аватарів, а системне меню налаштувань винесено в окремий блок, де можна гнучко керувати синхронізацією, сповіщеннями та поведінкою екрана під час читання.`,
    },
    textProdSect: {
      EN: `As a result of developing the Wonderland Tales app, a vibrant and intuitive interface was created that perfectly combines a magical fairy-tale atmosphere with flawless UX/UI logic. Thanks to the refined user experience, a convenient book filtering system by age and format was implemented, along with flexible profile settings with avatar customization and an interactive achievement system that motivates children to read.`,
      UA: `У результаті розробки додатку Wonderland Tales створено яскравий та інтуїтивний інтерфейс, який ідеально поєднує магічну казкову атмосферу з бездоганною UX/UI-логікою. Завдяки продуманому користувацькому досвіду вдалося реалізувати зручну систему фільтрації книг за віком та форматом, гнучкі налаштування профілю з кастомізацією аватарів, а також інтерактивну систему досягнень, що мотивує дітей до читання.`,
    },
    textAnnt: {
      EN: "The visual style attracts with a harmonious palette, adaptive navigation panel, and emotional illustrations, while the reading screen functionality with an integrated audio player and smart bookmarks ensures maximum comfort while using the app.",
      UA: "Візуальний стиль приваблює гармонійною палітрою, адаптивною панеллю навігації та емоційними ілюстраціями, а функціонал екрана читання з інтегрованим аудіоплеєром та розумними закладками забезпечує максимальний комфорт під час користування додатком.",
    },
    link: "uiux-design",
    webName: "wonderland-tales"
  },
];

export default projectsUI;
