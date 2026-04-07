import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Box, Paper, IconButton, Tooltip, Zoom, Typography } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const TEMPLATES = {
  house: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M506.5 225.8l-224-213.3c-14.7-14-38.3-14-53 0l-224 213.3c-9.1 8.6-10.4 22.7-2.9 32.8 7.5 10.2 21.6 12 31.4 4.3l17.4-16.6v219c0 23.6 19.1 42.7 42.7 42.7h256c23.6 0 42.7-19.1 42.7-42.7v-219l17.4 16.6c9.8 7.7 23.9 5.9 31.4-4.3 7.5-10.1 6.2-24.2-2.9-32.8zM384 469.3H128V240l128-121.9L384 240v229.3z" /></svg>`,
  dog: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm0 160c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm176-208c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm-352 0c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zM384 416c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32h192c17.7 0 32 14.3 32 32z"/></svg>`,
  cat: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 146.6 0 288c0 121.1 84.7 222.3 200 248.5V400h-40l-20 80h-40l20-80h-60v-40h60l20-80h40l-20 80h40l20-80h40l-20 80h40l20-80h60v40h-60l-20 80h-40l20-80h-40v136.5c115.3-26.2 200-127.4 200-248.5C512 146.6 397.4 32 256 32z"/></svg>`,
  cat: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 146.6 0 288c0 121.1 84.7 222.3 200 248.5V400h-40l-20 80h-40l20-80h-60v-40h60l20-80h40l-20 80h40l20-80h40l-20 80h40l20-80h60v40h-60l-20 80h-40l20-80h-40v136.5c115.3-26.2 200-127.4 200-248.5C512 146.6 397.4 32 256 32z"/></svg>`,
  horse: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M432 0H80C35.8 0 0 35.8 0 80v352c0 44.2 35.8 80 80 80h352c44.2 0 80-35.8 80-80V80c0-44.2-35.8-80-80-80zM256 400c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144z"/></svg>`,
  rabbit: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 64c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-43-96-96z"/></svg>`
};

const PENCIL_CURSOR = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="m15 5 4 4"/></svg>') 0 22, auto`;
const BUCKET_CURSOR = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>') 0 22, auto`;


