// Service categories for providers

export const SERVICE_CATEGORIES = [
  {
    id: 'cleaning',
    name: 'Tozalash xizmatlari',
    nameEn: 'Cleaning Services',
    icon: '🧹',
    subcategories: [
      { id: 'general', name: 'Umumiy tozalash' },
      { id: 'deep', name: 'Chuqur tozalash' },
      { id: 'window', name: 'Deraza yuvish' },
      { id: 'carpet', name: 'Gilam tozalash' },
      { id: 'garden', name: 'Bog\' tozalash' },
    ],
  },
  {
    id: 'plumbing',
    name: 'Santexnika',
    nameEn: 'Plumbing',
    icon: '🔧',
    subcategories: [
      { id: 'repair', name: 'Ta\'mirlash' },
      { id: 'installation', name: 'O\'rnatish' },
      { id: 'emergency', name: 'Tez yordam' },
      { id: 'drain', name: 'Kanalizatsiya tozalash' },
    ],
  },
  {
    id: 'electrical',
    name: 'Elektr xizmatlari',
    nameEn: 'Electrical Services',
    icon: '⚡',
    subcategories: [
      { id: 'wiring', name: 'Simlar o\'tkazish' },
      { id: 'repair', name: 'Ta\'mirlash' },
      { id: 'installation', name: 'Asboblar o\'rnatish' },
      { id: 'lighting', name: 'Yoritish' },
    ],
  },
  {
    id: 'carpentry',
    name: 'Duradgorlik',
    nameEn: 'Carpentry',
    icon: '🪚',
    subcategories: [
      { id: 'furniture', name: 'Mebel yasash' },
      { id: 'repair', name: 'Ta\'mirlash' },
      { id: 'installation', name: 'O\'rnatish' },
      { id: 'custom', name: 'Maxsus buyurtma' },
    ],
  },
  {
    id: 'painting',
    name: 'Bo\'yoqchilik',
    nameEn: 'Painting',
    icon: '🎨',
    subcategories: [
      { id: 'interior', name: 'Ichki bo\'yash' },
      { id: 'exterior', name: 'Tashqi bo\'yash' },
      { id: 'wallpaper', name: 'Devor qog\'ozi' },
      { id: 'decorative', name: 'Dekorativ' },
    ],
  },
  {
    id: 'moving',
    name: 'Ko\'chish xizmati',
    nameEn: 'Moving Services',
    icon: '📦',
    subcategories: [
      { id: 'packing', name: 'Yig\'ishtirish' },
      { id: 'loading', name: 'Yuklash' },
      { id: 'transport', name: 'Tashish' },
      { id: 'unpacking', name: 'Joylashtirish' },
    ],
  },
  {
    id: 'appliance',
    name: 'Texnika ta\'mirlash',
    nameEn: 'Appliance Repair',
    icon: '🔌',
    subcategories: [
      { id: 'refrigerator', name: 'Muzlatgich' },
      { id: 'washing', name: 'Kir yuvish mashinasi' },
      { id: 'ac', name: 'Konditsioner' },
      { id: 'other', name: 'Boshqa texnika' },
    ],
  },
  {
    id: 'gardening',
    name: 'Bog\'dorchilik',
    nameEn: 'Gardening',
    icon: '🌱',
    subcategories: [
      { id: 'maintenance', name: 'Parvarish qilish' },
      { id: 'landscaping', name: 'Landshaft dizayn' },
      { id: 'tree', name: 'Daraxt kesish' },
      { id: 'lawn', name: 'Maysazor' },
    ],
  },
];

export const LANGUAGES = [
  { id: 'uz', name: 'O\'zbek tili', icon: '🇺🇿' },
  { id: 'ru', name: 'Rus tili', icon: '🇷🇺' },
  { id: 'en', name: 'Ingliz tili', icon: '🇬🇧' },
];

export const BANKS = [
  { id: 'nbu', name: 'Markaziy Bank' },
  { id: 'hamkorbank', name: 'Hamkorbank' },
  { id: 'asaka', name: 'Asaka Bank' },
  { id: 'uzpromstroy', name: 'Uzpromstroybank' },
  { id: 'ipoteka', name: 'Ipoteka Bank' },
  { id: 'agrobank', name: 'Agrobank' },
  { id: 'aloqabank', name: 'Aloqabank' },
  { id: 'other', name: 'Boshqa' },
];

export const DISTRICTS_TASHKENT = [
  { id: 'chilonzor', name: 'Chilonzor tumani' },
  { id: 'shayhontohur', name: 'Shayhontohur tumani' },
  { id: 'uchtepa', name: 'Uchtepa tumani' },
  { id: 'yunusabad', name: 'Yunusabad tumani' },
  { id: 'mirobod', name: 'Mirobod tumani' },
  { id: 'sergeli', name: 'Sergeli tumani' },
  { id: 'yakkasaroy', name: 'Yakkasaroy tumani' },
  { id: 'yashnobod', name: 'Yashnobod tumani' },
  { id: 'mirzo_ulugbek', name: 'Mirzo Ulug\'bek tumani' },
  { id: 'bektemir', name: 'Bektemir tumani' },
  { id: 'olmazor', name: 'Olmazor tumani' },
];

export default {
  SERVICE_CATEGORIES,
  LANGUAGES,
  BANKS,
  DISTRICTS_TASHKENT,
};
