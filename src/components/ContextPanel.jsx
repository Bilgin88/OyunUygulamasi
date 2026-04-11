import React, { useState } from 'react';
import { Box, Typography, Slider, Switch, FormControlLabel, Select, MenuItem, Divider, TextField, Button, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const emojiMap = {
    'kedi': '🐱', 'cat': '🐱', 'köpek': '🐶', 'kopek': '🐶', 'dog': '🐶',
    'at': '🐴', 'horse': '🐴', 'inek': '🐄', 'cow': '🐄', 'tavuk': '🐔', 'chicken': '🐔',
    'ördek': '🦆', 'ordek': '🦆', 'duck': '🦆', 'tavşan': '🐰', 'tavsan': '🐰', 'rabbit': '🐰',
    'ayı': '🐻', 'ayi': '🐻', 'bear': '🐻', 'kaplan': '🐯', 'tiger': '🐯',
    'aslan': '🦁', 'lion': '🦁', 'fil': '🐘', 'elephant': '🐘',
    'zürafa': '🦒', 'zurafa': '🦒', 'giraffe': '🦒', 'maymun': '🐵', 'monkey': '🐵',
    'penguen': '🐧', 'penguin': '🐧', 'kaplumbağa': '🐢', 'kaplumbaga': '🐢', 'turtle': '🐢',
    'balık': '🐟', 'balik': '🐟', 'fish': '🐟', 'yunus': '🐬', 'dolphin': '🐬',
    'balina': '🐳', 'whale': '🐳', 'köpekbalığı': '🦈', 'shark': '🦈',
    'kartal': '🦅', 'eagle': '🦅', 'baykuş': '🦉', 'baykus': '🦉', 'owl': '🦉',
    'papağan': '🦜', 'papagan': '🦜', 'parrot': '🦜', 'yılan': '🐍', 'yilan': '🐍', 'snake': '🐍',
    'kurbağa': '🐸', 'kurbaga': '🐸', 'frog': '🐸', 'arı': '🐝', 'ari': '🐝', 'bee': '🐝',
    'kelebek': '🦋', 'butterfly': '🦋', 'örümcek': '🕷️', 'orumcek': '🕷️', 'spider': '🕷️',
    'ejderha': '🐲', 'dragon': '🐲', 'unicorn': '🦄', 'kirpi': '🦔', 'hedgehog': '🦔',
    'sincap': '🐿️', 'squirrel': '🐿️', 'tilki': '🦊', 'fox': '🦊', 'kurt': '🐺', 'wolf': '🐺',
    'panda': '🐼', 'domuz': '🐷', 'pig': '🐷', 'koala': '🐨', 'kanguru': '🦘', 'kangaroo': '🦘',
    'araba': '🚗', 'car': '🚗',
    'uçak': '✈️', 'ucak': '✈️', 'airplane': '✈️', 'plane': '✈️',
    'yolcu uçağı': '✈️', 'yolcu ucagi': '✈️', 'passenger airplane': '✈️',
    'helikopter': '🚁', 'helicopter': '🚁', 'roket': '🚀', 'rocket': '🚀',
    'gemi': '🚢', 'ship': '🚢', 'tren': '🚂', 'train': '🚂',
    'otobüs': '🚌', 'otobus': '🚌', 'bus': '🚌', 'kamyon': '🚛', 'truck': '🚛',
    'bisiklet': '🚲', 'bicycle': '🚲', 'motosiklet': '🏍️', 'motorcycle': '🏍️',
    'ambulans': '🚑', 'ambulance': '🚑', 'itfaiye': '🚒', 'fire truck': '🚒',
    'polis': '🚔', 'police': '🚔', 'taksi': '🚕', 'taxi': '🚕',
    'uzay gemisi': '🛸', 'spaceship': '🛸', 'ufo': '🛸',
    'güneş': '☀️', 'gunes': '☀️', 'sun': '☀️',
    'ay': '🌙', 'moon': '🌙', 'yıldız': '⭐', 'yildiz': '⭐', 'star': '⭐',
    'ağaç': '🌳', 'agac': '🌳', 'tree': '🌳', 'çiçek': '🌸', 'cicek': '🌸', 'flower': '🌸',
    'lale': '🌷', 'tulip': '🌷', 'gül': '🌹', 'rose': '🌹',
    'gökkuşağı': '🌈', 'gokkusagi': '🌈', 'rainbow': '🌈', 'bulut': '☁️', 'cloud': '☁️',
    'yağmur': '🌧️', 'yagmur': '🌧️', 'rain': '🌧️', 'kar': '❄️', 'snow': '❄️',
    'şimşek': '⚡', 'simsek': '⚡', 'lightning': '⚡', 'dağ': '⛰️', 'dag': '⛰️', 'mountain': '⛰️',
    'volkan': '🌋', 'volcano': '🌋', 'deniz': '🌊', 'sea': '🌊', 'ocean': '🌊',
    'orman': '🌲', 'forest': '🌲', 'mantar': '🍄', 'mushroom': '🍄',
    'elma': '🍎', 'apple': '🍎', 'muz': '🍌', 'banana': '🍌',
    'çilek': '🍓', 'cilek': '🍓', 'strawberry': '🍓', 'üzüm': '🍇', 'uzum': '🍇', 'grapes': '🍇',
    'portakal': '🍊', 'orange': '🍊', 'pizza': '🍕', 'hamburger': '🍔',
    'dondurma': '🍦', 'ice cream': '🍦', 'pasta': '🎂', 'cake': '🎂',
    'ekmek': '🍞', 'bread': '🍞', 'çikolata': '🍫', 'cikolata': '🍫', 'chocolate': '🍫',
    'şeker': '🍬', 'seker': '🍬', 'candy': '🍬',
    'ev': '🏠', 'house': '🏠', 'kale': '🏰', 'castle': '🏰', 'şato': '🏰', 'sato': '🏰',
    'köprü': '🌉', 'kopru': '🌉', 'bridge': '🌉', 'okul': '🏫', 'school': '🏫',
    'hastane': '🏥', 'hospital': '🏥', 'cami': '🕌', 'mosque': '🕌',
    'kilise': '⛪', 'church': '⛪',
    'kalp': '❤️', 'heart': '❤️', 'robot': '🤖',
    'astronot': '👨‍🚀', 'astronaut': '👨‍🚀', 'peri': '🧚', 'fairy': '🧚',
    'denizkızı': '🧜', 'mermaid': '🧜', 'kahraman': '🦸', 'superhero': '🦸',
    'balon': '🎈', 'balloon': '🎈', 'hediye': '🎁', 'gift': '🎁',
    'top': '⚽', 'ball': '⚽', 'futbol': '⚽', 'football': '⚽',
    'gitar': '🎸', 'guitar': '🎸', 'piyano': '🎹', 'piano': '🎹',
    'kalem': '✏️', 'pencil': '✏️', 'kitap': '📚', 'book': '📚',
    'saat': '⏰', 'clock': '⏰', 'anahtar': '🔑', 'key': '🔑',
    'ateş': '🔥', 'ates': '🔥', 'fire': '🔥',
    'taç': '👑', 'tac': '👑', 'crown': '👑', 'elmas': '💎', 'diamond': '💎',
    // İnsanlar ve figürler
    'çocuk': '👧', 'cocuk': '👧', 'child': '👧', 'kid': '👧',
    'bebek': '👶', 'baby': '👶',
    'adam': '🧑', 'man': '👨', 'kadın': '👩', 'kadin': '👩', 'woman': '👩',
    'aile': '👨‍👩‍👧', 'family': '👨‍👩‍👧',
    'prenses': '👸', 'princess': '👸',
    'prens': '🤴', 'prince': '🤴',
    'dede': '👴', 'grandfather': '👴', 'grandpa': '👴', 'büyükbaba': '👴',
    'nine': '👵', 'grandmother': '👵', 'grandma': '👵', 'büyükanne': '👵',
    'kral': '🤴', 'king': '🤴', 'kraliçe': '👸', 'queen': '👸',
    'süpermen': '🦸', 'superman': '🦸', 'süper kahraman': '🦸',
    'ninja': '🥷', 'viking': '⚔️',
    'kovboy': '🤠', 'cowboy': '🤠',
    'spiderman': '🕷️', 'batman': '🦇',
    // Daha fazla hayvan
    'jaguar': '🐆', 'leopar': '🐆', 'leopard': '🐆', 'çita': '🐆', 'cheetah': '🐆',
    'gergedan': '🦏', 'rhinoceros': '🦏', 'rhino': '🦏',
    'su aygırı': '🦛', 'hippo': '🦛', 'hippopotamus': '🦛',
    'deve': '🐫', 'camel': '🐫',
    'lama': '🦙', 'llama': '🦙',
    'zebra': '🦓',
    'flamingo': '🦩',
    'pelikan': '🦤',
    'leylek': '🐦', 'stork': '🐦',
    'kazayağı': '🦢', 'kuğu': '🦢', 'swan': '🦢',
    'tavuskuşu': '🦚', 'peacock': '🦚',
    'papağan': '🦜', 'parrot': '🦜',
    'ahtapot': '🐙', 'octopus': '🐙',
    'yengeç': '🦀', 'crab': '🦀',
    'ıstakoz': '🦞', 'lobster': '🦞',
    'karides': '🦐', 'shrimp': '🦐',
    'midye': '🦪', 'oyster': '🦪',
    'salyangoz': '🐌', 'snail': '🐌',
    'solucan': '🪱', 'worm': '🪱',
    'uğur böceği': '🐞', 'ladybug': '🐞',
    'çekirge': '🦗', 'grasshopper': '🦗', 'cricket': '🦗',
    'sivrisinek': '🦟', 'mosquito': '🦟',
    'karınca': '🐜', 'karinca': '🐜', 'ant': '🐜',
    // Objeler
    'ampul': '💡', 'ampül': '💡', 'lightbulb': '💡', 'light bulb': '💡',
    'mum': '🕯️', 'candle': '🕯️',
    'şemsiye': '☂️', 'semsiye': '☂️', 'umbrella': '☂️',
    'çanta': '👜', 'canta': '👜', 'bag': '👜',
    'gözlük': '👓', 'gozluk': '👓', 'glasses': '👓',
    'şapka': '🎩', 'sapka': '🎩', 'hat': '🎩',
    'ayakkabı': '👟', 'ayakkabi': '👟', 'shoe': '👟', 'sneaker': '👟',
    'elbise': '👗', 'dress': '👗', 'tişört': '👕', 'tisort': '👕', 'shirt': '👕',
    'uçurtma': '🪁', 'ucurtma': '🪁', 'kite': '🪁',
    'telefon': '📱', 'phone': '📱', 'televizyon': '📺', 'TV': '📺',
    'radyo': '📻', 'radio': '📻', 'nota': '🎵',
    'trompet': '🎺', 'trumpet': '🎺', 'keman': '🎻', 'violin': '🎻',
    'davul': '🥁', 'drum': '🥁',
    'basketbol': '🏀', 'basketball': '🏀',
    'yüzük': '💍', 'ring': '💍',
    'zar': '🎲', 'dice': '🎲', 'satranç': '♟️', 'chess': '♟️',
    'oyun': '🎮', 'game': '🎮', 'boya': '🎨', 'paint': '🎨',
    'fırça': '🖌️', 'firca': '🖌️', 'brush': '🖌️', 'makas': '✂️', 'scissors': '✂️',
    'ayna': '🪞', 'mirror': '🪞', 'yatak': '🛏️', 'bed': '🛏️',
    'sandalye': '🪑', 'chair': '🪑',
    'tencere': '🍲', 'pot': '🍲', 'tabak': '🍽️', 'plate': '🍽️',
    'bardak': '🥤', 'kahve': '☕', 'coffee': '☕', 'çay': '🍵', 'tea': '🍵',
    'süt': '🥛', 'milk': '🥛', 'su': '💧', 'water': '💧',
    'dünya': '🌍', 'world': '🌍', 'earth': '🌍', 'globe': '🌍',
    'harita': '🗺️', 'map': '🗺️', 'pusula': '🧭', 'compass': '🧭',
    'teleskop': '🔭', 'telescope': '🔭', 'mikroskop': '🔬', 'microscope': '🔬',
    'pil': '🔋', 'battery': '🔋',
    'çekiç': '🔨', 'cekic': '🔨', 'hammer': '🔨',
    'bıçak': '🔪', 'bicak': '🔪', 'knife': '🔪',
    'çivi': '🔩', 'civi': '🔩', 'bolt': '🔩',
  };

  const findEmoji = (text) => {
    const lower = text.toLowerCase().trim();
    // Exact match first
    if (emojiMap[lower]) return emojiMap[lower];
    // Only partial-match if the dictionary key is 4+ chars long AND the input contains it
    // This prevents short keys like "at", "ay", "ev", "kar" matching inside unrelated words
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (key.length >= 4 && lower.includes(key)) return emoji;
    }
    return null; // No match found
  };

  const handleAiGenerate = () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    const emoji = findEmoji(aiPrompt.trim());
    // If no match found, use a question mark so user knows it wasn't recognized
    setSelectedShape(`__EMOJI__${emoji || '❓'}`);
    setShapeTrigger(prev => prev + 1);
    
    setTimeout(() => {
      setAiPrompt('');
      setIsGenerating(false);
      setIsPanelOpen(false);
    }, 300);
  };


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
    { id: 'assets/cars/megane.png', label: 'Renault Megane', icon: '🚗' },
    { id: 'assets/cars/doblo.png', label: 'Fiat Doblo', icon: '🚐' },
    { id: 'assets/cars/toyota.png', label: 'Toyota Corolla', icon: '🚘' },
    { id: 'assets/cars/ferrari.png', label: 'Ferrari', icon: '🏎️' },
    { id: 'assets/cars/volvo.png', label: 'Volvo XC90', icon: '🚙' },
    { id: 'assets/cars/porsche.png', label: 'Porsche 911', icon: '🏎️' },
    { id: 'assets/cars/jeep.png', label: 'Jeep Wrangler', icon: '🚜' },
    { id: 'images/volvo_truck_sticker_1775569646823.png', label: 'Volvo Kamyon', icon: '🚛' },
    { id: 'images/scania_truck_sticker_1775569664955.png', label: 'Scania Kamyon', icon: '🚛' },
    { id: 'images/mercedes_truck_sticker_1775569680863.png', label: 'Mercedes Actros', icon: '🚛' },
    { id: 'images/bmc_truck_sticker_1775569701759.png', label: 'BMC Kamyon', icon: '🚛' },
  ];

  const mosques = [
    { id: 'images/sultanahmet_mosque_sticker_1775569090127.png', label: 'Sultanahmet Camii', icon: '🕌' },
    { id: 'images/ayasofya_mosque_sticker_1775569104944.png', label: 'Ayasofya Camii', icon: '🕌' },
    { id: 'images/selimiye_mosque_sticker_1775569038884.png', label: 'Selimiye Camii', icon: '🕌' },
    { id: 'images/suleymaniye_mosque_sticker_1775569053335.png', label: 'Süleymaniye Camii', icon: '🕌' },
    { id: 'images/ortakoy_mosque_sticker_1775569067386.png', label: 'Ortaköy Camii', icon: '🕌' },
  ];

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#A855F7', '#EC4899', 
    '#FFFFFF', '#94A3B8', '#1E293B', '#8b4513'
  ];

  if (!['shapes', 'stickers', 'cars', 'mosques', 'brush', 'ai', 'settings'].includes(selectedTool)) return null;

  return (
    <>
      <div className="context-panel">
        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedTool === 'shapes' && <StarIcon sx={{ fontSize: 18 }} />}
          {selectedTool === 'brush' && <StarIcon sx={{ fontSize: 18 }} />}
          {selectedTool === 'stickers' && '⚽'} 
          {selectedTool === 'cars' && '🚗'}
          {selectedTool === 'mosques' && '🕌'}
          {selectedTool === 'ai' && <AutoAwesomeIcon sx={{ fontSize: 18 }} />}
          {selectedTool === 'shapes' ? 'Şekil Ayarları' : selectedTool === 'brush' ? 'Fırça Ayarları' : selectedTool === 'cars' ? 'Araba Seçenekleri' : selectedTool === 'mosques' ? 'Cami Seçenekleri' : selectedTool === 'ai' ? 'Yapay Zeka Asistanı' : 'Çıkartma Ayarları'}
        </Typography>

        {selectedTool !== 'ai' && (
        <>
          <Typography variant="overline" sx={{ px: 1, mb: 1, opacity: 0.5, display: 'block' }}>
            ARAÇ AYARLARI
          </Typography>

          <Divider sx={{ mb: 2, opacity: 0.1, backgroundColor: 'white' }} />

          {selectedTool !== 'stickers' && (
               <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7, mb: 1, display: 'block' }}>
                  {selectedTool === 'shapes' ? 'Çizgi Kalınlığı' : 'Yazı Boyutu'}: {brushSize}px
                  </Typography>
                  <Slider 
                      size="small" value={brushSize} min={!['brush', 'shapes'].includes(selectedTool) ? 12 : 1} max={72} 
                      onChange={(e, val) => setBrushSize(val)}
                      sx={{ color: '#fbdf1c' }}
                  />
               </Box>
          )}

          <div className="color-palette">
            <Typography variant="caption" className="palette-label">Renk:</Typography>
            <div className="palette-colors">
              {colors.map(c => (
                <div 
                  key={c} 
                  className={`palette-color ${selectedColor === c ? 'active' : ''}`} 
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>
        </>
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

        {selectedTool === 'ai' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="white" sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Ne istersin? (örn: Ördek, Şato, Balon). Senin için çizip getireceğim!
            </Typography>
            <TextField 
              size="small" 
              placeholder="Örn: Uzay gemisi..." 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              fullWidth
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, 
                    input: { color: 'white', '&::placeholder': { color: 'rgba(255,255,255,0.5)' } } }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && aiPrompt.trim()) {
                  handleAiGenerate();
                }
              }}
            />
            <Button 
              variant="contained" 
              color="primary"
              disabled={!aiPrompt.trim() || isGenerating}
              onClick={() => handleAiGenerate()}
              sx={{ fontWeight: 'bold' }}
              startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
            >
              {isGenerating ? 'Çiziliyor...' : 'Oluştur'}
            </Button>
          </Box>
        )}
      </div>

      {(selectedTool === 'shapes' || selectedTool === 'stickers' || selectedTool === 'cars' || selectedTool === 'mosques') && (
        <div className="shapes-list">
          <Typography variant="overline" sx={{ px: 1, mb: 1, opacity: 0.5, display: 'block' }}>
            {selectedTool === 'shapes' ? 'TÜM ŞEKİLLER' : selectedTool === 'stickers' ? 'ÇIKARTMALAR' : selectedTool === 'cars' ? 'ARABALAR' : 'CAMİLER'}
          </Typography>
          {(selectedTool === 'shapes' ? shapes : selectedTool === 'stickers' ? stickers : selectedTool === 'cars' ? cars : mosques).map(item => (
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
                {(selectedTool === 'cars' || selectedTool === 'mosques') && typeof item.icon === 'string' && item.id.includes('.png') ? <img src={item.id} style={{ width: '20px' }} alt={item.label} /> : item.icon}
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
