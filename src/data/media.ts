export interface AudioItem {
  id: number;
  title: string;
  reciter: string;
  url: string;
  duration: string;
}

export const audioItems: AudioItem[] = [
  {
    id: 1,
    title: "Surah Al-Fatihah",
    reciter: "Mishary Rashid Alafasy",
    url: "https://server8.mp3quran.net/afs/001.mp3",
    duration: "0:50"
  },
  {
    id: 2,
    title: "Surah Al-Kahf (Selection)",
    reciter: "Saud Al-Shuraim",
    url: "https://server7.mp3quran.net/shur/018.mp3",
    duration: "25:40"
  },
  {
    id: 3,
    title: "Morning Adhkar",
    reciter: "Saad Al-Ghamdi",
    url: "https://server7.mp3quran.net/s_gmd/001.mp3",
    duration: "10:15"
  }
];

export interface VideoItem {
  id: number;
  title: string;
  speaker: string;
  youtubeId: string;
  category: 'Lecture' | 'Quran' | 'Kids';
}

export const videoItems: VideoItem[] = [
  {
    id: 1,
    title: "The Purpose of Life",
    speaker: "Mufti Menk",
    youtubeId: "vSRNNoRE27M",
    category: "Lecture"
  },
  {
    id: 2,
    title: "Beautiful Quran Recitation",
    speaker: "Omar Hisham",
    youtubeId: "Wp_K8PrH7g8",
    category: "Quran"
  },
  {
    id: 3,
    title: "Islamic Stories for Children",
    speaker: "Prophet Stories",
    youtubeId: "JmD8A-m_4tA",
    category: "Kids"
  }
];
