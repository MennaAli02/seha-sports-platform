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
  athlete: {
    id: 'athlete',
    role: 'athlete',
    name: 'أحمد يوسف السيد',
    nameEn: 'Ahmad Youssef El-Sayed',
    titleAr: 'الرياضي (حساب فردي)',
    titleEn: 'Athlete (Individual Account)',
    subBadgeAr: 'الملف الطبي للرياضي',
    subBadgeEn: 'Verified Athlete Profile',
    email: 'athlete@seha.gov.eg',
    phone: '01099887766',
    nationalId: '30408150104829',
    clubAr: 'نادي المستقبل الرياضي · القاهرة',
    clubEn: 'Al-Mostakbal Sports Club · Cairo',
    sportAr: 'كرة القدم (المستوى الثالث)',
    sportEn: 'Football (Level 3)',
    guardianNameAr: 'يوسف عبدالله السيد',
    guardianNameEn: 'Youssef Abdullah El-Sayed',
    scopeDescriptionAr: 'إدارة الملف الطبي الفردي للرياضي: حجز الفحوصات، السجل الطبي، والشهادات المعتمدة',
    scopeDescriptionEn: 'Manage individual athlete medical profile: e-Booking, clinical history, and verified certificates',
    allowedRoutes: ['citizen-home', 'citizen-bookings', 'citizen-certs', 'citizen-history', 'citizen-consents', 'cert', 'verify'],
    avatarLetter: 'أ',
    defaultRoute: 'citizen-home',
    defaultPassword: 'athlete2026',
    featureTags: [
      { ar: 'الرئيسية والملف الطبي', en: 'Home & Medical Profile' },
      { ar: 'حجز كشف طبي', en: 'Medical Booking' },
      { ar: 'السجل الطبي السريري', en: 'Clinical Records' },
      { ar: 'الشهادات المعتمدة', en: 'Verified Certs' }
    ]
  },
  guardian: {
    id: 'guardian',
    role: 'guardian',
    name: 'يوسف عبدالله السيد',
    nameEn: 'Youssef Abdullah El-Sayed',
    titleAr: 'ولي الأمر (حساب عائلي)',
    titleEn: 'Parent / Guardian (Family Account)',
    subBadgeAr: 'إدارة ملفات الأبناء (ابنان مرتبطان)',
    subBadgeEn: 'Manage Connected Children (2 Athletes)',
    email: 'guardian@seha.gov.eg',
    phone: '01012345678',
    nationalId: '27501010104829',
    childrenCount: 2,
    children: [
      {
        name: 'أحمد يوسف السيد',
        relation: 'الابن (حساب رياضي)',
        relationEn: 'Son (Athlete Profile)',
        age: 16,
        sport: 'كرة القدم',
        nationalId: '30408150104829',
        certNumber: 'SH-26-004517',
        bookingCode: 'BK-26-018245'
      },
      {
        name: 'مريم أحمد يوسف',
        relation: 'الابنة (تابع عائلي)',
        relationEn: 'Daughter (Dependent)',
        age: 14,
        sport: 'ألعاب القوى',
        nationalId: '30806120104829',
        certNumber: 'SH-26-004518',
        bookingCode: 'BK-26-018246'
      }
    ],
    childrenNames: ['أحمد يوسف السيد', 'مريم أحمد يوسف'],
    scopeDescriptionAr: 'متابعة وإدارة الملفات الطبية للأبناء الرياضيين، حجز الكشوفات لهم، والتبديل المباشر بين ملفاتهم',
    scopeDescriptionEn: 'Manage connected athlete children profiles, book examinations, and switch between profiles seamlessly',
    allowedRoutes: ['citizen-home', 'citizen-family', 'citizen-bookings', 'citizen-certs', 'citizen-history', 'citizen-consents', 'cert', 'verify'],
    avatarLetter: 'ي',
    defaultRoute: 'citizen-home',
    defaultPassword: 'parent2026',
    featureTags: [
      { ar: 'إدارة العائلة والأبناء', en: 'Family Management' },
      { ar: 'تبديل ملفات الأبناء', en: 'Child Profile Switching' },
      { ar: 'حجز كشوفات للأبناء', en: 'Book for Children' },
      { ar: 'السجل الطبي للتابعين', en: 'Children Medical Records' }
    ]
  }
};

// Aliases for backward safety
mockPersonas.parent = mockPersonas.guardian;
mockPersonas.citizen = mockPersonas.athlete;
