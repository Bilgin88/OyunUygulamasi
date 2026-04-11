import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, Tooltip, Zoom, Alert, CircularProgress } from '@mui/material';
import './index.css';
import CanvasBoard from './components/CanvasBoard';
import Sidebar from './components/Sidebar';
import ContextPanel from './components/ContextPanel';
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

// Error boundary to prevent full page crash
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('Canvas Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>Bir hata oluştu: {this.state.error?.message}</Alert>
          <Button variant="contained" onClick={() => this.setState({ hasError: false })}>Tekrar Dene</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

// ── Tema Tanımları ──────────────────────────────────────────────────────────────
const THEMES = {
  default: {
    label: '✨ Altın',
    primary:    '#fbdf1c',
    primaryHov: '#e5cc16',
    bgSidebar:  '#1e1e2e',
    bgPanel:    '#2b2d42',
    bgApp:      '#f1f5f9',
    border:     '#334155',
    toolActive: '#fbdf1c',
    toolShadow: 'rgba(251,223,28,0.35)',
    activeTxt:  '#1e1e2e',
    muiPrimary: '#fbdf1c',
  },
  red: {
    label: '🔴 Kırmızı',
    primary:    '#dc2626',
    primaryHov: '#b91c1c',
    bgSidebar:  '#450a0a',
    bgPanel:    '#7f1d1d',
    bgApp:      '#fff5f5',
    border:     '#991b1b',
    toolActive: '#dc2626',
    toolShadow: 'rgba(220,38,38,0.35)',
    activeTxt:  '#ffffff',
    muiPrimary: '#dc2626',
  },
  blue: {
    label: '🔵 Mavi',
    primary:    '#2563eb',
    primaryHov: '#1d4ed8',
    bgSidebar:  '#0f172a',
    bgPanel:    '#1e3a8a',
    bgApp:      '#eff6ff',
    border:     '#1e40af',
    toolActive: '#2563eb',
    toolShadow: 'rgba(37,99,235,0.35)',
    activeTxt:  '#ffffff',
    muiPrimary: '#2563eb',
  },
  green: {
    label: '🟢 Yeşil',
    primary:    '#059669',
    primaryHov: '#047857',
    bgSidebar:  '#022c22',
    bgPanel:    '#064e3b',
    bgApp:      '#f0fdf4',
    border:     '#065f46',
    toolActive: '#059669',
    toolShadow: 'rgba(5,150,105,0.35)',
    activeTxt:  '#ffffff',
    muiPrimary: '#059669',
  },
};

function applyThemeToCss(t) {
  const root = document.documentElement;
  root.style.setProperty('--primary',     t.primary);
  root.style.setProperty('--primary-hover', t.primaryHov);
  root.style.setProperty('--bg-sidebar',  t.bgSidebar);
  root.style.setProperty('--bg-panel',    t.bgPanel);
  root.style.setProperty('--bg-app',      t.bgApp);
  root.style.setProperty('--border',      t.border);
  root.style.setProperty('--tool-active', t.toolActive);
  root.style.setProperty('--tool-shadow', t.toolShadow);
  root.style.setProperty('--active-txt',  t.activeTxt);
}

const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#A855F7', '#EC4899', 
    '#FFFFFF', '#94A3B8', '#1E293B', '#8b4513'
];

