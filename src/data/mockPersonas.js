// Mock Personas & Role Profiles for Seha Sports Platform
export const mockPersonas = {
  super_admin: {
    id: 'super_admin',
    role: 'super_admin',
    name: 'د. أحمد الشناوي',
    nameEn: 'Dr. Ahmed El-Shennawy',
    titleAr: 'مسؤول المنظومة الشامل',
    titleEn: 'Super Administrator',
    subBadgeAr: 'كافة الشاشات (صلاحيات كاملة)',
    subBadgeEn: 'All Screens (Full System)',
    email: 'admin@seha.gov.eg',
    phone: '01001234567',
    nationalId: '28004150102938',
    departmentAr: 'المؤسسة العلاجية · الإدارة المركزية للتحول الرقمي',
    departmentEn: 'Curative Organization · Central Digital Transformation',
    scopeDescriptionAr: 'صلاحيات كاملة للوصول إلى كافة شاشات ولوحات وبوابات المنظومة (11 شاشة)',
    scopeDescriptionEn: 'Full access to all system dashboards, clinical portals, and governance registries (11 screens)',
    allowedRoutes: 'all',
    avatarLetter: 'أ',
    defaultRoute: 'dash',
    defaultPassword: 'admin2026',
    featureTags: [
      { ar: 'لوحة المؤشرات', en: 'Dashboard' },
      { ar: 'موافقات الاطلاع', en: 'Consents' },
      { ar: 'سجل الشهادات', en: 'Certificates' },
      { ar: 'التحقق العام', en: 'Public Verify' },
      { ar: 'بوابات الأندية والمستشفيات', en: 'Portals' },
      { ar: 'التقارير والإدارة', en: 'Admin & Reports' }
    ]
  },
  citizen: {
    id: 'citizen',
    role: 'citizen',
    name: 'عمر خالد التميمي',
    nameEn: 'Omar Khaled Al-Tamimi',
    titleAr: 'المواطن والرياضي',
    titleEn: 'Citizen & Athlete',
    subBadgeAr: 'خدمات المواطن (4 شاشات)',
    subBadgeEn: 'Citizen Services (4 Screens)',
    email: 'citizen@seha.gov.eg',
    phone: '01099887766',
    nationalId: '30408150104829',
    clubAr: 'نادي النصر الرياضي · القاهرة',
    clubEn: 'Al-Nasr Sporting Club · Cairo',
    sportAr: 'كرة اليد (المستوى الثاني)',
    sportEn: 'Handball (Level 2)',
    scopeDescriptionAr: 'خدمات المواطن: الحجز الإلكتروني، الشهادات الطبية، وموافقات الاطلاع (4 شاشات فقط)',
    scopeDescriptionEn: 'Citizen services: e-Booking, medical certificates, and access consents (4 screens only)',
    allowedRoutes: ['citizen-home', 'citizen-bookings', 'citizen-certs', 'citizen-consents'],
    avatarLetter: 'ع',
    defaultRoute: 'citizen-home',
    defaultPassword: 'citizen2026',
    featureTags: [
      { ar: 'الرئيسية والملف الشخصي', en: 'Home & Profile' },
      { ar: 'حجز كشف طبي', en: 'Medical Booking' },
      { ar: 'الشهادات الطبية الموثقة', en: 'Verified Certs' },
      { ar: 'موافقات الاطلاع الرقمية', en: 'Access Consents' }
    ]
  }
};
