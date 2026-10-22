import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Users,
  Building2,
  Stethoscope,
  Award,
  QrCode,
  ShieldCheck,
  BookOpen,
  Calendar,
  Building,
  Settings,
  FileText,
  Home,
  Printer,
  ArrowLeft,
  Activity,
  BarChart2,
  Coins,
  Milestone,
  Lock,
  Check,
  X,
  Camera,
  Upload,
  Search,
  Plus,
  Download
} from 'lucide-react';

export const IC = {
  dash: <LayoutDashboard className="w-5 h-5 flex-none" />,
  mobile: <Smartphone className="w-5 h-5 flex-none" />,
  club: <Users className="w-5 h-5 flex-none" />,
  hosp: <Building2 className="w-5 h-5 flex-none" />,
  steth: <Stethoscope className="w-5 h-5 flex-none" />,
  cert: <Award className="w-5 h-5 flex-none" />,
  scan: <QrCode className="w-5 h-5 flex-none" />,
  shield: <ShieldCheck className="w-5 h-5 flex-none" />,
  book: <BookOpen className="w-5 h-5 flex-none" />,
  cal: <Calendar className="w-5 h-5 flex-none" />,
  hospb: <Building className="w-5 h-5 flex-none" />,
  gear: <Settings className="w-5 h-5 flex-none" />,
  rep: <FileText className="w-5 h-5 flex-none" />,
  home: <Home className="w-5 h-5 flex-none" />,
  print: <Printer className="w-5 h-5 flex-none" />,
  back: <ArrowLeft className="w-5 h-5 flex-none" />,
  heart: <Activity className="w-5 h-5 flex-none" />,
  chart: <BarChart2 className="w-5 h-5 flex-none" />,
  money: <Coins className="w-5 h-5 flex-none" />,
  road: <Milestone className="w-5 h-5 flex-none" />,
  lock: <Lock className="w-5 h-5 flex-none" />,
  check: <Check className="w-5 h-5 flex-none" />,
  x: <X className="w-5 h-5 flex-none" />,
  camera: <Camera className="w-5 h-5 flex-none" />,
  upload: <Upload className="w-5 h-5 flex-none" />,
  search: <Search className="w-5 h-5 flex-none" />,
  plus: <Plus className="w-5 h-5 flex-none" />,
  dl: <Download className="w-5 h-5 flex-none" />
};

export const LOGO_SVG = (
  <img
    src="/seha-icon.png"
    alt="Seha SportsMed Platform"
    width="34"
    height="34"
    className="w-[34px] h-[34px] object-contain flex-none transition-transform hover:scale-105 duration-200"
    style={{ flex: 'none' }}
  />
);

export const ECG_SVG = (
  <svg className="ecg" viewBox="0 0 700 250" preserveAspectRatio="none" fill="none">
    <path
      d="M0 170h150l25-50 25 100 30-150 30 170 25-70 20 20h60l20-40 20 60 25-90 25 120 20-40 25 20h180"
      stroke="var(--primary-300)"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