// ── Ülke Kodları ──────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+90',  label: '🇹🇷 Türkiye'      },
  { code: '+1',   label: '🇺🇸 ABD / Kanada' },
  { code: '+44',  label: '🇬🇧 İngiltere'   },
  { code: '+49',  label: '🇩🇪 Almanya'     },
  { code: '+33',  label: '🇫🇷 Fransa'      },
  { code: '+39',  label: '🇮🇹 İtalya'      },
  { code: '+34',  label: '🇪🇸 İspanya'     },
  { code: '+31',  label: '🇳🇱 Hollanda'    },
  { code: '+32',  label: '🇧🇪 Belçika'     },
  { code: '+41',  label: '🇨🇭 İsviçre'     },
  { code: '+43',  label: '🇦🇹 Avusturya'   },
  { code: '+46',  label: '🇸🇪 İsveç'       },
  { code: '+47',  label: '🇳🇴 Norveç'      },
  { code: '+45',  label: '🇩🇰 Danimarka'   },
  { code: '+358', label: '🇫🇮 Finlandiya'  },
  { code: '+48',  label: '🇵🇱 Polonya'     },
  { code: '+7',   label: '🇷🇺 Rusya'       },
  { code: '+380', label: '🇺🇦 Ukrayna'     },
  { code: '+30',  label: '🇬🇷 Yunanistan'  },
  { code: '+40',  label: '🇷🇴 Romanya'     },
  { code: '+420', label: '🇨🇿 Çekya'       },
  { code: '+36',  label: '🇭🇺 Macaristan'  },
  { code: '+357', label: '🇨🇾 Kıbrıs'      },
  { code: '+994', label: '🇦🇿 Azerbaycan'  },
  { code: '+995', label: '🇬🇪 Gürcistan'   },
  { code: '+374', label: '🇦🇲 Ermenistan'  },
  { code: '+966', label: '🇸🇦 S. Arabistan' },
  { code: '+971', label: '🇦🇪 BAE'         },
  { code: '+972', label: '🇮🇱 İsrail'      },
  { code: '+98',  label: '🇮🇷 İran'        },
  { code: '+86',  label: '🇨🇳 Çin'         },
  { code: '+81',  label: '🇯🇵 Japonya'     },
  { code: '+82',  label: '🇰🇷 G. Kore'     },
  { code: '+91',  label: '🇮🇳 Hindistan'   },
  { code: '+55',  label: '🇧🇷 Brezilya'    },
  { code: '+54',  label: '🇦🇷 Arjantin'    },
  { code: '+52',  label: '🇲🇽 Meksika'     },
  { code: '+20',  label: '🇪🇬 Mısır'       },
  { code: '+27',  label: '🇿🇦 G. Afrika'   },
  { code: '+61',  label: '🇦🇺 Avustralya'  },
  { code: '+64',  label: '🇳🇿 Yeni Zelanda'},
];

