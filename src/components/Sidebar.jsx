import React, { useState } from 'react';
import { Tooltip, Zoom, Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe'; // Select
import PaletteIcon from '@mui/icons-material/Palette'; // Theme
import CreateIcon from '@mui/icons-material/Create'; // Pencil
import StarIcon from '@mui/icons-material/Star'; // Shapes
import MoodIcon from '@mui/icons-material/Mood'; // Stickers
import TitleIcon from '@mui/icons-material/Title'; // Text
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'; // Fill
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import GridOnIcon from '@mui/icons-material/GridOn';
import HelpIcon from '@mui/icons-material/Help';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Sidebar = ({ selectedTool, setSelectedTool, isPanelOpen, setIsPanelOpen, handleNew, handleSave, toggleCanvasMode, THEMES, selectedThemeKey, handleThemeChange }) => {
  const [themeDbOpen, setThemeDbOpen] = useState(false);

  const tools = [
    { id: 'select', icon: <NearMeIcon />, label: 'Seç' },
    { id: 'theme', icon: <PaletteIcon />, label: 'Tema Seçici' },
    { id: 'brush', icon: <CreateIcon />, label: 'Fırça' },
    { id: 'shapes', icon: <StarIcon />, label: 'Şekiller' },
    { id: 'stickers', icon: <MoodIcon />, label: 'Çıkartmalar' },
    { id: 'cars', icon: <DirectionsCarIcon />, label: 'Arabalar' },
    { id: 'mosques', icon: '🕌', label: 'Camiler' },
    { id: 'ai', icon: <AutoAwesomeIcon />, label: 'Yapay Zeka' },
    { id: 'text', icon: <TitleIcon />, label: 'Metin' },
    { id: 'fill', icon: <FormatColorFillIcon />, label: 'Dolgu' },
  ];



  const handleToolClick = (id) => {
    if (id === 'theme') {
      setThemeDbOpen(true);
      return;
    }
    
    if (selectedTool === id) {
      setIsPanelOpen(!isPanelOpen);
    } else {
      setSelectedTool(id);
      // Auto-open panel for tools with lists (shapes, stickers, cars, mosques, ai), 
      // but keep it closed for drawing (brush) to keep screen clear.
      if (['shapes', 'stickers', 'cars', 'mosques', 'ai'].includes(id)) {
        setIsPanelOpen(true);
      } else {
        setIsPanelOpen(false);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tools">
        <div style={{ marginBottom: '1rem', color: '#fbdf1c', fontWeight: 'bold', fontSize: '1.2rem' }}>🎨</div>
        {tools.map((tool) => (
          <Tooltip key={tool.id} title={tool.label} placement="right" TransitionComponent={Zoom}>
            <div 
              className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolClick(tool.id)}
            >
              {tool.icon}
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="sidebar-bottom">
        <Tooltip title="Yeni Sayfa" placement="right" TransitionComponent={Zoom}>
          <div className="tool-button" onClick={handleNew}>
            <AddIcon />
          </div>
        </Tooltip>
        <Tooltip title="Kaydet (PC'ye İndir)" placement="right" TransitionComponent={Zoom}>
          <div className="tool-button" onClick={handleSave}>
            <SaveIcon />
          </div>
        </Tooltip>
        <Tooltip title="Zemin Modunu Değiştir (Kareli/Çizgili)" placement="right" TransitionComponent={Zoom}>
          <div className="tool-button" onClick={toggleCanvasMode}>
            <GridOnIcon />
          </div>
        </Tooltip>
        <Tooltip title="Yardım" placement="right" TransitionComponent={Zoom}>
          <div className="tool-button">
            <HelpIcon />
          </div>
        </Tooltip>
      </div>

      <Dialog open={themeDbOpen} onClose={() => setThemeDbOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ pb: 1, textAlign: 'center', fontWeight: 'bold' }}>Tema Seç</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', pt: 1 }}>
            {THEMES && Object.entries(THEMES).map(([key, t]) => (
              <Tooltip key={key} title={t.label} TransitionComponent={Zoom}>
                <Box
                  onClick={() => { handleThemeChange(key); setThemeDbOpen(false); }}
                  sx={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: t.primary,
                    cursor: 'pointer',
                    border: selectedThemeKey === key ? `4px solid ${t.bgSidebar}` : '2px solid #e2e8f0',
                    boxShadow: selectedThemeKey === key ? `0 0 0 3px ${t.primary}` : 'none',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
