export interface AudioItem {
  id: number;
  title: string;
  title_bn: string;
  artist: string;
  artist_bn: string;
  url: string;
  category: 'Quran' | 'Nasheed' | 'Bayan';
}

const surahNamesEn = [
  "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahinah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddatthir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const surahNamesBn = [
  "আল ফাতিহা", "আল বাকারাহ", "আল ইমরান", "আন নিসা", "আল মায়িদাহ", "আল আনআম", "আল আরাফ", "আল আনফাল", "আত তাওবাহ", "ইউনুস",
  "হুদ", "ইউসুফ", "আর রদ", "ইব্রাহিম", "আল হিজর", "আন নাহল", "আল ইসরা", "আল কাহফ", "মারইয়াম", "ত্বহা",
  "আল আম্বিয়া", "আল হাজ্জ", "আল মুমিনুন", "আন নূর", "আল ফুরকান", "আশ শুআরা", "আন নামল", "আল কাসাস", "আল আনকাবুত", "আর রুম",
  "লুকমান", "আস সাজদাহ", "আল আহজাব", "সাবা", "ফাতির", "ইয়াসিন", "আস সাফফাত", "সোয়াদ", "আজ জুমার", "গাফির",
  "ফুসসিলাত", "আশ শূরা", "আজ জুখরুফ", "আদ দুখান", "আল জাসিয়াহ", "আল আহকাফ", "মুহাম্মদ", "আল ফাতহ", "আল হুজুরাত", "ক্বাফ",
  "আয যারিয়াত", "আত তূর", "আন নাজম", "আল কামার", "আর রহমান", "আল ওয়াকিয়াহ", "আল হাদিদ", "আল মুজাদালাহ", "আল হাশর", "আল মুমতাহিনাহ",
  "আস সাফ", "আল জুমুআহ", "আল মুনাফিকুন", "আত তাগাবুন", "আত তালাক", "আত তাহরিম", "আল মুলক", "আল কলম", "আল হাক্কাহ", "আল মাআরিজ",
  "নূহ", "আল জিন", "আল মুয্যামমিল", "আল মুদদাসসির", "আল কিয়ামাহ", "আল ইনসান", "আল মুরসালাত", "আন নাবা", "আন নাজিআত", "আবাসা",
  "আত তাকবির", "আল ইনফিতার", "আল মুতাফফিফিন", "আল ইনশিকাক", "আল বুরুজ", "আত তারিক", "আল আ’লা", "আল গাশিয়াহ", "আল ফজর", "আল বালাদ",
  "আশ শামস", "আল লাইল", "আদ দুহা", "আশ শারহ", "আত তিন", "আল আলাক", "আল কদর", "আল বাইয়্যিনাহ", "আজ জালজালাহ", "আল আদিয়াত",
  "আল কারিয়াহ", "আত তাকাসুর", "আল আসর", "আল হুমাযাহ", "আল ফিল", "কুরাইশ", "আল মাউন", "আল কাউসার", "আল কাফিরুন", "আন নাসর",
  "আল মাসাদ", "আল ইখলাস", "আল ফালাক", "আন নাস"
];

