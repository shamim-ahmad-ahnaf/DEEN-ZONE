export interface Book {
  id: number;
  title: string;
  title_bn: string;
  author: string;
  author_bn: string;
  category: 'Quran' | 'Hadith' | 'Fiqh' | 'Aqeedah' | 'Seerah' | 'Other';
  cover: string;
  description: string;
  description_bn: string;
  pdfUrl: string;
}

export const books: Book[] = [
  {
    id: 1,
    title: "Sahih al-Bukhari",
    title_bn: "সহীহ আল-বুখারী",
    author: "Imam Bukhari",
    author_bn: "ইমাম বুখারী (রহ.)",
    category: "Hadith",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80",
    description: "The most authentic collection of Hadith, compiled by Imam Muhammad al-Bukhari.",
    description_bn: "সবচেয়ে বিশুদ্ধ হাদিস সংকলন যা প্রতিটি মুসলিমের কাছে থাকা আবশ্যক।",
    pdfUrl: "https://ia800701.us.archive.org/30/items/SahihAlBukhariEnglishArabic/Sahih_al-Bukhari_English_Arabic.pdf"
  },
  {
    id: 2,
    title: "The Sealed Nectar",
    title_bn: "আর-রাহীকুল মাখতূম",
    author: "Safi-ur-Rahman",
    author_bn: "সাফিউর রহমান মোবারকপুরী",
    category: "Seerah",
    cover: "https://images.unsplash.com/photo-1544640805-3536c48795b6?w=800&q=80",
    description: "A complete authoritative book on the life of Prophet Muhammad (PBUH).",
    description_bn: "বিশ্বনবী (সা.) এর শ্রেষ্ঠ সীরাত গ্রন্থ যা মক্কা সরকারের পুরস্কার বিজয়ী।",
    pdfUrl: "https://ia800702.us.archive.org/22/items/TheSealedNectar/TheSealedNectar.pdf"
  },
  {
    id: 3,
    title: "Al-Fiqh al-Akbar",
    title_bn: "আল-ফিকহ আল-আকবার",
    author: "Imam Abu Hanifa",
    author_bn: "ইমাম আবু হানিফা (রহ.)",
    category: "Aqeedah",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
    description: "One of the earliest and most fundamental texts on Islamic theology (Aqeedah).",
    description_bn: "ইসলামী আকীদার অন্যতম প্রাচীন ও নির্ভরযোগ্য গ্রন্থ যা ইমাম আযম নিজে লিখেছেন।",
    pdfUrl: "https://ia800305.us.archive.org/15/items/AlFiqhAlAkbar-English/AlFiqhAlAkbar-English.pdf"
  },
  {
    id: 4,
    title: "Riyad as-Salihin",
    title_bn: "রিয়াদুস সালেহীন",
    author: "Imam Nawawi",
    author_bn: "ইমাম নববী (রহ.)",
    category: "Hadith",
    cover: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=800&q=80",
    description: "The Meadows of the Righteous, a compilation of verses from the Quran and hadith.",
    description_bn: "কুরআন ও হাদিসের আলোকে আদর্শ জীবন গড়ার অন্যতম শ্রেষ্ঠ সহায়ক গ্রন্থ।",
    pdfUrl: "https://ia800305.us.archive.org/26/items/RiyadAsSalihinEnglish/RiyadAsSalihinEnglish.pdf"
  }
];
