export interface Book {
  id: number;
  title: string;
  author: string;
  category: 'Hadith' | 'Fiqh' | 'Aqeedah' | 'Seerah';
  cover: string;
  description: string;
}

export const books: Book[] = [
  {
    id: 1,
    title: "Sahih al-Bukhari",
    author: "Imam Bukhari",
    category: "Hadith",
    cover: "https://images.unsplash.com/photo-1544640805-3536c48795b6?w=400&q=80",
    description: "The most authentic collection of Hadith, compiled by Imam Muhammad al-Bukhari."
  },
  {
    id: 2,
    title: "Riyad as-Salihin",
    author: "Imam Nawawi",
    category: "Hadith",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80",
    description: "The Meadows of the Righteous, a compilation of verses from the Quran and hadith by Al-Nawawi."
  },
  {
    id: 3,
    title: "Al-Fiqh al-Akbar",
    author: "Imam Abu Hanifa",
    category: "Aqeedah",
    cover: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=400&q=80",
    description: "One of the earliest texts on Islamic theology (Aqeedah) written by the great Imam."
  },
  {
    id: 4,
    title: "Ar-Raheeq Al-Makhtum",
    author: "Safi-ur-Rahman",
    category: "Seerah",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    description: "The Sealed Nectar - a complete authoritative book on the life of Prophet Muhammad (PBUH)."
  },
  {
    id: 5,
    title: "Simplified Fiqh",
    author: "Sheikh Saleh Al-Fawzan",
    category: "Fiqh",
    cover: "https://images.unsplash.com/photo-1621351119117-41a4693a0a5a?w=400&q=80",
    description: "A clear and concise explanation of basic Islamic Jurisprudence according to the Quran and Sunnah."
  }
];