const generatedQuran: AudioItem[] = surahNamesEn
  .map((name, index) => {
    const bnName = surahNamesBn[index];
    if (!name || !bnName) return null;
    return {
      id: index + 1,
      title: `Surah ${name}`,
      title_bn: `সূরা ${bnName}`,
      artist: "Mishary Rashid Alafasy",
      artist_bn: "মিশারি রাশিদ আল-আফাসি",
      url: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${index + 1}.mp3`,
      category: 'Quran'
    } as AudioItem;
  })
  .filter((item): item is AudioItem => item !== null);

const nasheeds: AudioItem[] = [
  {
    id: 1001,
    title: "Hasbi Rabbi",
    title_bn: "হাসবি রাব্বি",
    artist: "Sami Yusuf",
    artist_bn: "সামি ইউসুফ",
    url: "https://ia800305.us.archive.org/21/items/HasbiRabbi_201611/Hasbi%20Rabbi.mp3",
    category: 'Nasheed'
  },
  {
    id: 1002,
    title: "Ya Nabi Salam Alayka",
    title_bn: "ইয়া নবী সালাম আলাইকা",
    artist: "Maher Zain",
    artist_bn: "মাহের জাইন",
    url: "https://ia600508.us.archive.org/11/items/YaNabiSalamAlaykaVocalsOnly/Ya%20Nabi%20Salam%20Alayka.mp3",
    category: 'Nasheed'
  },
  {
    id: 1003,
    title: "O Moula",
    title_bn: "ও মাওলা (বাংলা নাশিদ)",
    artist: "Kalarab",
    artist_bn: "কলরব",
    url: "https://ia801509.us.archive.org/2/items/bangla-nasheed-collection/O%20Moula%20-%20Kalarab.mp3",
    category: 'Nasheed'
  },
  {
    id: 1004,
    title: "Mera Dil Badal De",
    title_bn: "মেরা দিল বদল দে (উর্দু নাশিদ)",
    artist: "Junaid Jamshed",
    artist_bn: "জুনায়েদ জামশেদ",
    url: "https://ia600405.us.archive.org/11/items/JunaidJamshed-MeraDilBadalDe/Junaid%20Jamshed%20-%20Mera%20Dil%20Badal%20De.mp3",
    category: 'Nasheed'
  }
];

const bayans: AudioItem[] = [
  {
    id: 2001,
    title: "Importance of Salah",
    title_bn: "নামাজের গুরুত্ব",
    artist: "Mizanur Rahman Azhari",
    artist_bn: "মিজানুর রহমান আজহারী",
    url: "https://ia804702.us.archive.org/27/items/azhari-bayans/Importance%20of%20Salah.mp3",
    category: 'Bayan'
  },
  {
    id: 2002,
    title: "Taqwa and Character",
    title_bn: "তাকওয়া ও চরিত্র",
    artist: "Maulana Tariq Jameel",
    artist_bn: "মাওলানা তারিক জামিল",
    url: "https://ia902506.us.archive.org/0/items/tariq-jameel-bayans/Taqwa%20and%20Character.mp3",
    category: 'Bayan'
  }
];

export const audioItems: AudioItem[] = [
  ...generatedQuran,
  ...nasheeds,
  ...bayans
];

export interface VideoItem {
  id: number;
  title: string;
  title_bn: string;
  speaker: string;
  speaker_bn: string;
  youtubeId?: string;
  videoUrl?: string;
  type: 'youtube' | 'direct' | 'external';
  category: 'Lecture' | 'Quran' | 'Kids' | 'Nasheed';
}

export const videoItems: VideoItem[] = [
  {
    id: 1,
    title: "The Purpose of Life",
    title_bn: "জীবনের উদ্দেশ্য",
    speaker: "Mufti Menk",
    speaker_bn: "মুফতি মেঙ্ক",
    youtubeId: "vSRNNoRE27M",
    type: 'youtube',
    category: "Lecture"
  },
  {
    id: 2,
    title: "Beautiful Quran Recitation",
    title_bn: "চমৎকার কুরআন তিলাওয়াত",
    speaker: "Omar Hisham",
    speaker_bn: "ওমর হিশাম",
    youtubeId: "Wp_K8PrH7g8",
    type: 'youtube',
    category: "Quran"
  },
  {
    id: 3,
    title: "Islamic Stories for Children",
    title_bn: "শিশুদের জন্য ইসলামিক গল্প",
    speaker: "Prophet Stories",
    speaker_bn: "নবীদের কাহিনী",
    youtubeId: "JmD8A-m_4tA",
    type: 'youtube',
    category: "Kids"
  },
  {
    id: 4,
    title: "Hasbi Rabbi Jallallah",
    title_bn: "হাসবি রাব্বি জাল্লাল্লাহ",
    speaker: "Sami Yusuf",
    speaker_bn: "সামি ইউসুফ",
    youtubeId: "vT_C1fK0qAc",
    type: 'youtube',
    category: "Nasheed"
  }
];