// ── Ad Soyad Doğrulama Algoritması ───────────────────────────────────────────
// Unicode harf desteği: Türkçe, Arapça, Kiril, Latin genişletilmiş vb.
const NAME_PART_RE = /^[\p{L}][\p{L}\p{M}'\-]{1,}$/u;
// Şüpheli tekrar deseni: aaaaaa, xyzxyzxyz gibi anlamsız diziler
const SUSPICIOUS_RE = /(.)\1{3,}/u;

function validateName(raw) {
  const value = raw.trim();
  if (!value) return 'Ad Soyad alanı zorunludur.';

  const parts = value.split(/\s+/);
  if (parts.length < 2) return 'Lütfen hem adınızı hem soyadınızı girin.';

  for (const part of parts) {
    if (part.length < 2) return `"${part}" çok kısa — en az 2 karakter olmalı.`;
    if (!NAME_PART_RE.test(part)) return `"${part}" geçersiz karakter içeriyor. Sadece harf kullanın.`;
    if (SUSPICIOUS_RE.test(part)) return `"${part}" gerçek bir isim gibi görünmüyor.`;
  }

  // Tüm parçalar sayısal mı? (ör. "123 456")
  if (parts.every(p => /^\d+$/.test(p))) return 'Ad Soyad sayısal olamaz.';

  return ''; // Geçerli
}

// ── GSM Doğrulama ─────────────────────────────────────────────────────────────
function validateGsm(raw) {
  const digits = raw.replace(/\D/g, ''); // Sadece rakamları al
  if (!digits) return 'GSM numarası zorunludur.';
  if (digits.length !== 10) return `GSM 10 hane olmalıdır (şu an ${digits.length} hane).`;
  return ''; // Geçerli
}

function App() {
  // ── Session ──────────────────────────────────────────────────────────────
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 gün (ms)

  const [userData,    setUserData]    = useState(null);
  const [showForm,    setShowForm]    = useState(false);
  const [formMode,    setFormMode]    = useState('register'); // 'register' | 'login'

  // Register form state
  const [formData, setFormData] = useState({
    nameSurname: '',
    gender: '',
    countryCode: '+90',
    gsm: ''
  });

  // Login form state (yalnızca GSM)
  const [loginData, setLoginData] = useState({ countryCode: '+90', gsm: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState('');
  const [fieldErrors,  setFieldErrors]  = useState({ nameSurname: '', gsm: '' });

  // ── Tema ──────────────────────────────────────────────────────────────
  const [selectedThemeKey, setSelectedThemeKey] = useState(
    () => localStorage.getItem('oyun_uygulama_theme') || 'default'
  );

  const muiTheme = useMemo(() => createTheme({
    palette: {
      primary: { main: THEMES[selectedThemeKey]?.muiPrimary || '#fbdf1c' },
      background: { default: THEMES[selectedThemeKey]?.bgApp || '#f1f5f9' },
    },
    typography: { fontFamily: '"Inter", sans-serif' },
  }), [selectedThemeKey]);

  // CSS değişkenlerini tema değişince uygula
  useEffect(() => {
    applyThemeToCss(THEMES[selectedThemeKey] || THEMES.default);
  }, [selectedThemeKey]);

  // İlk yüklemede kaydetli temayı uygula
  useEffect(() => {
    const saved = localStorage.getItem('oyun_uygulama_theme') || 'default';
    applyThemeToCss(THEMES[saved] || THEMES.default);
  }, []);

  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedShape, setSelectedShape] = useState('star');
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [sides, setSides] = useState(5);
  const [slope, setSlope] = useState(50);
  const [isFillEnabled, setIsFillEnabled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [canvasMode, setCanvasMode] = useState('white');

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in a field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 't') {
        setSelectedTool('text');
        setIsPanelOpen(true);
      } else if (key === 'b') {
        setSelectedTool('brush');
      } else if (key === 's') {
        setSelectedTool('shapes');
        setIsPanelOpen(true);
      } else if (key === 'f') {
        setSelectedTool('fill');
      } else if (key === 'z' && (e.ctrlKey || e.metaKey)) {
        // Simple undo trigger could be added here if exposed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger states for Sidebar actions
  const [clearTrigger, setClearTrigger] = useState(0);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [shapeTrigger, setShapeTrigger] = useState(0);


  useEffect(() => {
    const expiryRaw  = localStorage.getItem('oyun_uygulama_expiry');
    const storedUser = localStorage.getItem('oyun_uygulama_user');
    const expiry     = expiryRaw ? parseInt(expiryRaw, 10) : 0;

    if (storedUser && Date.now() < expiry) {
      // Oturum geçerli — formu gösterme
      setUserData(JSON.parse(storedUser));
    } else {
      // Oturum süresi doldu veya hiç yok
      if (storedUser) {
        // Daha önce kayıt olan kullanıcı → login modu
        setFormMode('login');
      } else {
        // Yeni kullanıcı → register modu
        setFormMode('register');
      }
      setShowForm(true);
    }
  }, []);

  // ── Oturum kaydet & yenile ──────────────────────────────────────────────
  const saveSession = (saved) => {
    localStorage.setItem('oyun_uygulama_user',   JSON.stringify(saved));
    localStorage.setItem('oyun_uygulama_expiry', String(Date.now() + SESSION_DURATION));
    localStorage.setItem('oyun_uygulama_theme',  selectedThemeKey);
  };

  // ── Tema Değiştirme ───────────────────────────────────────────────────
  const handleThemeChange = async (key) => {
    setSelectedThemeKey(key);
    localStorage.setItem('oyun_uygulama_theme', key);

    // Kullanıcı giriş yapmışsa Firestore'a da kaydet
    if (userData?.gsm) {
      try {
        const q        = query(collection(db, 'users'), where('gsm', '==', userData.gsm));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await updateDoc(doc(db, 'users', snapshot.docs[0].id), { theme: key, updatedAt: serverTimestamp() });
        }
      } catch (e) { console.warn('Tema kaydedilemedi:', e); }
    }
  };

  // ── Kayıt Formu Submit (Register / Upsert) ─────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateName(formData.nameSurname);
    const gsmErr  = validateGsm(formData.gsm);
    if (nameErr || gsmErr || !formData.gender) {
      setFieldErrors({ nameSurname: nameErr, gsm: gsmErr });
      if (!formData.gender) setSubmitError('Lütfen cinsiyet seçiniz.');
      return;
    }
    setFieldErrors({ nameSurname: '', gsm: '' });
    setSubmitError('');
    setIsSubmitting(true);

    const fullPhone = formData.countryCode + formData.gsm.replace(/\D/g, '');

    try {
      const q        = query(collection(db, 'users'), where('gsm', '==', fullPhone));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Mevcut kayıt — tüm alanları güncelle
        await updateDoc(doc(db, 'users', snapshot.docs[0].id), {
          nameSurname: formData.nameSurname.trim(),
          gender:      formData.gender,
          countryCode: formData.countryCode,
          updatedAt:   serverTimestamp()
        });
      } else {
        // İlk kayıt
        await addDoc(collection(db, 'users'), {
          nameSurname: formData.nameSurname.trim(),
          gender:      formData.gender,
          countryCode: formData.countryCode,
          gsm:         fullPhone,
          createdAt:   serverTimestamp()
        });
      }

      const saved = { ...formData, gsm: fullPhone };
      saveSession(saved);
      setUserData(saved);
      setShowForm(false);
    } catch (err) {
      console.error('Firebase kayıt hatası:', err);
      setSubmitError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Giriş Formu Submit (Login) ──────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const gsmErr = validateGsm(loginData.gsm);
    if (gsmErr) { setSubmitError(gsmErr); return; }
    setSubmitError('');
    setIsSubmitting(true);

    const fullPhone = loginData.countryCode + loginData.gsm.replace(/\D/g, '');

    try {
      const q        = query(collection(db, 'users'), where('gsm', '==', fullPhone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setSubmitError('Bu numara ile kayıt bulunamadı. Lütfen kayıt olun.');
        return;
      }

      // Kullanıcı bulundu — updatedAt güncelle, oturumu başlat
      const existingDoc  = snapshot.docs[0];
      const existingData = existingDoc.data();
      await updateDoc(doc(db, 'users', existingDoc.id), { updatedAt: serverTimestamp() });

      // Kaydedilmiş temayı geri yükle
      const savedTheme = existingData.theme || 'default';
      setSelectedThemeKey(savedTheme);
      localStorage.setItem('oyun_uygulama_theme', savedTheme);
      applyThemeToCss(THEMES[savedTheme] || THEMES.default);

      const saved = {
        nameSurname: existingData.nameSurname,
        gender:      existingData.gender,
        countryCode: existingData.countryCode,
        gsm:         fullPhone
      };
      saveSession(saved);
      setUserData(saved);
      setShowForm(false);
    } catch (err) {
      console.error('Firebase giriş hatası:', err);
      setSubmitError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNew = () => setClearTrigger(prev => prev + 1);
  const handleSave = () => {
    setSaveTrigger(prev => prev + 1);
  };

  const toggleCanvasMode = () => {
    setCanvasMode(prev => prev === 'white' ? 'grid' : prev === 'grid' ? 'lines' : 'white');
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', maxWidth: '100%', backgroundColor: THEMES[selectedThemeKey]?.bgApp || '#f1f5f9', overflow: 'hidden' }}>
        
        <Sidebar 
          selectedTool={selectedTool} 
          setSelectedTool={setSelectedTool}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
          handleNew={handleNew}
          handleSave={handleSave}
          toggleCanvasMode={toggleCanvasMode}
          THEMES={THEMES}
          selectedThemeKey={selectedThemeKey}
          handleThemeChange={handleThemeChange}
        />

        {isPanelOpen && (
          <ContextPanel 
            selectedTool={selectedTool}
            selectedShape={selectedShape}
            setSelectedShape={setSelectedShape}
            selectedColor={selectedColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            sides={sides}
            setSides={setSides}
            slope={slope}
            setSlope={setSlope}
            isFillEnabled={isFillEnabled}
            setIsFillEnabled={setIsFillEnabled}
            setIsPanelOpen={setIsPanelOpen}
            setShapeTrigger={setShapeTrigger}
          />
        )}

        <Box className="main-content">
          <header className="app-header">
            <Box>
                <Typography variant="h6" className="gradient-text">
                    OyunUygulaması <span style={{ color: '#64748b', fontSize: '0.8rem' }}>v2.0 PRO</span>
                </Typography>
                {userData && (
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', display: 'block' }}>
                      {userData.nameSurname.toUpperCase()}
                  </Typography>
                )}
            </Box>

            {/* Tema Seçici kaldırıldı (Sidebar'a taşındı) */}

            {/* Global Color Palette in Header */}
            <Box className="color-palette">
                <Typography variant="caption" sx={{ fontWeight: 700, mr: 1, color: '#64748b' }} className="palette-label">RENK PALETİ:</Typography>
                <Box className="palette-colors">
                  {colors.map(color => (
                      <Tooltip key={color} title={color} TransitionComponent={Zoom}>
                          <div 
                              onClick={() => setSelectedColor(color)}
                              className={`palette-color ${selectedColor === color ? 'active' : ''}`}
                              style={{ backgroundColor: color }}
                          />
                      </Tooltip>
                  ))}
                  <Tooltip title="Kendi Rengini Seç" TransitionComponent={Zoom}>
                      <div className={`palette-color ${!colors.includes(selectedColor) ? 'active' : ''}`} 
                           style={{ 
                               background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                               position: 'relative',
                               overflow: 'hidden'
                           }}>
                          <input 
                              type="color" 
                              value={!colors.includes(selectedColor) ? selectedColor : '#ffffff'} 
                              onChange={(e) => setSelectedColor(e.target.value)} 
                              style={{
                                  position: 'absolute',
                                  opacity: 0,
                                  width: '200%',
                                  height: '200%',
                                  top: '-50%',
                                  left: '-50%',
                                  cursor: 'pointer'
                              }}
                          />
                      </div>
                  </Tooltip>
                </Box>
            </Box>
          </header>

          <Box className="canvas-area-wrapper">
            <ErrorBoundary>
              <CanvasBoard 
                selectedTool={selectedTool} 
                selectedShape={selectedShape}
                selectedColor={selectedColor}
                brushSize={brushSize}
                sides={sides}
                slope={slope}
                isFillEnabled={isFillEnabled}
                canvasMode={canvasMode}
                clearTrigger={clearTrigger}
                saveTrigger={saveTrigger}
                shapeTrigger={shapeTrigger}
                setIsPanelOpen={setIsPanelOpen}
              />
            </ErrorBoundary>
          </Box>
        </Box>



        {/* Auth Dialog — Register veya Login modu */}
        <Dialog open={showForm} disableEscapeKeyDown PaperProps={{ sx: { borderRadius: 3, minWidth: 380 } }}>

          {formMode === 'register' ? (
            /* ═══════════════ KAYIT FORMU ═══════════════ */
            <>
              <DialogTitle sx={{ pb: 0 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
                  Kayıt Ol ve Başla 🎨
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#64748b', mt: 0.5 }}>
                  Bilgilerini girerek boyama alanına geç
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

                  <TextField
                    label="Ad Soyad" variant="outlined" fullWidth
                    placeholder="Ahmet Yılmaz"
                    value={formData.nameSurname}
                    error={!!fieldErrors.nameSurname}
                    helperText={fieldErrors.nameSurname || 'Türkçe veya yabancı ad – en az 2 kelime'}
                    onChange={(e) => {
                      setFormData({ ...formData, nameSurname: e.target.value });
                      setFieldErrors(prev => ({ ...prev, nameSurname: validateName(e.target.value) }));
                    }}
                  />

                  <FormControl fullWidth error={!formData.gender && !!submitError}>
                    <InputLabel>Cinsiyet</InputLabel>
                    <Select
                      value={formData.gender} label="Cinsiyet"
                      onChange={(e) => { setFormData({ ...formData, gender: e.target.value }); setSubmitError(''); }}
                    >
                      <MenuItem value="Erkek">Erkek</MenuItem>
                      <MenuItem value="Kız">Kız</MenuItem>
                      <MenuItem value="Belirtilmemiş">Belirtmek İstemiyorum</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <FormControl sx={{ minWidth: 155 }}>
                      <InputLabel>Ülke</InputLabel>
                      <Select
                        value={formData.countryCode} label="Ülke"
                        MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      >
                        {COUNTRY_CODES.map(({ code, label }) => (
                          <MenuItem key={label} value={code}>
                            <Typography variant="body2">{label}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="GSM (10 hane)" variant="outlined" fullWidth
                      placeholder="5xx xxx xx xx"
                      value={formData.gsm}
                      error={!!fieldErrors.gsm}
                      helperText={fieldErrors.gsm || `${formData.gsm.replace(/\D/g,'').length}/10 hane`}
                      inputProps={{ maxLength: 14, inputMode: 'numeric' }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d\s\-]/g, '');
                        setFormData({ ...formData, gsm: raw });
                        setFieldErrors(prev => ({ ...prev, gsm: validateGsm(raw) }));
                      }}
                    />
                  </Box>

                  {submitError && <Alert severity="error" sx={{ py: 0.5 }}>{submitError}</Alert>}

                  <Button type="submit" variant="contained" size="large" disabled={isSubmitting}
                    sx={{ py: 1.5, mt: 0.5, background: 'linear-gradient(135deg, #1e1e2e, #2b2d42)', color: 'white',
                      fontWeight: 700, borderRadius: 2,
                      '&:hover': { background: '#fbdf1c', color: '#1e1e2e' },
                      '&.Mui-disabled': { background: '#94a3b8', color: 'white' } }}
                  >
                    {isSubmitting ? <><CircularProgress size={18} sx={{ color: 'white', mr: 1 }} /> Kaydediliyor...</> : 'Boyamaya Başla! 🚀'}
                  </Button>

                  <Typography variant="caption" align="center" sx={{ color: '#94a3b8', mt: -1 }}>
                    Zaten kayıtlı mısın?{' '}
                    <Box component="span"
                      onClick={() => { setFormMode('login'); setSubmitError(''); }}
                      sx={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    >Giriş Yap</Box>
                  </Typography>
                </Box>
              </DialogContent>
            </>
          ) : (
            /* ═══════════════ GİRİŞ FORMU ═══════════════ */
            <>
              <DialogTitle sx={{ pb: 0 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
                  Tekrar Hoş Geldin! 👋
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#64748b', mt: 0.5 }}>
                  GSM numaranla giriş yap
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <FormControl sx={{ minWidth: 155 }}>
                      <InputLabel>Ülke</InputLabel>
                      <Select
                        value={loginData.countryCode} label="Ülke"
                        MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
                        onChange={(e) => setLoginData({ ...loginData, countryCode: e.target.value })}
                      >
                        {COUNTRY_CODES.map(({ code, label }) => (
                          <MenuItem key={label} value={code}>
                            <Typography variant="body2">{label}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="GSM (10 hane)" variant="outlined" fullWidth
                      placeholder="5xx xxx xx xx"
                      value={loginData.gsm}
                      helperText={`${loginData.gsm.replace(/\D/g,'').length}/10 hane`}
                      inputProps={{ maxLength: 14, inputMode: 'numeric' }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d\s\-]/g, '');
                        setLoginData({ ...loginData, gsm: raw });
                        setSubmitError('');
                      }}
                    />
                  </Box>

                  {submitError && <Alert severity="error" sx={{ py: 0.5 }}>{submitError}</Alert>}

                  <Button type="submit" variant="contained" size="large" disabled={isSubmitting}
                    sx={{ py: 1.5, mt: 0.5, background: 'linear-gradient(135deg, #1e1e2e, #2b2d42)', color: 'white',
                      fontWeight: 700, borderRadius: 2,
                      '&:hover': { background: '#fbdf1c', color: '#1e1e2e' },
                      '&.Mui-disabled': { background: '#94a3b8', color: 'white' } }}
                  >
                    {isSubmitting ? <><CircularProgress size={18} sx={{ color: 'white', mr: 1 }} /> Kontrol ediliyor...</> : 'Giriş Yap 🔓'}
                  </Button>

                  <Typography variant="caption" align="center" sx={{ color: '#94a3b8', mt: -1 }}>
                    Yeni kullanıcı mısın?{' '}
                    <Box component="span"
                      onClick={() => { setFormMode('register'); setSubmitError(''); }}
                      sx={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    >Kayıt Ol</Box>
                  </Typography>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
