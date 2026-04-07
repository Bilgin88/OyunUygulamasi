import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, Tooltip, Zoom } from '@mui/material';
import './index.css';
import CanvasBoard from './components/CanvasBoard';
import Sidebar from './components/Sidebar';
import ContextPanel from './components/ContextPanel';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fbdf1c', // Pro Yellow
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});

const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#A855F7', '#EC4899', 
    '#FFFFFF', '#94A3B8', '#1E293B', '#8b4513'
];

function App() {
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nameSurname: '',
    gender: '',
    gsm: ''
  });

  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedShape, setSelectedShape] = useState('star');
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [sides, setSides] = useState(5);
  const [slope, setSlope] = useState(50);
  const [isFillEnabled, setIsFillEnabled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
    const storedUser = localStorage.getItem('oyun_uygulama_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      setShowForm(true);
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.nameSurname && formData.gender && formData.gsm) {
      localStorage.setItem('oyun_uygulama_user', JSON.stringify(formData));
      setUserData(formData);
      setShowForm(false);
    }
  };

  const handleNew = () => setClearTrigger(prev => prev + 1);
  const handleSave = () => setSaveTrigger(prev => prev + 1);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', maxWidth: '100%', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
        
        <Sidebar 
          selectedTool={selectedTool} 
          setSelectedTool={setSelectedTool}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
          handleNew={handleNew}
          handleSave={handleSave}
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
            <CanvasBoard 
              selectedTool={selectedTool} 
              selectedShape={selectedShape}
              selectedColor={selectedColor}
              brushSize={brushSize}
              sides={sides}
              slope={slope}
              isFillEnabled={isFillEnabled}
              clearTrigger={clearTrigger}
              saveTrigger={saveTrigger}
              shapeTrigger={shapeTrigger}
              setIsPanelOpen={setIsPanelOpen}
            />
          </Box>
        </Box>



        {/* User Registration Dialog */}
        <Dialog open={showForm} disableEscapeKeyDown>
          <DialogTitle>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
              Kayıt Ol ve Başla 🎨
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: '300px' }}>
              <TextField
                label="Ad Soyad" variant="outlined" required fullWidth
                value={formData.nameSurname}
                onChange={(e) => setFormData({ ...formData, nameSurname: e.target.value })}
              />
              <FormControl fullWidth required>
                <InputLabel>Cinsiyet</InputLabel>
                <Select
                  value={formData.gender} label="Cinsiyet"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="Erkek">Erkek</MenuItem>
                  <MenuItem value="Kız">Kız</MenuItem>
                  <MenuItem value="Belirtilmemiş">Belirtmek İstemiyorum</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="GSM" variant="outlined" required fullWidth placeholder="05xx xxx xx xx"
                value={formData.gsm}
                onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
              />
              <Button 
                type="submit" variant="contained" size="large" 
                sx={{ 
                  py: 1.5,
                  background: 'linear-gradient(135deg, #1e1e2e, #2b2d42)',
                  color: 'white',
                  '&:hover': {
                    background: '#fbdf1c',
                    color: '#1e1e2e'
                  }
                }}
              >
                Boyamaya Başla!
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
