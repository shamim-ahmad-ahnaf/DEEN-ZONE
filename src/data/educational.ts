export interface Article {
  id: number;
  title: string;
  title_bn: string;
  excerpt: string;
  excerpt_bn: string;
  content: string;
  content_bn: string;
  category: 'Spiritual' | 'Health' | 'Society' | 'Youth' | 'Knowledge';
  category_bn: string;
  author: string;
  author_bn: string;
  date: string;
  date_bn: string;
  image: string;
  reference_bn?: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "The Importance of Intentions in Daily Life",
    title_bn: "দৈনন্দিন জীবনে নিয়তের গুরুত্ব",
    excerpt: "Why starting every action with a pure heart matters in the sight of Allah...",
    excerpt_bn: "কেন আল্লাহর কাছে প্রতিটি কাজের শুরুতে পবিত্র হৃদয়ের নিয়ত করা গুরুত্বপূর্ণ...",
    content: "Islam teaches us that Allah looks at our hearts and intentions rather than just our physical actions. A simple mundane act like eating can become an act of worship if done with the intention to gain strength to worship Allah. The Prophet Muhammad (PBUH) said, 'Actions are but by intentions.' This means the reward of our deeds depends entirely on what we intended in our hearts. If we do something for show, there is no reward. But if we do it for Allah, even small acts are multiplied.",
    content_bn: "ইসলাম আমাদের শিক্ষা দেয় যে আল্লাহ আমাদের বাহ্যিক কাজের চেয়ে আমাদের অন্তর এবং নিয়তের দিকে বেশি তাকান। এমনকি খাওয়ার মতো একটি সাধারণ কাজও ইবাদতে পরিণত হতে পারে যদি তা আল্লাহর ইবাদতের শক্তি অর্জনের নিয়তে করা হয়। নবী মুহাম্মাদ (সা.) বলেছেন, 'নিশ্চয়ই আমল নিয়তের ওপর নির্ভরশীল।' এর অর্থ হলো আমাদের কাজের প্রতিদান সম্পূর্ণভাবে নির্ভর করে আমাদের অন্তরের নিয়তের ওপর। আমরা যদি লোকদেখানো কোনো কাজ করি, তবে তার কোনো প্রতিদান নেই। কিন্তু যদি আল্লাহর সন্তুষ্টির জন্য করি, তবে ছোট কাজও বহুগুণে বৃদ্ধি পায়।",
    category: "Spiritual",
    category_bn: "আধ্যাত্মিকতা",
    author: "Sheikh Abdullah",
    author_bn: "শেখ আবদুল্লাহ",
    date: "May 1, 2026",
    date_bn: "১ মে, ২০২৬",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80",
    reference_bn: "সহীহ বুখারী, হাদিস নং ১"
  },
  {
    id: 2,
    title: "Islamic Etiquette of Social Media",
    title_bn: "সোশ্যাল মিডিয়ায় ইসলামী আদব-কায়দা",
    excerpt: "How to maintain your character while navigating the digital world...",
    excerpt_bn: "ডিজিটাল জগতে চলার সময় কীভাবে আপনার চরিত্র বজায় রাখবেন...",
    content: "The principles of honesty, privacy, and kindness apply to the digital world just as much as the physical one. Spreading rumors or backbiting online bears the same weight as face-to-face. A Muslim should always verify information before sharing it, as the Quran states: 'O you who believe! If a wicked person comes to you with any news, verify it, lest you should harm people in ignorance.' Also, protecting others' privacy and avoiding unnecessary arguments are key Islamic manners online.",
    content_bn: "সততা, গোপনীয়তা এবং দয়ার নীতিগুলো ডিজিটাল জগতের ক্ষেত্রেও তেমনি প্রযোজ্য যেমনটি বাস্তব জগতের ক্ষেত্রে। অনলাইনে গুজব ছড়ানো বা গীবত করা সরাসরি সাক্ষাতে করার মতোই গুরুতর। একজন মুসলমানের উচিত কোনো তথ্য শেয়ার করার আগে তা যাচাই করা, কারণ কুরআন বলছে: 'হে মুমিনগণ! যদি কোনো পাপাচারী তোমাদের কাছে কোনো সংবাদ নিয়ে আসে, তবে তোমরা তা পরীক্ষা করে দেখবে, যাতে অজ্ঞতাবশত তোমরা কোনো সম্প্রদায়ের ক্ষতি না করে ফেল।' এছাড়া অন্যের গোপনীয়তা রক্ষা করা এবং অপ্রয়োজনীয় তর্কে লিপ্ত না হওয়া অনলাইনে ইসলামের মৌলিক আদব।",
    category: "Society",
    category_bn: "সমাজ",
    author: "Ustadha Fatima",
    author_bn: "উস্তাজা ফাতিমা",
    date: "April 28, 2026",
    date_bn: "২৮ এপ্রিল, ২০২৬",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    reference_bn: "সূরা হুজুরাত, আয়াত ৬"
  },
  {
    id: 3,
    title: "Sunnah Foods and Modern Science",
    title_bn: "সুন্নাহ খাবার ও আধুনিক বিজ্ঞান",
    excerpt: "Discover the nutritional benefits of dates, honey, and olive oil mentioned in the Sunnah...",
    excerpt_bn: "সুন্নাহতে বর্ণিত খেজুর, মধু এবং জলপাই তেলের পুষ্টিগুণ আবিষ্কার করুন...",
    content: "Modern nutritional science is increasingly proving the health benefits of foods that the Prophet Muhammad (PBUH) frequently consumed. Dates are excellent for energy and contain essential minerals. Honey has natural antibiotic properties and is a cure for many ailments, as mentioned in the Quran. Olive oil is rich in antioxidants and healthy fats, protecting the heart. Following these dietary habits not only improves physical health but also brings the spiritual reward of following the Sunnah.",
    content_bn: "আধুনিক পুষ্টিবিজ্ঞান নবী মুহাম্মাদ (সা.) যে খাবারগুলো নিয়মিত গ্রহণ করতেন সেগুলোর স্বাস্থ্যগত উপকারিতা ক্রমশ প্রমাণ করছে। খেজুর শক্তির জন্য চমৎকার এবং এতে প্রয়োজনীয় খনিজ উপাদান রয়েছে। মধুর রয়েছে প্রাকৃতিক অ্যান্টিবায়োটিক গুণ এবং এটি অনেক রোগের নিরাময়কারী, যা কুরআনেও উল্লেখ রয়েছে। জলপাই তেল অ্যান্টিঅক্সিডেন্ট এবং স্বাস্থ্যকর চর্বিতে সমৃদ্ধ, যা হৃদপিণ্ডকে রক্ষা করে। এই খাদ্যাভ্যাস অনুসরণ করলে কেবল শারীরিক স্বাস্থ্যেরই উন্নতি হয় না, বরং সুন্নাহ পালনের আধ্যাত্মিক সওয়াবও অর্জিত হয়।",
    category: "Health",
    category_bn: "স্বাস্থ্য",
    author: "Dr. Ahmed Mansour",
    author_bn: "ডা. আহমেদ মনসুর",
    date: "April 20, 2026",
    date_bn: "২০ এপ্রিল, ২০২৬",
    image: "https://images.unsplash.com/photo-1505253716362-afaba1d36b89?w=800&q=80",
    reference_bn: "সূরা আন-নাহল, আয়াত ৬৯"
  },
  {
    id: 4,
    title: "The Virtues of Seeking Knowledge",
    title_bn: "ইলম বা জ্ঞান অর্জনের ফজিলত",
    excerpt: "Understanding why learning is considered a compulsory act for every Muslim...",
    excerpt_bn: "কেন শিক্ষা গ্রহণ প্রত্যেক মুসলমানের জন্য ফরজ কাজ হিসেবে গণ্য করা হয়...",
    content: "The first word revealed to Prophet Muhammad (PBUH) was 'Read'. Seeking knowledge is a sacred journey in Islam. The Prophet (PBUH) said: 'Seeking knowledge is mandatory for every Muslim.' Knowledge helps us understand our Creator, fulfill our duties correctly, and benefit society. It is the legacy of the Prophets. A person who travels in search of knowledge, Allah makes his path to Paradise easy.",
    content_bn: "নবী মুহাম্মাদ (সা.)-এর ওপর অবতীর্ণ প্রথম শব্দ ছিল 'পড়ো'। জ্ঞান অন্বেষণ ইসলামে একটি পবিত্র সফর। নবী (সা.) বলেছেন: 'জ্ঞান অর্জন করা প্রত্যেক মুসলমানের ওপর ফরজ।' জ্ঞান আমাদের স্রষ্টাকে বুঝতে, আমাদের দায়িত্বগুলো সঠিকভাবে পালন করতে এবং সমাজের উপকার করতে সহায়তা করে। এটি স্বয়ং নবীদের উত্তরাধিকার। যে ব্যক্তি জ্ঞান অন্বেষণে পথ চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।",
    category: "Knowledge",
    category_bn: "ইলম/শিক্ষা",
    author: "Maulana Hasan",
    author_bn: "মাওলানা হাসান",
    date: "May 3, 2026",
    date_bn: "৩ মে, ২০২৬",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80",
    reference_bn: "সুনানে ইবনে মাজাহ, হাদিস নং ২২৪"
  },
  {
    id: 5,
    title: "Maintaining Ties of Kinship",
    title_bn: "আত্মীয়তার সম্পর্ক বজায় রাখা",
    excerpt: "The spiritual and social impact of staying connected with family...",
    excerpt_bn: "পরিবারের সাথে যুক্ত থাকার আধ্যাত্মিক ও সামাজিক প্রভাব...",
    content: "Islam places immense emphasis on 'Silat al-Rahm' or maintaining ties of kinship. This includes parents, siblings, relatives, and even extended family. The Prophet (PBUH) warned that one who breaks ties of kinship will not enter Paradise. Staying connected brings blessings in one's sustenance and lifespan. Even if relatives are difficult, a Muslim is encouraged to be kind and patient, as true connection is maintaining ties with those who cut you off.",
    content_bn: "ইসলাম 'সিলাতুর রাহিম' বা আত্মীয়তার সম্পর্ক বজায় রাখার ওপর ব্যাপক গুরুত্বারোপ করেছে। এর মধ্যে রয়েছে পিতা-মাতা, ভাই-বোন, আত্মীয়-স্বজন এমনকি বংশের অন্য পরিচিতজনরাও। নবী (সা.) সতর্ক করেছেন যে, আত্মীয়তার সম্পর্ক ছিন্নকারী জান্নাতে প্রবেশ করবে না। আত্মীয়দের সাথে সুসম্পর্ক রাখা রিযিকে বরকত এবং হায়াত বৃদ্ধিতে সহায়ক হয়। আত্মীয়রা যদি রূঢ়ও হয়, তবুও একজন মুসলমানকে সদয় ও ধৈর্যশীল হতে উৎসাহিত করা হয়েছে, কারণ প্রকৃত সম্পর্ক রক্ষা হলো তাদের সাথেও জুড়ে থাকা যারা তোমার সাথে সম্পর্ক ছিন্ন করে।",
    category: "Society",
    category_bn: "সমাজ",
    author: "Sheikh Yusuf",
    author_bn: "শেখ ইউসুফ",
    date: "May 4, 2026",
    date_bn: "৪ মে, ২০২৬",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    reference_bn: "সহীহ বুখারী, হাদিস নং ৫৯৮৪"
  }
];

