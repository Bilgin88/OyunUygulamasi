import React from 'react';
import { Box, Typography, Slider, Switch, FormControlLabel, Select, MenuItem, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SquareIcon from '@mui/icons-material/Square';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory'; // Triangle
import CircleIcon from '@mui/icons-material/Circle';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Heart

const ContextPanel = ({ 
  selectedTool, 
  selectedShape, 
  setSelectedShape,
  selectedColor,
  setSelectedColor,
  brushSize,
  setBrushSize,
  sides,
  setSides,
  slope,
  setSlope,
  isFillEnabled,
  setIsFillEnabled,
  setIsPanelOpen,
  setShapeTrigger,
  onTextClick
}) => {
  const shapes = [
    { id: 'square', label: 'Kare', icon: <SquareIcon /> },
    { id: 'rect', label: 'Dikdörtgen', icon: '▭' },
    { id: 'triangle', label: 'Üçgen', icon: <ChangeHistoryIcon /> },
    { id: 'star', label: 'Yıldız', icon: <StarIcon /> },
    { id: 'circle', label: 'Daire', icon: <CircleIcon /> },
    { id: 'heart', label: 'Kalp', icon: <FavoriteIcon /> },
    { id: 'cat', label: 'Kedi', icon: '🐱' },
    { id: 'dog', label: 'Köpek', icon: '🐶' },
    { id: 'rabbit', label: 'Tavşan', icon: '🐰' },
    { id: 'horse', label: 'At', icon: '🐴' },
    { id: 'house', label: 'Ev', icon: '🏠' },
  ];

  const stickers = [
    { id: 'smile', label: 'Gülen Yüz', icon: '😊' },
    { id: 'cool', label: 'Havalı', icon: '😎' },
    { id: 'love', label: 'Aşık', icon: '😍' },
    { id: 'rock', label: 'Rock', icon: '🤘' },
    { id: 'fire', label: 'Ateş', icon: '🔥' },
    { id: 'star_eye', label: 'Yıldız Göz', icon: '🤩' },
    { id: 'rocket', label: 'Roket', icon: '🚀' },
    { id: 'ghost', label: 'Hayalet', icon: '👻' },
    { id: 'alien', label: 'Uzaylı', icon: '👽' },
    { id: 'clown', label: 'Palyaço', icon: '🤡' },
    { id: 'unicorn', label: 'Tekboynuz', icon: '🦄' },
    { id: 'pizza', label: 'Pizza', icon: '🍕' },
    { id: 'birthday', label: 'Pasta', icon: '🎂' },
    { id: 'ball', label: 'Futbol', icon: '⚽' },
    { id: 'sun', label: 'Güneş', icon: '☀️' },
    { id: 'moon', label: 'Ay', icon: '🌙' },
    { id: 'cloud', label: 'Bulut', icon: '☁️' },
    { id: 'rainbow', label: 'Gökkuşağı', icon: '🌈' },
  ];

  const cars = [
    { id: '/assets/cars/megane.png', label: 'Renault Megane', icon: '🚗' },
    { id: '/assets/cars/doblo.png', label: 'Fiat Doblo', icon: '🚐' },
    { id: '/assets/cars/toyota.png', label: 'Toyota Corolla', icon: '🚘' },
    { id: '/assets/cars/ferrari.png', label: 'Ferrari', icon: '🏎️' },
    { id: '/assets/cars/volvo.png', label: 'Volvo XC90', icon: '🚙' },
    { id: '/assets/cars/porsche.png', label: 'Porsche 911', icon: '🏎️' },
    { id: '/assets/cars/jeep.png', label: 'Jeep Wrangler', icon: '🚜' },
  ];

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'
  ];

  if (selectedTool !== 'shapes' && selectedTool !== 'brush' && selectedTool !== 'stickers' && selectedTool !== 'cars') return null;

  return (
    <>
      <div className="context-panel">
        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedTool === 'shapes' && <StarIcon sx={{ fontSize: 18 }} />}
          {selectedTool === 'brush' && <StarIcon sx={{ fontSize: 18 }} />}
          {selectedTool === 'stickers' && '⚽'} 
          {selectedTool === 'cars' && '🚗'}
          {selectedTool === 'shapes' ? 'Şekil Ayarları' : selectedTool === 'brush' ? 'Fırça Ayarları' : selectedTool === 'cars' ? 'Araba Seçenekleri' : 'Çıkartma Ayarları'}
        </Typography>

        <Divider sx={{ mb: 2, opacity: 0.1, backgroundColor: 'white' }} />

        {selectedTool !== 'stickers' && (
             <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ opacity: 0.7, mb: 1, display: 'block' }}>
                {selectedTool === 'shapes' ? 'Çizgi Kalınlığı' : 'Yazı Boyutu'}: {brushSize}px
                </Typography>
                <Slider 
                size="small" value={brushSize} min={1} max={100} 
                onChange={(e, val) => setBrushSize(val)}
                sx={{ color: '#fbdf1c' }}
                />
            </Box>
        )}

        {selectedTool === 'shapes' && (
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Switch checked={isFillEnabled} onChange={(e) => setIsFillEnabled(e.target.checked)} size="small" />}
              label={<Typography variant="caption">Dolgu Uygula</Typography>}
              sx={{ color: 'white' }}
            />
          </Box>
        )}

        {selectedTool === 'shapes' && (
            <>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, mb: 1, display: 'block' }}>Açı / Kenar Sayısı: {sides}</Typography>
                    <Slider 
                        size="small" value={sides} min={3} max={20} 
                        onChange={(e, val) => setSides(val)}
                        sx={{ color: '#fbdf1c' }}
                    />
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, mb: 1, display: 'block' }}>Eğim: {slope}%</Typography>
                    <Slider 
                        size="small" value={slope} min={0} max={100} 
                        onChange={(e, val) => setSlope(val)}
                        sx={{ color: '#fbdf1c' }}
                    />
                </Box>
            </>
        )}
      </div>

      {(selectedTool === 'shapes' || selectedTool === 'stickers' || selectedTool === 'cars') && (
        <div className="shapes-list">
          <Typography variant="overline" sx={{ px: 1, mb: 1, opacity: 0.5, display: 'block' }}>
            {selectedTool === 'shapes' ? 'TÜM ŞEKİLLER' : selectedTool === 'stickers' ? 'ÇIKARTMALAR' : 'ARABALAR'}
          </Typography>
          {(selectedTool === 'shapes' ? shapes : selectedTool === 'stickers' ? stickers : cars).map(item => (
            <div 
              key={item.id} 
              className={`shape-item ${(selectedShape === item.id || selectedShape === item.icon) ? 'active' : ''}`}
              onClick={() => {
                setSelectedShape(selectedTool === 'stickers' ? item.icon : item.id);
                setShapeTrigger(prev => prev + 1);
                setIsPanelOpen(false);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, fontSize: selectedTool === 'stickers' ? '1.2rem' : 'inherit' }}>
                {selectedTool === 'cars' && typeof item.icon === 'string' && item.id.startsWith('/') ? <img src={item.id} style={{ width: '20px' }} alt={item.label} /> : item.icon}
              </div>
              <Typography variant="body2">{item.label}</Typography>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ContextPanel;
