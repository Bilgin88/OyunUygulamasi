import React from 'react';
import { Paper, Box, IconButton, Slider, Typography, Tooltip, Zoom } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

const colors = [
  '#f43f5e', // rose-500
  '#ec4899', // pink-500
  '#d946ef', // fuchsia-500
  '#a855f7', // purple-500
  '#6366f1', // indigo-500
  '#3b82f6', // blue-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#84cc16', // lime-500
  '#eab308', // yellow-500
  '#f97316', // orange-500
  '#ef4444', // red-500
  '#000000', // black
  '#ffffff', // white
];

const Toolbar = ({ selectedTool, setSelectedTool, selectedColor, setSelectedColor, brushSize, setBrushSize }) => {
  return (
    <Paper elevation={10} className="glass toolbar-container" sx={{ 
      borderRadius: 10,
      p: 2,
      display: 'flex',
      gap: 3,
      backdropFilter: 'blur(20px)',
      background: 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
      }
    }}>
      {/* Tool Selection */}
      <Box sx={{ display: 'flex', gap: 1, borderRight: '1px solid #e2e8f0', pr: 2 }}>
        <Tooltip title="Fırça" placement="top" TransitionComponent={Zoom}>
          <IconButton 
            color={selectedTool === 'brush' ? 'primary' : 'default'} 
            onClick={() => setSelectedTool('brush')}
            sx={{ scale: selectedTool === 'brush' ? '1.2' : '1' }}
          >
            <BrushIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Dolgu" placement="top" TransitionComponent={Zoom}>
          <IconButton 
            color={selectedTool === 'fill' ? 'primary' : 'default'} 
            onClick={() => setSelectedTool('fill')}
            sx={{ scale: selectedTool === 'fill' ? '1.2' : '1' }}
          >
            <FormatColorFillIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Color Palette */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: '400px', justifyContent: 'center' }}>
        {colors.map((color) => (
          <Tooltip key={color} title={color} TransitionComponent={Zoom}>
            <div 
              className={`color-dot ${selectedColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          </Tooltip>
        ))}
      </Box>

      {/* Brush Size */}
      <Box sx={{ minWidth: '150px', display: 'flex', flexDirection: 'column', gap: 1, borderLeft: '1px solid #e2e8f0', pl: 3 }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
          FIRÇA BOYUTU: {brushSize}
        </Typography>
        <Slider
          value={brushSize}
          min={1}
          max={50}
          onChange={(e, newValue) => setBrushSize(newValue)}
          valueLabelDisplay="auto"
          sx={{ color: '#6366f1' }}
        />
      </Box>
    </Paper>
  );
};

export default Toolbar;
