export interface QAItem {
  id: number;
  question: string;
  answer: string;
  category: 'General' | 'Pillars' | 'History' | 'Character';
}

export const qaItems: QAItem[] = [
  {
    id: 1,
    question: "What are the five pillars of Islam?",
    answer: "The five pillars are: Shahada (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), and Hajj (Pilgrimage).",
    category: "Pillars"
  },
  {
    id: 2,
    question: "How should a Muslim treat their neighbors?",
    answer: "Islam emphasizes kindness and respect toward neighbors, regardless of their faith. The Prophet (PBUH) once said that Jibril (AS) advised him about neighbors so much that he thought they might inherit from him.",
    category: "Character"
  },
  {
    id: 3,
    question: "What is the meaning of the word 'Islam'?",
    answer: "Islam is derived from the Arabic root word 'SLM', which means peace, submission, and surrender to the will of Allah.",
    category: "General"
  }
];
