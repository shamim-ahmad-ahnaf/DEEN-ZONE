export interface HistoryEvent {
  id: number;
  title: string;
  type: 'Prophet' | 'Event' | 'Era';
  summary: string;
  content: string;
  image: string;
  period: string;
}

export const historyEvents: HistoryEvent[] = [
  {
    id: 1,
    title: "Prophet Muhammad (PBUH)",
    type: "Prophet",
    period: "570 - 632 CE",
    summary: "The final messenger of Allah, born in Mecca, who brought the message of Islam to humanity.",
    content: "Prophet Muhammad (PBUH) was born in the Year of the Elephant in Mecca. At the age of 40, he received the first revelation in the cave of Hira. His life was a testament to patience, character, and devotion to One God.",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"
  },
  {
    id: 2,
    title: "The Battle of Badr",
    type: "Event",
    period: "2 AH",
    summary: "A key military victory led by Prophet Muhammad (PBUH) that changed the course of Islamic history.",
    content: "The Battle of Badr was the first large-scale engagement between the Muslims and the Quraysh. Despite being outnumbered, the Muslims achieved a decisive victory, which strengthened the position of Islam in Medina.",
    image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800&q=80"
  },
  {
    id: 3,
    title: "The Golden Age of Islam",
    type: "Era",
    period: "8th - 14th Century",
    summary: "A period of cultural, economic, and scientific flourishing in the history of Islam.",
    content: "Centered in Baghdad, the House of Wisdom was a hub where scholars translated scientific and philosophical texts from Greek, Persian, and Indian sources, leading to major breakthroughs in mathematics, medicine, and astronomy.",
    image: "https://images.unsplash.com/photo-1523050853026-6a56885ca691?w=800&q=80"
  }
];
