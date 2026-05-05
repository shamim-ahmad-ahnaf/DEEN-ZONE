export interface HistoryEvent {
  id: number;
  title: string;
  title_bn: string;
  type: 'Prophet' | 'Event' | 'Era' | 'Caliph';
  type_bn: string;
  summary: string;
  summary_bn: string;
  content: string;
  content_bn: string;
  image: string;
  period: string;
  period_bn: string;
}

export const historyEvents: HistoryEvent[] = [
  {
    id: 1,
    title: "Prophet Muhammad (PBUH)",
    title_bn: "রাসূলুল্লাহ (সা.)-এর জীবনী",
    type: "Prophet",
    type_bn: "নবী-রাসূল",
    period: "570 - 632 CE",
    period_bn: "৫৭০ - ৬৩২ খ্রিষ্টাব্দ",
    summary: "The final messenger of Allah, born in Mecca, who brought the message of Islam to humanity.",
    summary_bn: "আল্লাহর শেষ রাসূল, মক্কায় জন্মগ্রহণ করেন, যিনি মানবজাতির কাছে ইসলামের বাণী নিয়ে এসেছিলেন।",
    content: "Prophet Muhammad (PBUH) was born in the Year of the Elephant in Mecca. At the age of 40, he received the first revelation in the cave of Hira. His life was a testament to patience, character, and devotion to One God. He established the first Islamic state in Medina and demonstrated the perfect model of leadership and compassion.",
    content_bn: "মহানবী (সা.) মক্কায় হিব্রু বছরের হস্তীবর্ষে জন্মগ্রহণ করেন। ৪০ বছর বয়সে হেরা গুহায় তিনি প্রথম ওহী লাভ করেন। তাঁর জীবন ছিল ধৈর্য, চরিত্র এবং এক আল্লাহর প্রতি একনিষ্ঠতার এক জ্বলন্ত উদাহরণ। তিনি মদিনায় প্রথম ইসলামী রাষ্ট্র প্রতিষ্ঠা করেন এবং নেতৃত্ব ও দয়ার এক নিখুঁত আদর্শ প্রদর্শন করেন।",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"
  },
  {
    id: 2,
    title: "The Battle of Badr",
    title_bn: "বদর যুদ্ধ",
    type: "Event",
    type_bn: "ঐতিহাসিক ঘটনা",
    period: "2 AH",
    period_bn: "২ হিজরী",
    summary: "A key military victory led by Prophet Muhammad (PBUH) that changed the course of Islamic history.",
    summary_bn: "নবী মুহাম্মাদ (সা.)-এর নেতৃত্বে একটি গুরুত্বপূর্ণ সামরিক বিজয় যা ইসলামী ইতিহাসের মোড় ঘুরিয়ে দিয়েছিল।",
    content: "The Battle of Badr was the first large-scale engagement between the Muslims and the Quraysh. Despite being outnumbered (313 against 1000), the Muslims achieved a decisive victory, which strengthened the position of Islam in Medina and proved that truth prevails over numbers with Allah's help.",
    content_bn: "বদর যুদ্ধ ছিল মুসলমান ও কুরাইশদের মধ্যে প্রথম বড় ধরণের যুদ্ধ। সংখ্যায় অনেক কম হওয়া সত্ত্বেও (৩১৩ জন বনাম ১০০০ জন), মুসলমানরা এক চূড়ান্ত বিজয় অর্জন করে। এটি মদিনায় ইসলামের অবস্থানকে শক্তিশালী করে এবং প্রমাণ করে যে আল্লাহর সাহায্যে সত্য সংখ্যাধিক্যের ওপর বিজয়ী হয়।",
    image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800&q=80"
  },
  {
    id: 3,
    title: "The Conquest of Mecca",
    title_bn: "মক্কা বিজয়",
    type: "Event",
    type_bn: "ঐতিহাসিক ঘটনা",
    period: "8 AH",
    period_bn: "৮ হিজরী",
    summary: "A bloodless victory where the Prophet returned to his birthplace and cleared the Kaaba of idols.",
    summary_bn: "একটি রক্তপাতহীন বিজয় যেখানে নবীজী তাঁর জন্মভূমিতে ফিরে আসেন এবং কাবাঘরকে মূর্তিমুক্ত করেন।",
    content: "In 8 AH, Prophet Muhammad (PBUH) entered Mecca with ten thousand companions. He showed unprecedented mercy by forgiving his former enemies. He cleared the Kaaba of 360 idols, restoring it to the worship of Allah alone, as originally intended by Prophet Ibrahim (AS).",
    content_bn: "৮ হিজরীতে মহানবী (সা.) দশ হাজার সাহাবী নিয়ে মক্কায় প্রবেশ করেন। তিনি তাঁর প্রাক্তন শত্রুদের ক্ষমা করে দিয়ে নজিরবিহীন দয়া প্রদর্শন করেন। তিনি কাবাঘর থেকে ৩৬০টি মূর্তি অপসারণ করেন এবং এটিকে মহান আল্লাহর ইবাদতের জন্য পুনপ্রতিষ্ঠা করেন, যা মূলত হযরত ইব্রাহিম (আ.)-এর লক্ষ্য ছিল।",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80"
  },
  {
    id: 4,
    title: "Era of the Rashidun Caliphs",
    title_bn: "খুলাফায়ে রাশেদীনের যুগ",
    type: "Caliph",
    type_bn: "খিলাফত",
    period: "632 - 661 CE",
    period_bn: "৬৩২ - ৬৬১ খ্রিষ্টাব্দ",
    summary: "The reign of the four rightly guided caliphs: Abu Bakr, Umar, Uthman, and Ali.",
    summary_bn: "চার জন ন্যায়নিষ্ঠ খলিফার শাসনকাল: আবু বকর, উমর, উসমান এবং আলী (রা.)।",
    content: "The Rashidun era saw the rapid expansion of the Islamic empire and the establishment of justice based on Quranic principles. From Abu Bakr's stabilization to Umar's administrative brilliance, Uthman's compilation of the Quran, and Ali's wisdom, this era remains a golden standard for Islamic governance.",
    content_bn: "খুলাফায়ে রাশেদীনের আমলে ইসলামী সাম্রাজ্যের দ্রুত বিস্তার ঘটে এবং কুরআনী নীতির ভিত্তিতে ন্যায়বিচার প্রতিষ্ঠিত হয়। আবু বকর (রা.)-এর স্থিতিশীলতা রক্ষা থেকে শুরু করে উমর (রা.)-এর প্রশাসনিক দক্ষতা, উসমান (রা.)-এর সময় কুরআন সংকলন এবং আলী (রা.)-এর জ্ঞান—এই যুগটি ইসলামী শাসনের জন্য একটি আদর্শ মানদণ্ড হয়ে রয়েছে।",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80"
  },
  {
    id: 5,
    title: "The Golden Age of Islam",
    title_bn: "ইসলামের স্বর্ণযুগ",
    type: "Era",
    type_bn: "যুগ",
    period: "8th - 14th Century",
    period_bn: "৮ম - ১৪শ শতাব্দী",
    summary: "A period of cultural, economic, and scientific flourishing in the history of Islam.",
    summary_bn: "ইসলামের ইতিহাসে সাংস্কৃতিক, অর্থনৈতিক এবং বৈজ্ঞানিক সমৃদ্ধির এক অনন্য সময়।",
    content: "Centered in Baghdad, the House of Wisdom was a hub where scholars translated scientific and philosophical texts from Greek, Persian, and Indian sources. This led to major breakthroughs in mathematics (algebra), medicine (Ibn Sina), and astronomy, laying the foundation for the modern scientific revolution.",
    content_bn: "বাগদাদকে কেন্দ্র করে 'বায়তুল হিকমাহ' ছিল এমন এক কেন্দ্র যেখানে পণ্ডিতরা গ্রীক, পারস্য এবং ভারতীয় উৎস থেকে বৈজ্ঞানিক ও দার্শনিক পাঠ্য অনুবাদ করেছিলেন। এটি গণিত (বীজগণিত), চিকিৎসা (ইবনে সিনা) এবং জ্যোতির্বিদ্যায় প্রধান সাফল্যের পথ দেখায়, যা আধুনিক বৈজ্ঞানিক বিপ্লবের ভিত্তি স্থাপন করেছিল।",
    image: "https://images.unsplash.com/photo-1523050853026-6a56885ca691?w=800&q=80"
  }
];
