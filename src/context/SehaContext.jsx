import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { generateSeedData, CFG, GOV_EN, SP_EN } from '../data/mockData';
import { mockPersonas } from '../data/mockPersonas';

const SehaContext = createContext(undefined);

export const SehaProvider = ({ children }) => {
  const initialData = useMemo(() => generateSeedData(), []);

  const [players, setPlayers] = useState(() => {
    return initialData.players.map(p => ({
      ...p,
      nameEn: p.nameEn || (p.g === 'F' || p.id === 'P-1002' || p.nid === '30806120104829' ? 'Maryam Ahmad Youssef' : 'Ahmad Youssef El-Sayed'),
      gdEn: p.gdEn || 'Youssef Abdullah El-Sayed'
    }));
  });
  const [clubs, setClubs] = useState(initialData.clubs);
  const [hosps, setHosps] = useState(initialData.hosps);
  const [consents, setConsents] = useState(initialData.consents);
  const [audit, setAudit] = useState(initialData.audit);
  const [ash, setAsh] = useState(initialData.ash);
  const [cfg, setCfg] = useState(initialData.cfg);

  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('guardian');
  const [currentUser, setCurrentUser] = useState(mockPersonas.guardian);

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
    const basePersona = mockPersonas[role] || mockPersonas.guardian;
    const personaName = credentials.name || basePersona.name;
    const personaNationalId = credentials.national_id || credentials.nationalId || credentials.identifier || basePersona.nationalId;
    const personaEmail = credentials.email || basePersona.email;

    const userPersona = {
      ...basePersona,
      name: personaName,
      nameEn: credentials.nameEn || basePersona.nameEn || 'Youssef Abdullah El-Sayed',
      nationalId: personaNationalId,
      email: personaEmail,
      phone: credentials.phone || basePersona.phone,
      athlete: credentials.athlete,
      guardian: credentials.guardian,
    };

    setUserRole(role);
    setCurrentUser(userPersona);
    setIsAuthenticated(true);

    const isCitizenType = role === 'citizen' || role === 'athlete' || role === 'guardian';
    const targetRoute = role === 'guardian' ? 'citizen-family' : (isCitizenType ? 'citizen-home' : 'dash');
    setCurrentRoute(targetRoute);

    if (role === 'guardian') {
      // For guardian, start on the family hub with 2 connected sons cards, starting with Ahmed (index 0)
      setSelectedPlayerIndex(0);
      showToast({
        ar: `مرحبًا ${personaName} — تم تسجيل الدخول كولي أمر (حساب عائلي)`,
        en: `Welcome ${userPersona.nameEn || 'Youssef Abdullah El-Sayed'} — Signed in as Parent (Family Hub)`
      });
    } else if (role === 'athlete' || role === 'citizen') {
      // If logging in as an athlete, match the player by National ID
      const targetNid = String(personaNationalId).trim();
      const existingIdx = players.findIndex(p => String(p.nid).trim() === targetNid);
      if (existingIdx !== -1) {
        setSelectedPlayerIndex(existingIdx);
      } else {
        // Newly registered athlete: create profile in players list
        const newPlayer = {
          id: credentials.athlete?.code || ('P-' + (1000 + players.length)),
          nid: targetNid,
          name: personaName,
          nameEn: credentials.nameEn || 'Ahmad Youssef El-Sayed',
          g: credentials.gender === 'female' ? 'F' : 'M',
          age: 18,
          gov: "القاهرة",
          sp: 0,
          lv: 1,
          bk: "BK-26-" + Math.floor(100000 + Math.random() * 900000),
          st: "fit",
          ct: "SH-26-" + Math.floor(100000 + Math.random() * 900000),
          ch: "app",
          hs: 0,
          cl: 0,
          gd: "—",
          gdEn: "—",
          rel: { ar: "الرياضي (حساب فردي)", en: "Athlete (Individual)", isPrimary: true },
          iss: { y: 2026, m: 10, d: 21 },
          exp: { y: 2027, m: 10, d: 20 },
          dobm: 1,
          dobd: 1,
          doby: 2005,
          bp: "120/80",
          hr: 70,
          fp: "5B9C 81D2 1F3A 44C0",
          tm: "09:00",
          verificationStatus: "verified",
          medicalHistory: []
        };
        setPlayers(prev => [newPlayer, ...prev]);
        setSelectedPlayerIndex(0);
      }
      showToast({
        ar: `مرحبًا ${personaName} — تم تسجيل الدخول كرياضي (حساب فردي)`,
        en: `Welcome ${userPersona.nameEn || 'Ahmad Youssef El-Sayed'} — Signed in as Athlete (Individual Account)`
      });
    } else {
      showToast({
        ar: `مرحبًا ${personaName} — تم تسجيل الدخول بصلاحيات مسؤول المنظومة`,
        en: `Welcome ${userPersona.nameEn || personaName} — Signed in as Platform Administrator`
      });
    }
  }, [players, showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentRoute('role_select');
    showToast({
      ar: 'تم تسجيل الخروج بنجاح من المنظومة',
      en: 'Successfully logged out of the platform'
    });
  }, [showToast]);

  const switchChildProfile = useCallback((idx) => {
    if (idx >= 0 && idx < players.length) {
      setSelectedPlayerIndex(idx);
      const targetChild = players[idx];
      const nameAr = targetChild.name || 'الابن';
      const nameEn = targetChild.nameEn || (targetChild.id === 'P-1002' || targetChild.g === 'F' ? 'Maryam Ahmad Youssef' : 'Ahmad Youssef El-Sayed');
      const relAr = targetChild.rel?.ar || (targetChild.g === 'F' ? 'الابنة' : 'الابن');
      const relEn = targetChild.rel?.en || (targetChild.g === 'F' ? 'Daughter' : 'Son');
      showToast({
        ar: `تم التبديل إلى ملف: ${nameAr} (${relAr})`,
        en: `Switched active profile to: ${nameEn} (${relEn})`
      });
    }
  }, [players, showToast]);

  const connectExistingChild = useCallback((childData) => {
    const existingIndex = players.findIndex(p => p.nid === childData.nationalId);
    if (existingIndex !== -1) {
      const updated = [...players];
      updated[existingIndex] = {
        ...updated[existingIndex],
        gd: currentUser?.name || 'يوسف عبدالله السيد',
        gdEn: currentUser?.nameEn || 'Youssef Abdullah El-Sayed',
        rel: {
          ar: `${childData.relationship || 'ابن'} (تابع موثق)`,
          en: `${childData.relationship || 'Child'} (Verified Dependent)`,
          isPrimary: false
        },
        verificationStatus: 'verified'
      };
      setPlayers(updated);
      setSelectedPlayerIndex(existingIndex);
      showToast({
        ar: `تم ربط حساب الابن بنجاح: ${updated[existingIndex].name}`,
        en: `Child profile connected successfully: ${updated[existingIndex].nameEn || updated[existingIndex].name}`
      });
      return { success: true, player: updated[existingIndex] };
    } else {
      // Connect as new connected account
      const newIndex = players.length;
      const isFemale = childData.gender === 'F' || childData.gender === 'female';
      const newPlayer = {
        id: 'PL-' + (1000 + newIndex),
        name: childData.name || (isFemale ? 'مريم أحمد يوسف' : 'أحمد يوسف السيد'),
        nameEn: childData.nameEn || (isFemale ? 'Maryam Ahmad Youssef' : 'Ahmad Youssef El-Sayed'),
        nid: childData.nationalId,
        g: isFemale ? 'F' : 'M',
        gd: currentUser?.name || 'يوسف عبدالله السيد',
        gdEn: currentUser?.nameEn || 'Youssef Abdullah El-Sayed',
        rel: {
          ar: `${childData.relationship || (isFemale ? 'ابنة' : 'ابن')} (تابع موثق)`,
          en: `${isFemale ? 'Daughter' : 'Son'} (Verified Dependent)`,
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
      showToast({
        ar: `تم ربط وتوثيق حساب الرياضي بنجاح: ${newPlayer.name}`,
        en: `Athlete account connected and verified successfully: ${newPlayer.nameEn || newPlayer.name}`
      });
      return { success: true, player: newPlayer };
    }
  }, [players, currentUser, showToast]);

  const registerNewChild = useCallback((childData) => {
    const newIndex = players.length;
    const isFemale = childData.gender === 'F' || childData.gender === 'female';
    const createdPlayer = {
      id: 'PL-' + (1000 + newIndex),
      name: childData.name.trim(),
      nameEn: childData.nameEn || (isFemale ? 'Maryam Ahmad Youssef' : 'Ahmad Youssef El-Sayed'),
      g: isFemale ? 'F' : 'M',
      gd: currentUser?.name || 'يوسف عبدالله السيد',
      gdEn: currentUser?.nameEn || 'Youssef Abdullah El-Sayed',
      rel: {
        ar: `${childData.relationship || (isFemale ? 'ابنة' : 'ابن')} (تابع عائلي)`,
        en: `${isFemale ? 'Daughter' : 'Son'} (Dependent)`,
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
    showToast({
      ar: `تم تسجيل وربط ملف التابع بنجاح: ${createdPlayer.name}`,
      en: `Dependent profile registered and linked successfully: ${createdPlayer.nameEn || createdPlayer.name}`
    });
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
      showToast({
        ar: 'هذه الشاشة مقصورة على مسؤول المنظومة',
        en: 'This screen is restricted to System Administrators'
      });
      targetRoute = 'citizen-home';
    }

    // Role-specific check: Athlete cannot open family management
    if (isAuthenticated && (userRole === 'athlete' || userRole === 'citizen') && targetRoute === 'citizen-family') {
      showToast({
        ar: 'إدارة العائلة مقصورة على حساب ولي الأمر',
        en: 'Family management is restricted to Parent / Guardian accounts'
      });
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
    showToast({
      ar: 'تمت إعادة تعيين البيانات التجريبية بنجاح',
      en: 'Demo data reset completed successfully'
    });
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
