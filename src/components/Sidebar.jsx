import React from 'react';
import { Tooltip, Zoom } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe'; // Select
import CropIcon from '@mui/icons-material/Crop'; // Crop
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

const Sidebar = ({ selectedTool, setSelectedTool, isPanelOpen, setIsPanelOpen, handleNew, handleSave, toggleCanvasMode }) => {
  const tools = [
    { id: 'select', icon: <NearMeIcon />, label: 'Seç' },
    { id: 'crop', icon: <CropIcon />, label: 'Kırp' },
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
    </div>
  );
};

export default Sidebar;
