export interface Dua {
  id: number;
  title: string;
  arabic: string;
  translation: string;
  bangla: string;
  category: string;
}

export const duas: Dua[] = [
  {
    id: 1,
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ",
    translation: "In Your name, my Lord, I lie down and in Your name I rise.",
    bangla: "আপনার নামেই হে আমার রব! আমি আমার পার্শ্বদেশ শায়িত করলাম এবং আপনার নামেই তা পুনরায় উঠাব।",
    category: "Daily"
  },
  {
    id: 2,
    title: "Waking Up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translation: "Praise is to Allah who gave us life after He had caused us to die and to Him is the return.",
    bangla: "সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত (নিদ্রিত) করার পর জীবিত করেছেন। আর তাঁর দিকেই সকলের পুনরুত্থান।",
    category: "Daily"
  },
  {
    id: 3,
    title: "For Parents",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation: "My Lord, have mercy upon them as they brought me up [when I was] small.",
    bangla: "হে আমার রব! তাদের উভয়ের প্রতি দয়া করুন যেভাবে তারা আমাকে শৈশবে প্রতিপালন করেছিলেন।",
    category: "Family"
  }
];