const CanvasBoard = ({ 
  selectedTool, 
  selectedShape, 
  selectedColor, 
  brushSize,
  sides,
  slope,
  isFillEnabled,
  clearTrigger,
  saveTrigger,
  shapeTrigger,
  setIsPanelOpen
}) => {
  const canvasRef = useRef(null);
  const [canvasInstance, setCanvasInstance] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const saveState = () => {
    if (!canvasInstance) return;
    const json = canvasInstance.toJSON();
    const jsonStr = JSON.stringify(json);
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === jsonStr) return prev;
      return [...prev, jsonStr];
    });
    setRedoStack([]);
  };

  const addWatermark = (canvas) => {
    if (!canvas) return;
    try {
      const w = canvas.getWidth ? canvas.getWidth() : (canvas.width || 800);
      const h = canvas.getHeight ? canvas.getHeight() : (canvas.height || 600);
      const size = Math.max(20, Math.min(w, h) * 0.25); // Set minimum size and ensure non-NaN
      const text = new fabric.Text('BİLGİN', {
        fontSize: size || 100,
        fill: 'rgba(0, 0, 0, 0.05)',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        left: w / 2 || 400,
        top: h / 2 || 300,
        angle: -30
      });
      text.set({ id: 'watermark' });
      canvas.add(text);
      canvas.sendToBack(text);
    } catch (err) {
      console.error("Watermark hatasi:", err);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const parent = canvasRef.current.parentElement;
    if (!parent) return;
    const initWidth = parent.clientWidth || 800;
    const initHeight = parent.clientHeight || 600;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: initWidth,
      height: initHeight,
      backgroundColor: 'white',
      isDrawingMode: selectedTool === 'brush',
      allowTouchScrolling: true,
    });
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;
    addWatermark(canvas);
    
    // Setup window resize listener
    const handleResize = () => {
      if (parent) {
        const currentW = canvas.getWidth ? canvas.getWidth() : canvas.width;
        const currentH = canvas.getHeight ? canvas.getHeight() : canvas.height;
        const newW = Math.max(currentW, parent.clientWidth);
        const newH = Math.max(currentH, parent.clientHeight);

        canvas.setDimensions({
          width: newW,
          height: newH
        });
        const wm = canvas.getObjects().find(o => o.id === 'watermark');
        if (wm) {
          wm.set({ 
            left: newW / 2, 
            top: newH / 2,
            fontSize: Math.min(newW, newH) * 0.25
          });
          canvas.sendToBack(wm);
        }
        canvas.renderAll();
      }
    };
    window.addEventListener('resize', handleResize);
    setCanvasInstance(canvas);

    return () => { 
      canvas.dispose(); 
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  useEffect(() => {
    if (canvasInstance) {
      canvasInstance.isDrawingMode = selectedTool === 'brush';
      
      // Set Custom Cursors
      if (selectedTool === 'brush') {
          canvasInstance.freeDrawingCursor = PENCIL_CURSOR;
      } else if (selectedTool === 'fill') {
          canvasInstance.defaultCursor = BUCKET_CURSOR;
          canvasInstance.hoverCursor = BUCKET_CURSOR;
      } else {
          canvasInstance.defaultCursor = 'default';
          canvasInstance.hoverCursor = 'move';
      }

      if (canvasInstance.freeDrawingBrush) {
        canvasInstance.freeDrawingBrush.color = selectedColor;
        canvasInstance.freeDrawingBrush.width = brushSize;
      }
      if (history.length === 0) setHistory([JSON.stringify(canvasInstance.toJSON())]);

      canvasInstance.off('path:created');
      canvasInstance.off('object:modified');
      canvasInstance.off('mouse:down');

      if (selectedTool === 'brush') {
        canvasInstance.on('path:created', saveState);
      } else if (selectedTool === 'fill') {
        canvasInstance.on('mouse:down', (options) => {
          if (options.target) {
            options.target.set('fill', selectedColor);
            canvasInstance.renderAll();
            saveState();
          }
        });
      } else if (selectedTool === 'text') {
        // Immediate text placement at center when tool is selected
        const pos = { x: canvasInstance.getWidth() / 2, y: canvasInstance.getHeight() / 2 };
        const text = new fabric.IText('Yazmaya Başla...', {
            left: pos.x,
            top: pos.y,
            fontFamily: 'Inter',
            fontSize: 40 + (brushSize * 2),
            fill: selectedColor,
            originX: 'center',
            originY: 'center',
            editable: true
        });
        canvasInstance.add(text);
        canvasInstance.setActiveObject(text);
        setTimeout(() => {
            text.enterEditing();
            text.selectAll();
            canvasInstance.renderAll();
        }, 100);
        saveState();
      } else if (selectedTool === 'crop') {
        canvasInstance.on('mouse:down', (options) => {
          if (options.target) {
            const obj = options.target;
            const padding = 20;
            canvasInstance.setDimensions({
              width: obj.width * obj.scaleX + padding * 2,
              height: obj.height * obj.scaleY + padding * 2
            });
            obj.set({ left: padding, top: padding });
            canvasInstance.centerObject(obj);
            canvasInstance.renderAll();
            saveState();
          }
        });
      }
      canvasInstance.on('object:modified', saveState);
    }
  }, [selectedTool, selectedColor, brushSize, canvasInstance]);

  useEffect(() => {
    if (!canvasInstance) return;

    // Direct native event listener on the canvas DOM element for reliability
    const handleDrawingStart = () => {
        if (selectedTool === 'brush') {
            setIsPanelOpen(false);
        }
    };

    const upperCanvas = canvasInstance.upperCanvasEl;
    if (upperCanvas) {
        upperCanvas.addEventListener('mousedown', handleDrawingStart, { passive: true });
        upperCanvas.addEventListener('touchstart', handleDrawingStart, { passive: true });
    }
    
    // Also bind to fabric events just in case
    canvasInstance.on('mouse:down', handleDrawingStart);
    
    return () => {
      if (upperCanvas) {
          upperCanvas.removeEventListener('mousedown', handleDrawingStart);
          upperCanvas.removeEventListener('touchstart', handleDrawingStart);
      }
      canvasInstance.off('mouse:down', handleDrawingStart);
    };
  }, [canvasInstance, selectedTool, setIsPanelOpen]);

  useEffect(() => {
    if (canvasInstance && clearTrigger > 0) {
      canvasInstance.clear();
      canvasInstance.backgroundColor = 'white';
      addWatermark(canvasInstance);
      canvasInstance.renderAll();
      setHistory([JSON.stringify(canvasInstance.toJSON())]);
      setRedoStack([]);
    }
  }, [clearTrigger]);

  useEffect(() => {
    if (canvasInstance && saveTrigger > 0) {
      const dataURL = canvasInstance.toDataURL({ format: 'png', quality: 1 });
      const link = document.createElement('a');
      link.download = `boyama_${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [saveTrigger]);



  const loadTemplateSVG = async (type) => {
    const { objects, options } = await fabric.loadSVGFromString(TEMPLATES[type]);
    const obj = fabric.util.groupSVGElements(objects, options);
    return obj;
  };

  const calculateStarPoints = (sides, outerRadius, innerRadius) => {
    const points = [];
    const angle = Math.PI / sides;
    for (let i = 0; i < 2 * sides; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        points.push({ x: radius * Math.sin(i * angle), y: radius * Math.cos(i * angle) });
    }
    return points;
  };

  const addShape = async (type) => {
    if (!canvasInstance) return;
    let shape;
    const common = {
        left: canvasInstance.width / 2,
        top: canvasInstance.height / 2,
        fill: isFillEnabled ? selectedColor : 'transparent',
        stroke: selectedColor,
        strokeWidth: brushSize,
        originX: 'center',
        originY: 'center',
    };

    // Handle Image Assets (like Cars)
    if (typeof type === 'string' && type.startsWith('/')) {
        try {
            const FabricImageClass = fabric.FabricImage || fabric.Image;
            shape = await FabricImageClass.fromURL(type);
            shape.set(common);
            const scale = Math.min((canvasInstance.width * 0.4) / shape.width, (canvasInstance.height * 0.4) / shape.height);
            shape.scale(scale);
            canvasInstance.add(shape);
            canvasInstance.setActiveObject(shape);
            canvasInstance.renderAll();
            saveState();
            return;
        } catch (err) {
            console.error("Failed to load image:", err);
            type = '🚗'; // Fallback to emoji
        }
    }

    if (TEMPLATES[type]) {
        shape = await loadTemplateSVG(type);
        shape.set(common);
        const scale = Math.min((canvasInstance.width * 0.6) / shape.width, (canvasInstance.height * 0.6) / shape.height);
        shape.scale(scale);
    } else {
        switch (type) {
            case 'square': shape = new fabric.Rect({ ...common, width: 100, height: 100 }); break;
            case 'rect': shape = new fabric.Rect({ ...common, width: 150, height: 100 }); break;
            case 'circle': shape = new fabric.Circle({ ...common, radius: 50 }); break;
            case 'triangle': shape = new fabric.Triangle({ ...common, width: 100, height: 100 }); break;
            case 'heart':
                const pathStr = "M 272.70141,238.71731 \
                C 206.46141,238.71731 152.70141,292.47731 152.70141,358.71731 \
                C 152.70141,493.47282 288.94141,566.27306 392.70141,649.32635 \
                C 496.46141,566.27306 632.70141,493.47282 632.70141,358.71731 \
                C 632.70141,292.47731 578.94141,238.71731 512.70141,238.71731 \
                C 466.06725,238.71731 425.40321,265.40447 405.03048,304.22097 \
                L 392.70141,327.75231 \
                L 380.37234,304.22097 \
                C 360,265.40447 319.33596,238.71731 272.70141,238.71731 z";
                shape = new fabric.Path(pathStr, { ...common });
                const heartScale = Math.min(100 / shape.width, 100 / shape.height);
                shape.scale(heartScale);
                break;
            case 'star':
                const points = calculateStarPoints(sides, 50, 50 * (slope / 100));
                shape = new fabric.Polygon(points, { ...common });
                break;
            default: 
                // Treat as sticker (emoji)
                shape = new fabric.IText(type, {
                    ...common,
                    fontSize: 80,
                    fill: selectedColor, // Allow coloring if applicable (though most emojis are fixed)
                    stroke: 'transparent',
                    strokeWidth: 0
                });
                break;
        }
    }
    canvasInstance.add(shape);
    canvasInstance.setActiveObject(shape);
    canvasInstance.renderAll();
    saveState();
  };

  useEffect(() => {
    if (canvasInstance && (selectedTool === 'shapes' || selectedTool === 'stickers' || selectedTool === 'cars') && selectedShape && shapeTrigger > 0) {
        addShape(selectedShape);
    }
  }, [shapeTrigger]);

  const handleUndo = async () => {
    if (history.length > 1 && canvasInstance) {
      const current = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      const prevState = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setRedoStack((stack) => [...stack, current]);
      canvasInstance.off('path:created');
      canvasInstance.off('object:modified');
      await canvasInstance.loadFromJSON(JSON.parse(prevState));
      canvasInstance.renderAll();
      canvasInstance.on('path:created', saveState);
      canvasInstance.on('object:modified', saveState);
    }
  };

  const handleRedo = async () => {
    if (redoStack.length > 0 && canvasInstance) {
      const next = redoStack[redoStack.length - 1];
      setRedoStack((stack) => stack.slice(0, -1));
      setHistory((prev) => [...prev, next]);
      canvasInstance.off('path:created');
      canvasInstance.off('object:modified');
      await canvasInstance.loadFromJSON(JSON.parse(next));
      canvasInstance.renderAll();
      canvasInstance.on('path:created', saveState);
      canvasInstance.on('object:modified', saveState);
    }
  };

  const deleteSelected = () => {
    if (!canvasInstance) return;
    const activeObjects = canvasInstance.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        canvasInstance.remove(obj);
      });
      canvasInstance.discardActiveObject();
      canvasInstance.requestRenderAll();
      saveState();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if NOT editing text
        const activeObject = canvasInstance?.getActiveObject();
        if (activeObject && activeObject.isEditing) return;
        
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          deleteSelected();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasInstance]);

  const longPressTimer = useRef(null);

  useEffect(() => {
    if (!canvasInstance) return;

    const handleMouseDown = (options) => {
      if (options.target) {
        longPressTimer.current = setTimeout(() => {
          deleteSelected();
          // Visual feedback could be added here
        }, 800);
      }
    };

    const clearTimer = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };

    canvasInstance.on('mouse:down', handleMouseDown);
    canvasInstance.on('mouse:up', clearTimer);
    canvasInstance.on('mouse:move', clearTimer);

    return () => {
      canvasInstance.off('mouse:down', handleMouseDown);
      canvasInstance.off('mouse:up', clearTimer);
      canvasInstance.off('mouse:move', clearTimer);
    };
  }, [canvasInstance]);

  return (
    <Box sx={{ position: 'relative', height: '100%' }} id="canvas-container">
      <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              BİLGİN CANVAS: {selectedTool.toUpperCase()} MODE
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Geri Al" TransitionComponent={Zoom}><IconButton size="small" color="primary" onClick={handleUndo} disabled={history.length <= 1}><UndoIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="İleri Al" TransitionComponent={Zoom}><IconButton size="small" color="primary" onClick={handleRedo} disabled={redoStack.length === 0}><RedoIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Seçileni Sil" TransitionComponent={Zoom}><IconButton size="small" color="warning" onClick={deleteSelected}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Tümünü Temizle" TransitionComponent={Zoom}><IconButton size="small" color="error" onClick={() => { if(window.confirm('Tüm sayfayı temizlemek istediğinize emin misiniz?')) { canvasInstance.clear(); canvasInstance.backgroundColor = 'white'; addWatermark(canvasInstance); saveState(); } }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        </Box>
        <Box sx={{ flex: 1, position: 'relative', backgroundColor: '#f8fafc', overflow: 'auto' }}><canvas ref={canvasRef} /></Box>
      </Paper>
    </Box>
  );
};
export default CanvasBoard;
