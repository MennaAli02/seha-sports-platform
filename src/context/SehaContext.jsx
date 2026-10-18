import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { generateSeedData, CFG, GOV_EN, SP_EN } from '../data/mockData';

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

  const [currentRoute, setCurrentRoute] = useState('dash');
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
    }, 2500);
  }, []);

  const logAudit = useCallback((by, event) => {
    const d = new Date();
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setAudit(prev => [[time, by, event, event], ...prev]);
  }, []);

  const navigate = useCallback((route, meta = {}) => {
    setCurrentRoute(route);
    if (meta.certIndex !== undefined) {
      setSelectedCertIndex(meta.certIndex);
    }
    if (meta.report !== undefined) {
      setSelectedReport(meta.report);
    } else if (route !== 'reports') {
      setSelectedReport(null);
    }
    if (meta.verifyQ !== undefined) {
      setVerifyQuery(meta.verifyQ);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    setSidebarExpanded,
    toggleSidebar,
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
