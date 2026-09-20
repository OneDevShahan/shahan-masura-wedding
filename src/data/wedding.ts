export type WeddingEvent = {
  name: string
  date: string
  time: string
  venue: string
  description: string
}

export type GalleryItem = {
  title: string
  gradient: string
  accent: string
}

export type WishMessage = {
  name: string
  text: string
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Events', href: '#events' },
  { label: 'Venue', href: '#venue' },
  { label: 'RSVP', href: '#rsvp' },
]

export const wedding = {
  bride: {
    name: 'Masura Farheen',
    father: 'Janab Maqsood Alam Sahab',
    address: 'Mohalla Chhajjapur Uttari, Tanda Ambedkar Nagar',
  },
  groom: {
    name: 'Shahan Ahmad',
    father: 'Late Haji Iftekhar Ahmad',
    address: 'Mohalla Chhajjapur Gakkha Sarai, Tanda Ambedkar Nagar',
    rsvp: 'Shadab Ahmad, Syed Shadab, Farzaan Ahmad, Sultan Ahmad, Mohd Salahuddin, All Relatives & Friends.',
    wbcf: 'Mrs Late Haji Iftekhar Ahmad',
    wbcfAddress: 'Mohalla Chhajjapur Gakkha Sarai, Tanda Ambedkar Nagar',
  },
  date: {
    gregorian: 'Saturday, 31 October 2026',
    secondDay: 'Sunday, 1 November 2026',
    hijri: 'Ramadan 1448 AH',
    iso: '2026-10-31T10:00:00+05:30',
    walimaIso: '2026-11-01T18:00:00+05:30',
  },
  venue: {
    name: 'S. M. Celebration',
    address: 'Haqqani Haat, Chhajjapur',
    city: 'Tanda Ambedkar Nagar',
    country: 'India',
    mapsUrl: 'https://maps.app.goo.gl/CrLiQU25K2PH1cib6',
    parking: 'Guest parking is available at the venue premises and surrounding areas.',
    dressCode: 'Traditional festive attire is warmly welcomed.',
  },
  events: [
    {
      name: 'Baraat',
      date: 'Saturday, 31 October 2026',
      time: '10:00 AM',
      venue: 'S. M. Celebration, Haqqani Haat, Chhajjapur, Tanda Ambedkar Nagar',
      description: 'A joyful baraat procession and celebration with family, relatives, and friends.',
    },
    {
      name: 'Return',
      date: 'Saturday, 31 October 2026',
      time: '4:00 PM',
      venue: 'Home & Family Gathering',
      description: 'The wedding procession returns home with blessings and family greetings.',
    },
    {
      name: 'Dawat-e-Walima',
      date: 'Sunday, 1 November 2026',
      time: '6:00 PM',
      venue: 'S. M. Celebration, Haqqani Haat, Chhajjapur, Tanda Ambedkar Nagar',
      description: 'An evening of warm hospitality, shared blessings, and a heartfelt celebration of love.',
    },
  ] as WeddingEvent[],
  quranVerse: {
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَوَدَّةً وَرَحْمَةً',
    translation:
      'And among His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.',
    reference: 'Qur’an 30:21',
  },
  music: {
    enabled: true,
    src: '/src/assets/ashaduallaha.mp3',
  },
  share: {
    message:
      'You are warmly invited to the wedding of Masura Farheen & Shahan Ahmad. We would be honoured to celebrate with you.',
  },
  gallery: [
    { title: 'A first glance', gradient: 'linear-gradient(135deg, #d8b46d 0%, #f4e1bd 100%)', accent: '#2d4d45' },
    { title: 'Our story', gradient: 'linear-gradient(135deg, #10362d 0%, #285a4d 100%)', accent: '#f2d9a4' },
    { title: 'Blessings', gradient: 'linear-gradient(135deg, #e7dbc6 0%, #caa86d 100%)', accent: '#12342f' },
    { title: 'Together', gradient: 'linear-gradient(135deg, #1d443a 0%, #678473 100%)', accent: '#f8ecdb' },
    { title: 'Joy', gradient: 'linear-gradient(135deg, #d0a66a 0%, #7a5f38 100%)', accent: '#f7e7cb' },
    { title: 'Love', gradient: 'linear-gradient(135deg, #153d36 0%, #d1b174 100%)', accent: '#f9f7ed' },
  ] as GalleryItem[],
}

export const initialWishes: WishMessage[] = [
  { name: 'Family & Friends', text: 'May Allah bless your marriage with love, mercy, peace, and barakah.' },
  { name: 'Well Wishers', text: 'Wishing you both a lifetime of happiness, faith, and beautiful memories together.' },
  { name: 'Loved Ones', text: 'May your home be filled with dua, warmth, and endless blessings from Allah.' },
]
