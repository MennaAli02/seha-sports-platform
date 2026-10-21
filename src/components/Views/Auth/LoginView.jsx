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
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { mockPersonas } from '../../../data/mockPersonas';

export const LoginView = ({
  initialRole = 'super_admin',
  onLogin,
  onBackToRoleSelect,
  isLoggingIn: externalIsLoggingIn = false,
  loginError = null
}) => {
  const { language, toggleLanguage, isRTL, L } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  const [selectedRole, setSelectedRole] = useState(initialRole || 'super_admin');
  const activePersona = mockPersonas[selectedRole] || mockPersonas.super_admin;

  const [emailOrUser, setEmailOrUser] = useState(
    selectedRole === 'citizen' ? activePersona.nationalId : activePersona.email
  );
  const [password, setPassword] = useState(activePersona.defaultPassword || 'seha2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  const isSubmitting = localIsSubmitting || externalIsLoggingIn;

  // Sync credentials when selected role changes
  useEffect(() => {
    const persona = mockPersonas[selectedRole] || mockPersonas.super_admin;
    setEmailOrUser(selectedRole === 'citizen' ? persona.nationalId : persona.email);
    setPassword(persona.defaultPassword || 'seha2026');
  }, [selectedRole]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLocalIsSubmitting(true);

    if (onLogin) {
      const result = onLogin(selectedRole, {
        identifier: emailOrUser,
        password,
        persona: activePersona
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

  return (
    <div className="h-screen max-h-screen w-full bg-gradient-to-br from-[#E2EAF2] via-[#F4F6F9] to-[#D5E2EE] dark:from-[#061220] dark:via-[#081729] dark:to-[#0E2442] flex items-center justify-center p-3 sm:p-5 select-none relative overflow-hidden font-arabic">
      
      {/* Ambient background soft glow effects matching palette */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4B6F9A]/15 dark:bg-[#5C84B5]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#003366]/15 dark:bg-[#0066CC]/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Floating Login Card with increased length and comfortable proportions */}
      <div className="w-full max-w-[470px] min-h-[580px] sm:min-h-[620px] max-h-[calc(100vh-28px)] bg-white dark:bg-[#0E2442] rounded-[28px] sm:rounded-[32px] shadow-[0_25px_60px_rgba(0,51,102,0.2)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-[#DCE4EC] dark:border-[#1E426F] overflow-hidden flex flex-col justify-between my-auto relative z-10 transition-all duration-300 overflow-y-auto">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-b from-[#E2EAF2] via-[#EDF2F7] to-[#DFE7F1] dark:from-[#142F55] dark:via-[#0E2442] dark:to-[#081729] p-5 sm:p-7 pb-6 sm:pb-7 border-b border-[#DCE4EC] dark:border-[#1E426F] flex flex-col items-center shrink-0 relative">
          
          {/* Top Bar inside banner: Change Role Button & Language/Theme controls */}
          <div className="w-full flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={onBackToRoleSelect}
              className="text-xs sm:text-sm font-semibold text-[#003366] dark:text-[#ABC7E8] bg-white/95 dark:bg-[#1B355A] hover:bg-white dark:hover:bg-[#274D7E] px-3.5 py-1.5 rounded-full border border-[#DCE4EC] dark:border-[#274D7E] shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group"
              title={L('الرجوع لتحديد الدور', 'Back to role selection')}
            >
              {isRTL ? (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              )}
              <span>{L('تغيير الدور', 'Change Role')}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleLanguage}
                title={language === 'en' ? 'التحويل للعربية' : 'Switch to English'}
                className="p-1.5 rounded-lg text-[#4A607A] hover:text-[#003366] dark:text-[#94B0D0] dark:hover:text-[#F2F6FB] hover:bg-white/80 dark:hover:bg-[#142F55] transition-colors text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Globe className="w-4 h-4 text-[#4B6F9A]" />
                <span className="uppercase text-[11px]">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                className="p-1.5 rounded-lg text-[#4A607A] hover:text-[#003366] dark:text-[#94B0D0] dark:hover:text-[#F2F6FB] hover:bg-white/80 dark:hover:bg-[#142F55] transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#4B6F9A]" />}
              </button>
            </div>
          </div>

          {/* Role Avatar & Title with exact 20px margin */}
          <div className="flex flex-col items-center mt-2">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1B355A] shadow-md border border-[#DCE4EC] dark:border-[#274D7E] flex items-center justify-center text-[#4B6F9A] dark:text-[#ABC7E8] relative">
              {selectedRole === 'super_admin' ? (
                <ShieldCheck className="w-8 h-8 text-[#4B6F9A]" />
              ) : (
                <Smartphone className="w-8 h-8 text-[#0066CC]" />
              )}
              <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#16845B] border-2 border-white dark:border-[#0E2442] flex items-center justify-center text-white">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <h2
              className="text-lg sm:text-xl font-bold text-[#003366] dark:text-[#F2F6FB] tracking-tight text-center"
              style={{ marginTop: '20px' }}
            >
              {L(activePersona.titleAr, activePersona.titleEn)}
            </h2>
          </div>
        </div>

        {/* Form Body with exact 20px vertical margins */}
        <div className="p-5 sm:p-7 pt-5 sm:pt-6 flex-1 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* Username / National ID field */}
            <div>
              <label
                htmlFor="login-user"
                className="block text-xs sm:text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2"
              >
                {selectedRole === 'citizen'
                  ? L('الرقم القومي (14 رقم) أو البريد', 'National ID or Email')
                  : L('البريد الإلكتروني المؤسسي', 'Official Email Address')}
              </label>
              
              <div className="relative flex items-center">
                {/* Icon in dedicated 48px box */}
                <div
                  className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-12 flex items-center justify-center pointer-events-none text-[#4A607A] dark:text-[#94B0D0]`}
                >
                  <User className="w-4 h-4" />
                </div>
                
                {/* Input with guaranteed 52px padding so text never touches icon */}
                <input
                  id="login-user"
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder={
                    selectedRole === 'citizen'
                      ? L('أدخل الرقم القومي 14 رقم', 'Enter 14-digit National ID')
                      : 'admin@seha.gov.eg'
                  }
                  required
                  style={{
                    paddingRight: isRTL ? '52px' : '16px',
                    paddingLeft: isRTL ? '16px' : '52px'
                  }}
                  className="w-full h-12 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-xl text-sm font-medium text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A] focus:ring-2 focus:ring-[#4B6F9A]/20 transition-all"
                />
              </div>
            </div>

            {/* Password field with exact 20px margin */}
            <div style={{ marginTop: '20px' }}>
              <label
                htmlFor="login-password"
                className="block text-xs sm:text-sm font-bold text-[#003366] dark:text-[#F2F6FB] mb-2"
              >
                {L('كلمة المرور', 'Password')}
              </label>
              
              <div className="relative flex items-center">
                {/* Lock icon on start side */}
                <div
                  className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-12 flex items-center justify-center pointer-events-none text-[#4A607A] dark:text-[#94B0D0]`}
                >
                  <Lock className="w-4 h-4" />
                </div>

                {/* Password input with 52px padding on both sides */}
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    paddingRight: '52px',
                    paddingLeft: '52px'
                  }}
                  className="w-full h-12 bg-[#F4F6F9] dark:bg-[#081729] border border-[#DCE4EC] dark:border-[#1E426F] rounded-xl text-sm font-medium text-[#003366] dark:text-[#F2F6FB] placeholder:text-[#8CA4BE] focus:outline-none focus:border-[#4B6F9A] focus:ring-2 focus:ring-[#4B6F9A]/20 transition-all"
                />

                {/* Eye toggle button on end side */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-0 bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-12 flex items-center justify-center text-[#4A607A] hover:text-[#003366] dark:text-[#94B0D0] dark:hover:text-[#F2F6FB] cursor-pointer`}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Restore Demo row with exact 20px margin */}
            <div
              className="flex items-center justify-between text-xs sm:text-sm text-[#4A607A] dark:text-[#94B0D0]"
              style={{ marginTop: '20px' }}
            >
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#003366] dark:hover:text-[#F2F6FB] select-none shrink-0 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DCE4EC] text-[#4B6F9A] focus:ring-[#4B6F9A] w-4 h-4 cursor-pointer shrink-0"
                />
                <span className="whitespace-nowrap font-medium leading-none">
                  {L('تذكر بيانات الدخول', 'Remember credentials')}
                </span>
              </label>

              <button
                type="button"
                onClick={() => {
                  const persona = mockPersonas[selectedRole];
                  setEmailOrUser(selectedRole === 'citizen' ? persona.nationalId : persona.email);
                  setPassword(persona.defaultPassword);
                }}
                className="text-[#4B6F9A] hover:text-[#003366] dark:text-[#ABC7E8] font-bold cursor-pointer whitespace-nowrap leading-none"
              >
                {L('استعادة البيانات التجريبية', 'Restore Demo')}
              </button>
            </div>

            {/* Error Message if any */}
            {loginError && (
              <div
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
                style={{ marginTop: '20px' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit Button with exact 20px margin */}
            <div style={{ marginTop: '20px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 px-5 bg-[#4B6F9A] hover:bg-[#3D5E85] active:bg-[#003366] text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-[#4B6F9A]/30 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{L('جاري التحقق والدخول...', 'Authenticating...')}</span>
                  </>
                ) : (
                  <>
                    <span>{L('تسجيل الدخول إلى المنظومة', 'Sign in to Platform')}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Hint with exact 20px margin */}
          <div
            className="pt-4 border-t border-[#DCE4EC] dark:border-[#1E426F] text-center"
            style={{ marginTop: '20px' }}
          >
            <p className="text-xs text-[#4A607A] dark:text-[#94B0D0] leading-relaxed">
              {selectedRole === 'super_admin'
                ? L('حساب تجريبي: admin@seha.gov.eg / كلمة المرور: admin2026', 'Demo: admin@seha.gov.eg / admin2026')
                : L('حساب تجريبي: 30408150104829 / كلمة المرور: citizen2026', 'Demo: 30408150104829 / citizen2026')}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
