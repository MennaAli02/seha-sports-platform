import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { mockPersonas } from '../../../data/mockPersonas';
import { CFG } from '../../../data/mockData';

// Security: Detect development environment
const IS_DEV = Boolean(import.meta.env && import.meta.env.DEV);

export const LoginView = ({
  initialRole = 'athlete',
  onLogin,
  onBackToRoleSelect,
  isLoggingIn: externalIsLoggingIn = false,
  loginError = null
}) => {
  const { language, toggleLanguage, isRTL, L } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  // Normalize role
  const normalizedInitial = initialRole === 'citizen' ? 'athlete' : initialRole;
  const [selectedRole] = useState(normalizedInitial);
  const activePersona = mockPersonas[selectedRole] || mockPersonas.athlete;

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');

  // Security: In production builds, fields MUST start empty. In dev mode only, allow prefill for testing.
  const [identifier, setIdentifier] = useState(() => {
    if (IS_DEV) {
      return selectedRole === 'super_admin' ? activePersona.email : activePersona.nationalId;
    }
    return '';
  });

  const [password, setPassword] = useState(() => {
    if (IS_DEV) {
      return activePersona.defaultPassword || 'seha2026';
    }
    return '';
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Registration Form State (Athlete or Guardian)
  const [regFullName, setRegFullName] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('2005-06-15');
  const [regSport, setRegSport] = useState(0);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regChildrenCount, setRegChildrenCount] = useState(2);
  const [regAgreedToLaw, setRegAgreedToLaw] = useState(true);

  // Status & Validation
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [idError, setIdError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isSubmitting = localIsSubmitting || externalIsLoggingIn;

  // Convert Arabic-Indic digits (٠-٩) to standard Western digits (0-9) and strip non-digits
  const normalizeDigits = (val) => {
    if (!val) return '';
    const arabicNumerals = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    const western = val.replace(/[٠-٩]/g, (d) => arabicNumerals.indexOf(d));
    return western.replace(/\D/g, '');
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    if (selectedRole === 'super_admin') {
      setIdentifier(val);
      if (idError) setIdError(null);
    } else {
      // If user inputs digits or Arabic numerals, normalize them
      const cleaned = normalizeDigits(val).slice(0, 14);
      setIdentifier(cleaned);
      if (cleaned.length > 0 && cleaned.length !== 14) {
        setIdError(L('يجب أن يتكون الرقم القومي من 14 رقمًا', 'National ID must be 14 digits'));
      } else {
        setIdError(null);
      }
    }
  };

  // Track Caps Lock modifier key on keyboard interaction
  const checkCapsLock = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };


  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setLocalError(null);

    // Validate 14 digits if National ID
    if (selectedRole !== 'super_admin') {
      const cleanId = normalizeDigits(identifier);
      if (cleanId.length !== 14) {
        setIdError(L('الرقم القومي غير مكتمل (مطلوب 14 رقمًا)', 'National ID must be exactly 14 digits'));
        setLocalError(L('يرجى إدخال رقم قومي صحيح مكون من 14 رقمًا', 'Please enter a valid 14-digit National ID'));
        return;
      }
    }

    if (!password) {
      setLocalError(L('يرجى إدخال كلمة المرور', 'Please enter your password'));
      return;
    }

    setLocalIsSubmitting(true);
    if (onLogin) {
      const result = onLogin(selectedRole, {
        identifier,
        password,
        persona: activePersona,
        rememberMe
      });
      if (result && typeof result.finally === 'function') {
        result.finally(() => setLocalIsSubmitting(false));
      } else {
        setTimeout(() => setLocalIsSubmitting(false), 400);
      }
    } else {
      setTimeout(() => setLocalIsSubmitting(false), 300);
    }
  };

  const handleRegisterSubmit = (e) => {
    if (e) e.preventDefault();
    setLocalError(null);

    if (!regFullName.trim()) {
      setLocalError(L('يرجى كتابة الاسم بالكامل رباعيًا', 'Please enter full quadruple name'));
      return;
    }

    const cleanId = normalizeDigits(regNationalId);
    if (cleanId.length !== 14) {
      setLocalError(L('الرقم القومي يجب أن يتكون من 14 رقمًا صحيحًا', 'National ID must be exactly 14 digits'));
      return;
    }

    if (regPassword.length < 6) {
      setLocalError(L('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام', 'Password must be at least 6 characters'));
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setLocalError(L('كلمتا المرور غير متطابقتين', 'Passwords do not match'));
      return;
    }

    if (!regAgreedToLaw) {
      setLocalError(L('يجب الموافقة على شروط معالجة البيانات وفق قانون 151 لسنة 2020', 'Must accept data processing terms under Law 151/2020'));
      return;
    }

    setLocalIsSubmitting(true);
    setSuccessMessage(
      selectedRole === 'guardian'
        ? L('تم إنشاء حساب ولي الأمر بنجاح! جاري تحويلك لبوابة العائلة...', 'Guardian account created successfully! Redirecting...')
        : L('تم تسجيل حساب الرياضي بنجاح! جاري تحويلك للملف الطبي...', 'Athlete account registered successfully! Redirecting...')
    );

    setTimeout(() => {
      if (onLogin) {
        onLogin(selectedRole, {
          identifier: cleanId,
          password: regPassword,
          persona: {
            ...activePersona,
            name: regFullName.trim(),
            nationalId: cleanId,
            phone: regPhone || activePersona.phone
          }
        });
      }
      setLocalIsSubmitting(false);
    }, 700);
  };

  // Neutral Role Icon (No green verified badge)
  const getRoleIcon = () => {
    if (selectedRole === 'super_admin') {
      return <ShieldCheck className="w-8 h-8 text-[#003366] dark:text-[#ABC7E8]" />;
    }
    if (selectedRole === 'guardian') {
      return <Users className="w-8 h-8 text-[#003366] dark:text-[#ABC7E8]" />;
    }
    return <Activity className="w-8 h-8 text-[#003366] dark:text-[#ABC7E8]" />;
  };

  // Static clean subtitle (Removed "(4 أبناء)" and variable text)
  const getRoleSubtitle = () => {
    if (selectedRole === 'guardian') {
      return L('متابعة ملفات الأبناء والتابعين', 'Manage Connected Children and Family Profiles');
    }
    if (selectedRole === 'athlete') {
      return L('الملف الطبي الموحد للرياضي', 'Unified Athlete Medical Clearance');
    }
    return L('إدارة المنظومة الوطنية الشاملة', 'National Platform Administration and Governance');
  };

  const roleTitle = L(activePersona.titleAr, activePersona.titleEn);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E2EAF2] via-[#F4F6F9] to-[#D5E2EE] dark:from-[#061220] dark:via-[#081729] dark:to-[#0E2442] flex items-center justify-center p-3.5 sm:p-5 md:p-6 py-6 sm:py-10 select-none relative font-arabic">
      
      {/* Ambient background soft glow */}
      <div className="absolute top-1/4 inset-inline-start-1/4 w-96 h-96 bg-[#4B6F9A]/15 dark:bg-[#5C84B5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 inset-inline-end-1/4 w-96 h-96 bg-[#003366]/15 dark:bg-[#0066CC]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Floating Card (Content-driven height, no dead space) */}
      <div className="w-full max-w-[540px] sm:max-w-[580px] bg-white dark:bg-[#0E2442] rounded-[24px] shadow-[0_20px_50px_rgba(0,51,102,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#DCE4EC] dark:border-[#1E426F] overflow-hidden flex flex-col justify-between my-auto relative z-10 transition-all duration-200">
        
        {/* Soft Header with Unified Transition (No hard split) */}
        <div className="bg-gradient-to-b from-[#EEF3F8] via-[#F4F7FA] to-white dark:from-[#142F55] dark:via-[#0E2442] dark:to-[#0E2442] p-5 sm:p-6 pb-4 border-b border-[#DCE4EC] dark:border-[#1E426F] flex flex-col items-center shrink-0">
          
          {/* Top Bar inside card header */}
          <div className="w-full flex items-center justify-between pb-3">
            {/* RTL-correct Back Button: points toward inline-start (Right in RTL, Left in LTR) */}
            <button
              type="button"
              onClick={onBackToRoleSelect}
              className="min-h-[40px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#003366] dark:text-[#ABC7E8] bg-white dark:bg-[#1B355A] hover:bg-slate-50 dark:hover:bg-[#274D7E] border border-[#DCE4EC] dark:border-[#274D7E] shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A]"
              title={L('الرجوع لتحديد الدور', 'Back to role selection')}
              aria-label={L('الرجوع لشاشة اختيار نوع الحساب', 'Back to role selection')}
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{L('تغيير الدور', 'Change Role')}</span>
            </button>

            {/* Quick preferences */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleLanguage}
                title={language === 'en' ? 'التحويل للعربية' : 'Switch to English'}
                className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-[#4A607A] hover:text-[#003366] dark:text-[#94B0D0] dark:hover:text-[#F2F6FB] hover:bg-white/80 dark:hover:bg-[#142F55] transition-colors text-xs font-bold cursor-pointer flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A]"
                aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              >
                <Globe className="w-4 h-4 text-[#4B6F9A]" />
                <span className="uppercase text-xs font-extrabold">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-[#4A607A] hover:text-[#003366] dark:text-[#94B0D0] dark:hover:text-[#F2F6FB] hover:bg-white/80 dark:hover:bg-[#142F55] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A]"
                aria-label={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#4B6F9A]" />}
              </button>
            </div>
          </div>

          {/* Neutral Role Avatar & Static Clean Subtitle */}
          <div className="flex flex-col items-center mt-2">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1B355A] shadow-xs border border-[#DCE4EC] dark:border-[#274D7E] flex items-center justify-center">
              {getRoleIcon()}
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-[#003366] dark:text-[#F2F6FB] tracking-tight text-center mt-3 mb-1">
              {roleTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#4A607A] dark:text-[#ABC7E8] text-center mb-4">
              {getRoleSubtitle()}
            </p>
          </div>

          {/* Accessible Mode Tabs for Athlete & Guardian (Proper role="tablist") */}
          {selectedRole !== 'super_admin' && (
            <div
              role="tablist"
              aria-label={L('خيارات الدخول والتسجيل', 'Sign in and registration options')}
              className="grid grid-cols-2 gap-1 p-1.5 bg-[#DFE7F1] dark:bg-[#162E4F] rounded-[16px] border border-[#CBD5E1] dark:border-[#274D7E] w-full max-w-[340px]"
            >
              <button
                type="button"
                role="tab"
                id="tab-login"
                aria-selected={authMode === 'login'}
                aria-controls="panel-login"
                onClick={() => {
                  setAuthMode('login');
                  setLocalError(null);
                  setIdError(null);
                }}
                className={`min-h-[40px] py-2 px-3 rounded-[12px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A] ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-[#0E2442] text-[#003366] dark:text-[#F2F6FB] shadow-xs'
                    : 'text-[#4A607A] dark:text-[#ABC7E8] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>{L('تسجيل الدخول', 'Sign In')}</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-register"
                aria-selected={authMode === 'register'}
                aria-controls="panel-register"
                onClick={() => {
                  setAuthMode('register');
                  setLocalError(null);
                  setIdError(null);
                }}
                className={`min-h-[40px] py-2 px-3 rounded-[12px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A] ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-[#0E2442] text-[#003366] dark:text-[#F2F6FB] shadow-xs'
                    : 'text-[#4A607A] dark:text-[#ABC7E8] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{L('حساب جديد', 'Register')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body (Content-Driven Height, No Dead Space) */}
        <div className="p-5 sm:p-7 pt-5 flex-1 flex flex-col justify-between">
          
          {/* Notification Alert Banners */}
          {(localError || loginError) && (
            <div
              role="alert"
              className="p-3.5 mb-5 rounded-[14px] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-xs sm:text-sm text-red-700 dark:text-red-300 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{localError || loginError}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="p-3.5 mb-5 rounded-[14px] bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-start gap-2.5 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-150"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{successMessage}</span>
            </div>
          )}

          {authMode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form
              id="panel-login"
              role="tabpanel"
              aria-labelledby="tab-login"
              onSubmit={handleLoginSubmit}
              className="space-y-5"
            >
              {/* National ID / Email Group */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="login-identifier"
                    className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB]"
                  >
                    {selectedRole === 'super_admin'
                      ? L('البريد الإلكتروني المؤسسي *', 'Official Email Address *')
                      : selectedRole === 'guardian'
                      ? L('الرقم القومي لولي الأمر (14 رقم) *', 'Guardian National ID (14 digits) *')
                      : L('الرقم القومي للرياضي (14 رقم) *', 'Athlete National ID (14 digits) *')}
                  </label>

                  {/* Live Character Counter for 14 digits */}
                  {selectedRole !== 'super_admin' && (
                    <span className="text-xs font-mono font-bold text-[#4B6F9A] dark:text-[#ABC7E8] bg-[#F0F4F9] dark:bg-[#162E4F] px-2 py-0.5 rounded-md">
                      {identifier.length} / 14
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <div className="absolute top-0 bottom-0 inset-inline-start-0 w-12 flex items-center justify-center pointer-events-none text-[#4A607A] dark:text-[#94B0D0]">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-identifier"
                    type={selectedRole === 'super_admin' ? 'email' : 'text'}
                    autoComplete="username"
                    inputMode={selectedRole === 'super_admin' ? 'email' : 'numeric'}
                    dir="ltr"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    placeholder={
                      selectedRole === 'super_admin'
                        ? 'admin@seha.gov.eg'
                        : selectedRole === 'guardian'
                        ? '28005120104829'
                        : '30408150104829'
                    }
                    required
                    aria-describedby={idError ? 'id-error' : 'id-helper'}
                    aria-invalid={!!idError}
                    style={{
                      paddingInlineStart: '46px',
                      paddingInlineEnd: '16px'
                    }}
                    className={`w-full h-12 bg-[#F4F6F9] dark:bg-[#081729] border rounded-[14px] text-sm font-medium text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:ring-3 focus:ring-[#4B6F9A]/30 transition-all text-start ${
                      idError
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#DCE4EC] dark:border-[#1E426F] focus:border-[#4B6F9A]'
                    }`}
                  />
                </div>

                {/* Helper / Error text */}
                <p
                  id={idError ? 'id-error' : 'id-helper'}
                  className={`text-xs mt-1.5 ${
                    idError ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-[#4A607A] dark:text-[#94B0D0]'
                  }`}
                >
                  {idError || (
                    selectedRole === 'super_admin'
                      ? L('أدخل بريدك الإلكتروني المسجل بإدارة المنظومة', 'Enter your official registered email address')
                      : L('أدخل الرقم القومي المكون من 14 رقمًا المدون ببطاقة الرقم القومي أو شهادة الميلاد', 'Enter 14-digit National ID from ID card or birth certificate')
                  )}
                </p>
              </div>

              {/* Password Group */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB]"
                  >
                    {L('كلمة المرور *', 'Password *')}
                  </label>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute top-0 bottom-0 inset-inline-start-0 w-12 flex items-center justify-center pointer-events-none text-[#4A607A] dark:text-[#94B0D0]">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    placeholder="••••••••"
                    required
                    style={{
                      paddingInlineStart: '46px',
                      paddingInlineEnd: '48px'
                    }}
                    className={`w-full h-12 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm font-medium text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A] focus:ring-3 focus:ring-[#4B6F9A]/30 transition-all ${
                      !showPassword ? 'font-mono tracking-[0.25em] text-base' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-0 bottom-0 inset-inline-end-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#4A607A] hover:text-[#003366] dark:text-[#94B0D0] dark:hover:text-[#F2F6FB] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A] rounded-lg"
                    aria-label={showPassword ? L('إخفاء كلمة المرور', 'Hide password') : L('إظهار كلمة المرور', 'Show password')}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>

                {/* Caps Lock Warning Banner */}
                {capsLockActive && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800" role="status">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{L('تنبيه: زر الحروف الكبيرة (Caps Lock) مفعل على لوحة المفاتيح', 'Warning: Caps Lock is turned on')}</span>
                  </div>
                )}
              </div>

              {/* Checkbox & Forgot Password Row (Non-wrapping, 20px checkbox, real link) */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <label className="inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap text-sm text-[#003366] dark:text-[#ABC7E8] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-[#CBD5E1] text-[#003366] focus:ring-[#4B6F9A] cursor-pointer"
                  />
                  <span>{L('ابقَ مسجلاً دخولي', 'Keep me logged in')}</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setLocalError(L('يرجى مراجعة إدارة النادي أو المستشفى المعتمد لإعادة تعيين كلمة المرور، أو الاتصال بالخط الساخن 1642.', 'Please contact your accredited unit or platform hotline 1642 for password recovery.'));
                  }}
                  className="text-sm font-semibold text-[#4B6F9A] hover:text-[#003366] dark:text-[#ABC7E8] dark:hover:text-white underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A] rounded whitespace-nowrap"
                >
                  {L('نسيت كلمة المرور؟', 'Forgot Password?')}
                </button>
              </div>

              {/* Submit Button (Active primary style with clear loading state) */}
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full h-12 bg-[#003366] hover:bg-[#002244] dark:bg-[#4B6F9A] dark:hover:bg-[#3D5E85] active:bg-[#001833] text-white font-bold text-sm sm:text-base rounded-[14px] shadow-md shadow-[#003366]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4B6F9A] mt-5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{L('جاري التحقق والدخول...', 'Authenticating...')}</span>
                  </>
                ) : (
                  <>
                    <span>{L('تسجيل الدخول إلى المنظومة', 'Sign in to Platform')}</span>
                    {isRTL ? <ArrowLeft className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <form
              id="panel-register"
              role="tabpanel"
              aria-labelledby="tab-register"
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                  {selectedRole === 'guardian'
                    ? L('اسم ولي الأمر رباعيًا *', 'Guardian Full Name *')
                    : L('اسم الرياضي رباعيًا (كما بالبطاقة) *', 'Athlete Full Name (per National ID) *')}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute top-0 bottom-0 inset-inline-start-0 w-10 flex items-center justify-center pointer-events-none text-[#4A607A]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder={isRTL ? 'مثال: محمد حسام عبدالفتاح محمود' : 'e.g. Mohamed Hossam Mahmoud'}
                    style={{
                      paddingInlineStart: '40px',
                      paddingInlineEnd: '14px'
                    }}
                    className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm font-medium text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A]"
                  />
                </div>
              </div>

              {/* National ID & Mobile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                    {L('الرقم القومي (14 رقم) *', 'National ID (14 digits) *')}
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    maxLength={14}
                    value={regNationalId}
                    onChange={(e) => setRegNationalId(normalizeDigits(e.target.value))}
                    placeholder="30408150104829"
                    className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm font-mono px-3.5 text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A] text-start"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                    {L('رقم المحمول للتواصل *', 'Mobile Phone *')}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute top-0 bottom-0 inset-inline-start-0 w-10 flex items-center justify-center pointer-events-none text-[#4A607A]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={regPhone}
                      onChange={(e) => setRegPhone(normalizeDigits(e.target.value))}
                      placeholder="01012345678"
                      style={{
                        paddingInlineStart: '40px',
                        paddingInlineEnd: '14px'
                      }}
                      className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm font-mono text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A] text-start"
                    />
                  </div>
                </div>
              </div>

              {/* Role specific row: Athlete -> Sport & DOB / Guardian -> Email & Children Count */}
              {selectedRole === 'athlete' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                      {L('اللعبة المقيد بها *', 'Sport / Discipline *')}
                    </label>
                    <select
                      value={regSport}
                      onChange={(e) => setRegSport(Number(e.target.value))}
                      className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm px-3 text-[#003366] dark:text-[#F2F6FB] focus:outline-none focus:border-[#4B6F9A] cursor-pointer"
                    >
                      {CFG.sports.map((sp, idx) => (
                        <option key={idx} value={idx}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                      {L('تاريخ الميلاد *', 'Date of Birth *')}
                    </label>
                    <input
                      type="date"
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm px-3 text-[#003366] dark:text-[#F2F6FB] focus:outline-none focus:border-[#4B6F9A]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                      {L('البريد الإلكتروني', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm px-3 text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                      {L('عدد الأبناء الرياضيين المراد ربطهم', 'Children to Connect')}
                    </label>
                    <select
                      value={regChildrenCount}
                      onChange={(e) => setRegChildrenCount(Number(e.target.value))}
                      className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm px-3 text-[#003366] dark:text-[#F2F6FB] focus:outline-none focus:border-[#4B6F9A] cursor-pointer"
                    >
                      <option value={1}>1 {L('ابن / رياضي', 'Child')}</option>
                      <option value={2}>2 {L('أبناء', 'Children')}</option>
                      <option value={3}>3 {L('أبناء', 'Children')}</option>
                      <option value={4}>4 {L('أبناء أو أكثر', '4 or more')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                    {L('كلمة المرور *', 'Password *')}
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm px-3 text-[#003366] dark:text-[#F2F6FB] focus:outline-none focus:border-[#4B6F9A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2">
                    {L('تأكيد كلمة المرور *', 'Confirm Password *')}
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-[14px] text-sm px-3 text-[#003366] dark:text-[#F2F6FB] focus:outline-none focus:border-[#4B6F9A]"
                  />
                </div>
              </div>

              {/* Law 151 Consent Checkbox */}
              <label className="flex items-start gap-2.5 pt-2 text-xs text-[#4A607A] dark:text-[#ABC7E8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={regAgreedToLaw}
                  onChange={(e) => setRegAgreedToLaw(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#003366] focus:ring-[#4B6F9A] w-4 h-4 mt-0.5 cursor-pointer"
                />
                <span className="leading-relaxed">
                  {L(
                    'أوافق على إنشاء الحساب ومعالجة البيانات طبقًا لقانون حماية البيانات الشخصية رقم ',
                    'I agree to account creation and data processing under Personal Data Protection Law '
                  )}
                  <bdi dir="ltr" className="font-bold font-mono">151 / 2020</bdi>.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#003366] hover:bg-[#002244] dark:bg-[#4B6F9A] dark:hover:bg-[#3D5E85] text-white font-bold text-sm sm:text-base rounded-[14px] shadow-md shadow-[#003366]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{L('جاري إنشاء الحساب والتأكيد...', 'Creating Account...')}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4.5 h-4.5" />
                    <span>{L('تأكيد وتسجيل الحساب الجديد', 'Register & Sign In')}</span>
                  </>
                )}
              </button>
            </form>
          )}



        </div>

      </div>

    </div>
  );
};