export interface Masail {
  id: number;
  question: string;
  question_bn: string;
  answer: string;
  answer_bn: string;
  category: 'Taharah' | 'Salah' | 'Zakat' | 'Fasting';
  category_bn: string;
}

export const masails: Masail[] = [
  {
    id: 1,
    question: "Does bleeding from a wound break the Wudu?",
    question_bn: "ক্ষতস্থান থেকে রক্ত বের হলে কি ওযু ভেঙে যায়?",
    answer: "According to the Hanafi school, if blood flows from the wound, it breaks the Wudu. However, in the Shafi'i school, bleeding does not invalidate Wudu unless it comes from the private parts.",
    answer_bn: "হানাফী মাযহাব অনুযায়ী, ক্ষতস্থান থেকে যদি রক্ত গড়িয়ে পড়ে তবে ওযু ভেঙে যায়। তবে শাফেয়ী মাযহাব অনুযায়ী, বিশেষ অঙ্গ থেকে না বের হওয়া পর্যন্ত রক্তপাতে ওযু ভাঙে না।",
    category: "Taharah",
    category_bn: "পবিত্রতা"
  },
  {
    id: 2,
    question: "Is it permissible to pray while traveling in a moving vehicle?",
    question_bn: "চলন্ত যানবাহনে নামাজ পড়া কি জায়েজ?",
    answer: "If it's possible to stop, one should pray on solid ground. If not, and the prayer time is ending, one may pray sitting in the vehicle, attempting to face the Qibla if possible.",
    answer_bn: "যদি সম্ভব হয় তবে যানবাহন থামিয়ে মাটিতে নামাজ পড়া উচিত। যদি সম্ভব না হয় এবং নামাজের সময় শেষ হয়ে যায়, তবে যানবাহনে বসেই নামাজ পড়া যেতে পারে, সম্ভব হলে কিবলার দিকে মুখ করার চেষ্টা করতে হবে।",
    category: "Salah",
    category_bn: "নামাজ"
  },
  {
    id: 3,
    question: "Does using an inhaler break the fast?",
    question_bn: "ইনহেলার ব্যবহার করলে কি রোজা ভেঙে যায়?",
    answer: "There are differing opinions, but many contemporary scholars like those in the Permanent Committee (KSA) hold that using an asthma inhaler does not break the fast as it is a gas and does not reach the stomach like food or drink.",
    answer_bn: "এ বিষয়ে মতভেদ আছে, তবে অধিকাংশ সমসাময়িক আলেমদের মতে হাঁপানির ইনহেলার ব্যবহার করলে রোজা ভাঙে না, কারণ এটি এক ধরণের গ্যাস এবং এটি খাবার বা পানীয়র মতো পাকস্থলীতে পৌঁছায় না।",
    category: "Fasting",
    category_bn: "রোজা"
  }
];
