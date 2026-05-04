export interface Article {
  id: number;
  title: string;
  title_bn: string;
  excerpt: string;
  excerpt_bn: string;
  content: string;
  content_bn: string;
  category: 'Spiritual' | 'Health' | 'Society' | 'Youth';
  category_bn: string;
  author: string;
  author_bn: string;
  date: string;
  date_bn: string;
  image: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "The Importance of Intentions in Daily Life",
    title_bn: "দৈনন্দিন জীবনে নিয়তের গুরুত্ব",
    excerpt: "Why starting every action with a pure heart matters in the sight of Allah...",
    excerpt_bn: "কেন আল্লাহর কাছে প্রতিটি কাজের শুরুতে পবিত্র হৃদয়ের নিয়ত করা গুরুত্বপূর্ণ...",
    content: "Islam teaches us that Allah looks at our hearts and intentions rather than just our physical actions. A simple mundane act like eating can become an act of worship if done with the intention to gain strength to worship Allah...",
    content_bn: "ইসলাম আমাদের শিক্ষা দেয় যে আল্লাহ আমাদের বাহ্যিক কাজের চেয়ে আমাদের অন্তর এবং নিয়তের দিকে বেশি তাকান। এমনকি খাওয়ার মতো একটি সাধারণ কাজও ইবাদতে পরিণত হতে পারে যদি তা আল্লাহর ইবাদতের শক্তি অর্জনের নিয়তে করা হয়...",
    category: "Spiritual",
    category_bn: "আধ্যাত্মিকতা",
    author: "Sheikh Abdullah",
    author_bn: "শেখ আবদুল্লাহ",
    date: "May 1, 2026",
    date_bn: "১ মে, ২০২৬",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80"
  },
  {
    id: 2,
    title: "Islamic Etiquette of Social Media",
    title_bn: "সোশ্যাল মিডিয়ায় ইসলামী আদব-কায়দা",
    excerpt: "How to maintain your character while navigating the digital world...",
    excerpt_bn: "ডিজিটাল জগতে চলার সময় কীভাবে আপনার চরিত্র বজায় রাখবেন...",
    content: "The principles of honesty, privacy, and kindness apply to the digital world just as much as the physical one. Spreading rumors or backbiting online bears the same weight as face-to-face...",
    content_bn: "সততা, গোপনীয়তা এবং দয়ার নীতিগুলো ডিজিটাল জগতের ক্ষেত্রেও তেমনি প্রযোজ্য যেমনটি বাস্তব জগতের ক্ষেত্রে। অনলাইনে গুজব ছড়ানো বা গীবত করা সরাসরি সাক্ষাতে করার মতোই গুরুতর...",
    category: "Society",
    category_bn: "সমাজ",
    author: "Ustadha Fatima",
    author_bn: "উস্তাজা ফাতিমা",
    date: "April 28, 2026",
    date_bn: "২৮ এপ্রিল, ২০২৬",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
  },
  {
    id: 3,
    title: "Sunnah Foods and Modern Science",
    title_bn: "সুন্নাহ খাবার ও আধুনিক বিজ্ঞান",
    excerpt: "Discover the nutritional benefits of dates, honey, and olive oil mentioned in the Sunnah...",
    excerpt_bn: "সুন্নাহতে বর্ণিত খেজুর, মধু এবং জলপাই তেলের পুষ্টিগুণ আবিষ্কার করুন...",
    content: "Modern nutritional science is increasingly proving the health benefits of foods that the Prophet Muhammad (PBUH) frequently consumed. Dates are excellent for energy, while honey has natural antibiotic properties...",
    content_bn: "আধুনিক পুষ্টিবিজ্ঞান নবী মুহাম্মাদ (সা.) যে খাবারগুলো নিয়মিত গ্রহণ করতেন সেগুলোর স্বাস্থ্যগত উপকারিতা ক্রমশ প্রমাণ করছে। খেজুর শক্তির জন্য চমৎকার, আর মধুর রয়েছে প্রাকৃতিক অ্যান্টিবায়োটিক গুণ...",
    category: "Health",
    category_bn: "স্বাস্থ্য",
    author: "Dr. Ahmed Mansour",
    author_bn: "ডা. আহমেদ মনসুর",
    date: "April 20, 2026",
    date_bn: "২০ এপ্রিল, ২০২৬",
    image: "https://images.unsplash.com/photo-1505253716362-afaba1d36b89?w=800&q=80"
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
