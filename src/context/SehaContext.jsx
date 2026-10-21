import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { generateSeedData, CFG, GOV_EN, SP_EN } from '../data/mockData';
import { mockPersonas } from '../data/mockPersonas';

const SehaContext = createContext(undefined);

export const SehaProvider = ({ children }) => {
  const initialData = useMemo(() => generateSeedData(), []);

  const [players, setPlayers] = useState(initialData.players);
  const [clubs, setClubs] = useState(initialData.clubs);
  const [hosps, setHosps] = useState(initialData.hosps);
  const [consents, setConsents] = useState(initialData.consents);
  const [audit, setAudit] = useState(initialData.audit);
  const [ash, setAsh] = useState(initialData.ash);
  const [cfg, setCfg] = useState(initialData.cfg);

  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('super_admin');
  const [currentUser, setCurrentUser] = useState(mockPersonas.super_admin);

  // Default screen is role_select per user specification
  const [currentRoute, setCurrentRoute] = useState('role_select');
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [verifyQuery, setVerifyQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded(prev => !prev);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  const logAudit = useCallback((by, event) => {
    const d = new Date();
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setAudit(prev => [[time, by, event, event], ...prev]);
  }, []);

  const login = useCallback((role, credentials = {}) => {
    const targetPersona = mockPersonas[role] || mockPersonas.super_admin;
    setUserRole(role);
    setCurrentUser(targetPersona);
    setIsAuthenticated(true);

    const isCitizenType = role === 'citizen' || role === 'athlete' || role === 'guardian';
    const targetRoute = isCitizenType ? 'citizen-home' : 'dash';
    setCurrentRoute(targetRoute);

    if (role === 'guardian') {
      // For guardian, start with first child (index 1: Maryam)
      setSelectedPlayerIndex(1);
      showToast(`مرحبًا ${targetPersona.name} — تم تسجيل الدخول كولي أمر (حساب عائلي)`);
    } else if (role === 'athlete' || role === 'citizen') {
      setSelectedPlayerIndex(0);
      showToast(`مرحبًا ${targetPersona.name} — تم تسجيل الدخول كرياضي (حساب فردي)`);
    } else {
      showToast(`مرحبًا ${targetPersona.name} — تم تسجيل الدخول بصلاحيات مسؤول المنظومة`);
    }
  }, [showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentRoute('role_select');
    showToast('تم تسجيل الخروج بنجاح من المنظومة / Logged out');
  }, [showToast]);

  const switchChildProfile = useCallback((idx) => {
    if (idx >= 0 && idx < players.length) {
      setSelectedPlayerIndex(idx);
      const targetChild = players[idx];
      const relLabel = targetChild.rel?.ar || 'اللاعب';
      showToast(`تم التبديل إلى ملف: ${targetChild.name} (${relLabel})`);
    }
  }, [players, showToast]);

  const connectExistingChild = useCallback((childData) => {
    const existingIndex = players.findIndex(p => p.nid === childData.nationalId);
    if (existingIndex !== -1) {
      const updated = [...players];
      updated[existingIndex] = {
        ...updated[existingIndex],
        gd: currentUser?.name || 'أحمد يوسف السيد',
        rel: {
          ar: `${childData.relationship || 'ابن'} (تابع موثق)`,
          en: `${childData.relationship || 'Child'} (Verified Dependent)`,
          isPrimary: false
        },
        verificationStatus: 'verified'
      };
      setPlayers(updated);
      setSelectedPlayerIndex(existingIndex);
      showToast(`تم ربط حساب الابن بنجاح: ${updated[existingIndex].name}`);
      return { success: true, player: updated[existingIndex] };
    } else {
      // Connect as new connected account
      const newIndex = players.length;
      const newPlayer = {
        id: 'PL-' + (1000 + newIndex),
        name: childData.name || 'ابن رياضي',
        nid: childData.nationalId,
        g: childData.gender || 'M',
        gd: currentUser?.name || 'أحمد يوسف السيد',
        rel: {
          ar: `${childData.relationship || 'ابن'} (تابع موثق)`,
          en: `${childData.relationship || 'Child'} (Verified Dependent)`,
          isPrimary: false
        },
        age: Number(childData.age) || 12,
        sp: Number(childData.sport) || 0,
        cl: 0,
        hs: 0,
        lv: 2,
        st: 'fit',
        ct: 'SH-26-00' + (4700 + newIndex),
        bk: 'BK-26-01' + (8400 + newIndex),
        gov: 'القاهرة',
        iss: { y: 2026, m: 10, d: 20 },
        exp: { y: 2027, m: 10, d: 19 },
        verificationStatus: 'verified'
      };
      setPlayers(prev => [...prev, newPlayer]);
      setSelectedPlayerIndex(newIndex);
      showToast(`تم ربط وتوثيق حساب الرياضي بنجاح: ${newPlayer.name}`);
      return { success: true, player: newPlayer };
    }
  }, [players, currentUser, showToast]);

  const registerNewChild = useCallback((childData) => {
    const newIndex = players.length;
    const createdPlayer = {
      id: 'PL-' + (1000 + newIndex),
      name: childData.name.trim(),
      g: childData.gender || 'M',
      gd: currentUser?.name || 'أحمد يوسف السيد',
      rel: {
        ar: `${childData.relationship || 'ابن'} (تابع عائلي)`,
        en: `${childData.relationship === 'ابنة' ? 'Daughter' : 'Son'} (Dependent)`,
        isPrimary: false
      },
      cl: 0,
      hs: 0,
      iss: { y: 2026, m: 10, d: 20 },
      exp: { y: 2027, m: 10, d: 19 },
      doby: 2026 - Number(childData.age),
      dobm: 6,
      dobd: 15,
      st: 'fit',
      sp: Number(childData.sport) || 0,
      age: Number(childData.age) || 10,
      lv: 2,
      ct: 'SH-26-00' + (4800 + newIndex),
      bk: 'BK-26-01' + (8500 + newIndex),
      nid: childData.nationalId || ('314051201048' + Math.floor(10 + Math.random() * 90)),
      gov: 'القاهرة',
      verificationStatus: childData.verificationStatus || 'verified'
    };

    setPlayers(prev => [...prev, createdPlayer]);
    setSelectedPlayerIndex(newIndex);
    showToast(`تم تسجيل وربط ملف التابع بنجاح: ${createdPlayer.name}`);
    return createdPlayer;
  }, [players, currentUser, showToast]);

  const navigate = useCallback((route, meta = {}) => {
    let targetRoute = !route ? 'dash' : route;
    if (targetRoute === 'mobile' || targetRoute === 'citizen') {
      targetRoute = 'citizen-home';
    }

    const isCitizenRole = userRole === 'citizen' || userRole === 'athlete' || userRole === 'guardian';

    // Role boundary guard
    const citizenAllowedRoutes = [
      'citizen-home',
      'citizen-family',
      'citizen-bookings',
      'citizen-certs',
      'citizen-history',
      'citizen-consents',
      'cert',
      'verify'
    ];

    if (isAuthenticated && isCitizenRole && !citizenAllowedRoutes.includes(targetRoute)) {
      showToast('هذه الشاشة مقصورة على مسؤول المنظومة / Screen restricted to Super Admin');
      targetRoute = 'citizen-home';
    }

    // Role-specific check: Athlete cannot open family management
    if (isAuthenticated && (userRole === 'athlete' || userRole === 'citizen') && targetRoute === 'citizen-family') {
      showToast('إدارة العائلة مقصورة على حساب ولي الأمر / Family management is for Parent accounts');
      targetRoute = 'citizen-home';
    }

    setCurrentRoute(targetRoute);
    if (meta.certIndex !== undefined) {
      setSelectedCertIndex(meta.certIndex);
    } else if (targetRoute === 'cert' && isCitizenRole) {
      setSelectedCertIndex((prev) => (prev !== null ? prev : (selectedPlayerIndex ?? 0)));
    }
    if (meta.report !== undefined) {
      setSelectedReport(meta.report);
    } else if (targetRoute !== 'reports') {
      setSelectedReport(null);
    }
    if (meta.verifyQ !== undefined) {
      setVerifyQuery(meta.verifyQ);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAuthenticated, userRole, selectedPlayerIndex, showToast]);

  const resetDemoData = useCallback(() => {
    const fresh = generateSeedData();
    setPlayers(fresh.players);
    setClubs(fresh.clubs);
    setHosps(fresh.hosps);
    setConsents(fresh.consents);
    setAudit(fresh.audit);
    setAsh(fresh.ash);
    setCfg(fresh.cfg);
    setSelectedCertIndex(null);
    setSelectedReport(null);
    showToast('تمت إعادة تعيين البيانات التجريبية بنجاح / Reset completed');
  }, [showToast]);

  const stats = useMemo(() => {
    const c = { fit: 0, cond: 0, exp: 0, book: 0 };
    players.forEach(p => {
      if (c[p.st] !== undefined) c[p.st]++;
    });
    c.total = players.length;
    c.issued = c.fit + c.cond + c.exp;
    return c;
  }, [players]);

  const countBy = useCallback((fn, limit, otherLabel = 'أخرى / Other') => {
    const m = {};
    players.forEach(p => {
      const k = fn(p);
      m[k] = (m[k] || 0) + 1;
    });
    let l = Object.keys(m)
      .map(k => [k, m[k]])
      .sort((a, b) => b[1] - a[1]);
    if (limit && l.length > limit) {
      const rest = l.slice(limit).reduce((s, x) => s + x[1], 0);
      l = l.slice(0, limit);
      l.push([otherLabel, rest]);
    }
    return l;
  }, [players]);

  const bands = useMemo(() => {
    const ageBands = [
      { lAr: '9–12 سنة', lEn: '9–12 y', min: 9, max: 12 },
      { lAr: '13–15 سنة', lEn: '13–15 y', min: 13, max: 15 },
      { lAr: '16–18 سنة', lEn: '16–18 y', min: 16, max: 18 },
      { lAr: '19–23 سنة', lEn: '19–23 y', min: 19, max: 23 },
      { lAr: '24+ سنة', lEn: '24+ y', min: 24, max: 99 }
    ];
    return ageBands.map(x => {
      const ps = players.filter(p => p.age >= x.min && p.age <= x.max);
      const fitCount = ps.filter(p => p.st === 'fit' || p.st === 'exp').length;
      return {
        lAr: x.lAr,
        lEn: x.lEn,
        n: ps.length,
        pct: ps.length ? Math.round((fitCount / ps.length) * 100) : 0
      };
    });
  }, [players]);

  const value = {
    players,
    setPlayers,
    clubs,
    setClubs,
    hosps,
    setHosps,
    consents,
    setConsents,
    audit,
    setAudit,
    ash,
    setAsh,
    cfg,
    setCfg,
    currentRoute,
    setCurrentRoute,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    selectedCertIndex,
    setSelectedCertIndex,
    selectedReport,
    setSelectedReport,
    verifyQuery,
    setVerifyQuery,
    toastMessage,
    showToast,
    logAudit,
    navigate,
    resetDemoData,
    stats,
    countBy,
    bands,
    sidebarExpanded,
    toggleSidebar,
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    setUserRole,
    currentUser,
    setCurrentUser,
    login,
    logout,
    switchChildProfile,
    connectExistingChild,
    registerNewChild,
    GOV_EN,
    SP_EN
  };

  return <SehaContext.Provider value={value}>{children}</SehaContext.Provider>;
};

export const useSeha = () => {
  const context = useContext(SehaContext);
  if (!context) {
    throw new Error('useSeha must be used within a SehaProvider');
  }
  return context;
};
