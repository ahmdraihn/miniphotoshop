import { useState, useEffect } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import RightPanel from './components/RightPanel'

function App() {
  const [activeTool, setActiveTool] = useState('ImageManagement')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [histBefore, setHistBefore] = useState<number[]>([])
  const [histAfter, setHistAfter] = useState<number[]>([])
  
  const [cnnResult, setCnnResult] = useState<any | null>(null)
  const [cnnStatus, setCnnStatus] = useState<string>("Menunggu eksekusi model CNN...")

  // Fitur 1: Manajemen Impor Gambar
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png, image/bmp';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setSourceImage(result);
          setProcessedImage(result); // Reset hasil olahan saat gambar baru masuk
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Fitur 1: Manajemen Ekspor Gambar (Mendukung JPG/PNG/BMP)
  const handleExport = () => {
    const finalImg = processedImage || sourceImage;
    if (!finalImg) return alert("Impor gambar terlebih dahulu!");

    const container = document.querySelector('.properties-content');
    const formatSelect = container?.querySelector('select') as HTMLSelectElement;
    const nameInput = container?.querySelector('input[type="text"]') as HTMLInputElement;
    
    const format = (formatSelect?.value || 'png').toLowerCase();
    const rawName = nameInput?.value?.trim() || 'hasil-edit';
    const cleanFileName = `${rawName}.${format}`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let mimeType = 'image/png';
      if (format === 'jpg' || format === 'jpeg') {
        mimeType = 'image/jpeg';
        ctx.fillStyle = '#FFFFFF'; // Latar putih untuk JPG (karena tidak mendukung transparansi)
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (format === 'bmp') {
        mimeType = 'image/bmp';
      }

      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = cleanFileName;
      link.href = canvas.toDataURL(mimeType, 0.9);
      link.click();
    };
    img.src = finalImg;
  };

  useEffect(() => {
    const computeHistogram = (imageSrc: string, setter: (value: number[]) => void) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return setter([]);
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const histogram = new Array(256).fill(0);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const gray = Math.round(imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114);
          histogram[gray] += 1;
        }
        setter(histogram);
      };
      img.src = imageSrc;
    };

    if (sourceImage) computeHistogram(sourceImage, setHistBefore);
  }, [sourceImage]);

  useEffect(() => {
    if (!processedImage) return;
    const computeHistogram = (imageSrc: string, setter: (value: number[]) => void) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return setter([]);
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const histogram = new Array(256).fill(0);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const gray = Math.round(imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114);
          histogram[gray] += 1;
        }
        setter(histogram);
      };
      img.src = imageSrc;
    };

    computeHistogram(processedImage, setHistAfter);
  }, [processedImage]);

  // Core Engine: Pengolahan Citra Digital
  const applyFilter = (type: string) => {
    if (type === 'trigger-import') return handleImport();
    if (type === 'trigger-export') return handleExport();

    // Fitur Reset: Mengembalikan ke gambar asli & reset slider di UI
    if (type === 'reset') {
      // Reset semua slider kecuali confidence-slider (punya state sendiri di React)
      const allSliders = document.querySelectorAll('input[type="range"]:not(.confidence-slider)');
      allSliders.forEach((s) => ((s as HTMLInputElement).value = "0"));
      // Reset hasil CNN
      setCnnResult(null);
      setCnnStatus("Menunggu eksekusi model CNN...");
      return setProcessedImage(sourceImage);
    }

    if (!sourceImage) return;
    const img = new Image();
    img.src = sourceImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const getInputValue = (selector: string, fallback = '0') => {
        const el = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
        return el?.value || fallback;
      };

      const parseNum = (value: string, fallback = 0) => {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? fallback : parsed;
      };

      const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

      const drawImage = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, 0, 0);
      };

      const getSourceImageData = () => {
        const temp = document.createElement('canvas');
        temp.width = img.width;
        temp.height = img.height;
        const tempCtx = temp.getContext('2d');
        if (!tempCtx) return null;
        tempCtx.drawImage(img, 0, 0);
        return tempCtx.getImageData(0, 0, img.width, img.height);
      };

      const getInterpolationMethod = () => getInputValue('.interpolation-select', 'Nearest Neighbor');

      const sampleNearest = (data: Uint8ClampedArray, width: number, height: number, x: number, y: number) => {
        const ix = Math.min(width - 1, Math.max(0, Math.round(x)));
        const iy = Math.min(height - 1, Math.max(0, Math.round(y)));
        const idx = (iy * width + ix) * 4;
        return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]] as [number, number, number, number];
      };

      const sampleBilinear = (data: Uint8ClampedArray, width: number, height: number, x: number, y: number) => {
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const x1 = Math.min(width - 1, x0 + 1);
        const y1 = Math.min(height - 1, y0 + 1);
        const wx = x - x0;
        const wy = y - y0;

        const getChannel = (cx: number, cy: number, channel: number) => {
          const idx = (cy * width + cx) * 4 + channel;
          return data[idx];
        };

        const result = [0, 0, 0, 255];
        for (let c = 0; c < 3; c += 1) {
          const v00 = getChannel(x0, y0, c);
          const v10 = getChannel(x1, y0, c);
          const v01 = getChannel(x0, y1, c);
          const v11 = getChannel(x1, y1, c);
          result[c] = v00 * (1 - wx) * (1 - wy) + v10 * wx * (1 - wy) + v01 * (1 - wx) * wy + v11 * wx * wy;
        }
        return [result[0], result[1], result[2], result[3]] as [number, number, number, number];
      };

      const samplePixel = (data: Uint8ClampedArray, width: number, height: number, x: number, y: number, method: string) => {
        if (method.toLowerCase().includes('bilinear')) {
          return sampleBilinear(data, width, height, x, y);
        }
        return sampleNearest(data, width, height, x, y);
      };

      const resampleImageData = (srcData: Uint8ClampedArray, width: number, height: number, destWidth: number, destHeight: number, method: string) => {
        const out = new Uint8ClampedArray(destWidth * destHeight * 4);
        const xRatio = width / destWidth;
        const yRatio = height / destHeight;

        for (let row = 0; row < destHeight; row += 1) {
          for (let col = 0; col < destWidth; col += 1) {
            const srcX = col * xRatio;
            const srcY = row * yRatio;
            const [r, g, b, a] = samplePixel(srcData, width, height, srcX, srcY, method);
            const idx = (row * destWidth + col) * 4;
            out[idx] = clamp(r);
            out[idx + 1] = clamp(g);
            out[idx + 2] = clamp(b);
            out[idx + 3] = a;
          }
        }
        return out;
      };

      const rotateImage = (angle: number, method: string) => {
        const radians = angle * Math.PI / 180;
        const absCos = Math.abs(Math.cos(radians));
        const absSin = Math.abs(Math.sin(radians));
        const newWidth = Math.max(1, Math.round(img.width * absCos + img.height * absSin));
        const newHeight = Math.max(1, Math.round(img.width * absSin + img.height * absCos));

        const sourceData = getSourceImageData();
        if (!sourceData) return;

        const srcWidth = img.width;
        const srcHeight = img.height;
        const destData = new Uint8ClampedArray(newWidth * newHeight * 4);
        const destCx = newWidth / 2;
        const destCy = newHeight / 2;
        const srcCx = srcWidth / 2;
        const srcCy = srcHeight / 2;

        for (let y = 0; y < newHeight; y += 1) {
          for (let x = 0; x < newWidth; x += 1) {
            const dx = x - destCx;
            const dy = y - destCy;
            const srcX = Math.cos(radians) * dx + Math.sin(radians) * dy + srcCx;
            const srcY = -Math.sin(radians) * dx + Math.cos(radians) * dy + srcCy;
            const [r, g, b, a] = samplePixel(sourceData.data, srcWidth, srcHeight, srcX, srcY, method);
            const idx = (y * newWidth + x) * 4;
            destData[idx] = clamp(r);
            destData[idx + 1] = clamp(g);
            destData[idx + 2] = clamp(b);
            destData[idx + 3] = clamp(a);
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.putImageData(new ImageData(destData, newWidth, newHeight), 0, 0);
        setProcessedImage(canvas.toDataURL());
      };

      const grayscalePixels = (pixels: Uint8ClampedArray) => {
        for (let i = 0; i < pixels.length; i += 4) {
          const gray = pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11;
          pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
        }
      };

      const convolve = (src: Uint8ClampedArray, width: number, height: number, kernel: number[], size: number, factor = 1, bias = 0) => {
        const half = Math.floor(size / 2);
        const out = new Uint8ClampedArray(src.length);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0;
              for (let ky = -half; ky <= half; ky++) {
                for (let kx = -half; kx <= half; kx++) {
                  const sx = Math.min(width - 1, Math.max(0, x + kx));
                  const sy = Math.min(height - 1, Math.max(0, y + ky));
                  const idx = (sy * width + sx) * 4;
                  sum += src[idx + c] * kernel[(ky + half) * size + (kx + half)];
                }
              }
              const dstIdx = (y * width + x) * 4;
              out[dstIdx + c] = clamp(sum * factor + bias);
            }
            out[(y * width + x) * 4 + 3] = src[(y * width + x) * 4 + 3];
          }
        }
        return out;
      };

      const medianFilter = (src: Uint8ClampedArray, width: number, height: number, size: number) => {
        const out = new Uint8ClampedArray(src.length);
        const half = Math.floor(size / 2);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            for (let c = 0; c < 3; c++) {
              const values: number[] = [];
              for (let ky = -half; ky <= half; ky++) {
                for (let kx = -half; kx <= half; kx++) {
                  const sx = Math.min(width - 1, Math.max(0, x + kx));
                  const sy = Math.min(height - 1, Math.max(0, y + ky));
                  values.push(src[(sy * width + sx) * 4 + c]);
                }
              }
              values.sort((a, b) => a - b);
              const median = values[Math.floor(values.length / 2)];
              out[(y * width + x) * 4 + c] = median;
            }
            out[(y * width + x) * 4 + 3] = src[(y * width + x) * 4 + 3];
          }
        }

        return out;
      };

      const morphological = (src: Uint8ClampedArray, width: number, height: number, operation: 'erosion' | 'dilation') => {
        const threshold = 128;
        const out = new Uint8ClampedArray(src.length);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let active = operation === 'dilation' ? false : true;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const sx = Math.min(width - 1, Math.max(0, x + kx));
                const sy = Math.min(height - 1, Math.max(0, y + ky));
                const idx = (sy * width + sx) * 4;
                const value = (src[idx] + src[idx + 1] + src[idx + 2]) / 3;
                const isWhite = value > threshold;
                if (operation === 'dilation' && isWhite) active = true;
                if (operation === 'erosion' && !isWhite) active = false;
              }
            }
            const idx = (y * width + x) * 4;
            const pixel = active ? 255 : 0;
            out[idx] = out[idx + 1] = out[idx + 2] = pixel;
            out[idx + 3] = src[idx + 3];
          }
        }
        return out;
      };

      const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        const l = (max + min) / 2;
        const d = max - min;
        const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
        if (d !== 0) {
          if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
          else if (max === g) h = ((b - r) / d + 2);
          else h = ((r - g) / d + 4);
        }
        return [h * 60, s, l] as const;
      };

      const hslToRgb = (h: number, s: number, l: number) => {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r: number;
        let g: number;
        let b: number;
        if (h < 60) [r, g, b] = [c, x, 0];
        else if (h < 120) [r, g, b] = [x, c, 0];
        else if (h < 180) [r, g, b] = [0, c, x];
        else if (h < 240) [r, g, b] = [0, x, c];
        else if (h < 300) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        return [clamp((r + m) * 255), clamp((g + m) * 255), clamp((b + m) * 255)];
      };

      const segmentImage = (method: string, param: number, width: number, height: number, pixels: Uint8ClampedArray) => {
        const result = new Uint8ClampedArray(pixels.length);
        switch (method) {
          case 'threshold': {
            const threshold = Math.round((param / 10) * 255);
            for (let i = 0; i < pixels.length; i += 4) {
              const value = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
              const binary = value > threshold ? 255 : 0;
              result[i] = result[i + 1] = result[i + 2] = binary;
              result[i + 3] = pixels[i + 3];
            }
            break;
          }
          case 'edge': {
            const kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
            const conv = convolve(pixels, width, height, kernel, 3);
            for (let i = 0; i < conv.length; i += 4) {
              const edge = (conv[i] + conv[i + 1] + conv[i + 2]) / 3;
              const val = edge > 120 ? 255 : 0;
              result[i] = result[i + 1] = result[i + 2] = val;
              result[i + 3] = conv[i + 3];
            }
            break;
          }
          case 'region': {
            for (let i = 0; i < pixels.length; i += 4) {
              const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
              const local = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
              const val = avg > local + (param * 5) ? 255 : 0;
              result[i] = result[i + 1] = result[i + 2] = val;
              result[i + 3] = pixels[i + 3];
            }
            break;
          }
          case 'clustering': {
            const k = Math.max(2, param);
            const centroids = Array.from({ length: k }, (_, index) => 255 * (index / (k - 1)));
            const labels = new Array(Math.floor(pixels.length / 4)).fill(0);
            for (let iter = 0; iter < 3; iter++) {
              const sums = new Array(k).fill(0);
              const counts = new Array(k).fill(0);
              for (let px = 0, idx = 0; px < pixels.length; px += 4, idx++) {
                const value = (pixels[px] + pixels[px + 1] + pixels[px + 2]) / 3;
                let best = 0;
                let minDist = Infinity;
                for (let c = 0; c < k; c++) {
                  const dist = Math.abs(value - centroids[c]);
                  if (dist < minDist) {
                    minDist = dist;
                    best = c;
                  }
                }
                labels[idx] = best;
                sums[best] += value;
                counts[best] += 1;
              }
              for (let c = 0; c < k; c++) {
                if (counts[c] > 0) centroids[c] = sums[c] / counts[c];
              }
            }
            for (let px = 0, idx = 0; px < pixels.length; px += 4, idx++) {
              const cluster = labels[idx];
              const value = Math.round(centroids[cluster]);
              result[px] = result[px + 1] = result[px + 2] = value;
              result[px + 3] = pixels[px + 3];
            }
            break;
          }
          default:
            return pixels;
        }
        return result;
      };

      const compressImage = (method: string, quality: number, pixels: Uint8ClampedArray) => {
        const out = new Uint8ClampedArray(pixels.length);
        const levels = Math.max(2, Math.floor((quality / 100) * 32));
        const step = 255 / (levels - 1);
        for (let i = 0; i < pixels.length; i += 4) {
          if (method === 'jpeg') {
            out[i] = clamp(Math.round(pixels[i] / step) * step);
            out[i + 1] = clamp(Math.round(pixels[i + 1] / step) * step);
            out[i + 2] = clamp(Math.round(pixels[i + 2] / step) * step);
          } else if (method === 'huffman' || method === 'rle' || method === 'lzw') {
            out[i] = clamp(Math.round(pixels[i] / 64) * 64);
            out[i + 1] = clamp(Math.round(pixels[i + 1] / 64) * 64);
            out[i + 2] = clamp(Math.round(pixels[i + 2] / 64) * 64);
          } else {
            out[i] = pixels[i];
            out[i + 1] = pixels[i + 1];
            out[i + 2] = pixels[i + 2];
          }
          out[i + 3] = pixels[i + 3];
        }
        return out;
      };

      const runCnnInference = async () => {
        if (!sourceImage) return;
        setCnnStatus("Menghubungi API Server CNN...");
        try {
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: sourceImage }),
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Gagal melakukan inferensi.");
          }

          const result = await response.json();

          // Baca threshold dari slider di UI
          const confidenceSlider = document.querySelector('.confidence-slider') as HTMLInputElement;
          const minThreshold = confidenceSlider ? parseFloat(confidenceSlider.value) : 50;

          // Jika confidence di bawah threshold, tolak hasil
          if (result.confidence < minThreshold) {
            setCnnResult(null);
            setCnnStatus(`Confidence terlalu rendah (${result.confidence}% < ${minThreshold}%). Coba turunkan threshold.`);
            return;
          }

          setCnnResult(result);
          setCnnStatus(`Inferensi selesai. Objek terdeteksi: ${result.class} (${result.confidence}%)`);

          // Gambar bounding box pada canvas
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const box = result.box;
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = Math.max(3, Math.round(img.width * 0.005));
          ctx.font = `bold ${Math.max(14, Math.round(img.width * 0.025))}px sans-serif`;
          ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';

          // Gambar Box
          ctx.strokeRect(box.x, box.y, box.w, box.h);
          
          // Gambar Label Background
          const labelText = `${result.class} (${result.confidence}%)`;
          const textWidth = ctx.measureText(labelText).width;
          const textHeight = Math.max(18, Math.round(img.width * 0.025));
          ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
          ctx.fillRect(box.x, Math.max(0, box.y - textHeight - 4), textWidth + 12, textHeight + 6);

          // Gambar Label Text
          ctx.fillStyle = '#000000';
          ctx.fillText(labelText, box.x + 6, Math.max(textHeight, box.y - 4));

          setProcessedImage(canvas.toDataURL());
        } catch (err: any) {
          console.error(err);
          setCnnStatus(`Error: ${err.message || 'Gagal menghubungi server backend.'}`);
          alert(`Error CNN: ${err.message || 'Gagal menghubungi server backend. Pastikan API FastAPI Anda aktif di port 8000.'}`);
        }
      };


      const selectedSegmentMethodValue = getInputValue('.segment-method-select', 'threshold-based');
      const selectedSegmentMethod = selectedSegmentMethodValue.split('-')[0];
      const segmentParam = parseNum(getInputValue('.seg-param-slider', '3'), 3);
      const restoreMethod = getInputValue('.restore-method-select', 'median');
      const kernelSize = parseNum(getInputValue('.kernel-slider', '3'), 3);
      const thresholdValue = parseNum(getInputValue('.threshold-slider', '128'), 128);
      const compressMethod = getInputValue('.compress-method-select', 'jpeg');
      const qualityValue = parseNum(getInputValue('.quality-slider', '80'), 80);

      switch (true) {
        case type.startsWith('brightness-') || type.startsWith('contrast-'): {
          const bright = parseNum(getInputValue('.brightness-slider', '0'), 0);
          const contrast = parseNum(getInputValue('.contrast-slider', '0'), 0);
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            for (let j = 0; j < 3; j++) {
              const color = factor * (data[i + j] - 128) + 128 + bright;
              data[i + j] = clamp(color);
            }
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'hist-equalize': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          let min = 255;
          let max = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const value = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
          const range = max - min || 1;
          for (let i = 0; i < pixels.length; i += 4) {
            const normalized = ((pixels[i] - min) / range) * 255;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = clamp(normalized);
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'sharpen': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
          const result = convolve(imageData.data, canvas.width, canvas.height, kernel, 3);
          ctx.putImageData(new ImageData(result, canvas.width, canvas.height), 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'blur': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.filter = 'blur(4px)';
          ctx.drawImage(img, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'rotate':
        case type.startsWith('rotate-'): {
          const angle = parseNum(type.split('-')[1], 0);
          return rotateImage(angle, getInterpolationMethod());
        }
        case type === 'flip-h': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'flip-v': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'crop': {
          const cropRatio = parseNum(getInputValue('.crop-slider', '80'), 80) / 100;
          const cropW = Math.round(img.width * cropRatio);
          const cropH = Math.round(img.height * cropRatio);
          const offsetX = Math.round((img.width - cropW) / 2);
          const offsetY = Math.round((img.height - cropH) / 2);
          canvas.width = cropW;
          canvas.height = cropH;
          ctx.drawImage(img, offsetX, offsetY, cropW, cropH, 0, 0, cropW, cropH);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'translate': {
          const dx = parseNum(getInputValue('.translate-x-slider', '0'), 0);
          const dy = parseNum(getInputValue('.translate-y-slider', '0'), 0);
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, dx, dy);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'resize': {
          const scale = Math.max(0.1, parseFloat(getInputValue('.scale-slider', '1')));
          const destWidth = Math.max(1, Math.round(img.width * scale));
          const destHeight = Math.max(1, Math.round(img.height * scale));
          const method = getInterpolationMethod();
          const sourceData = getSourceImageData();
          if (!sourceData) return;
          const result = resampleImageData(sourceData.data, img.width, img.height, destWidth, destHeight, method);
          canvas.width = destWidth;
          canvas.height = destHeight;
          ctx.putImageData(new ImageData(result, destWidth, destHeight), 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'gaussian' || type === 'median' || type === 'mean' || type.startsWith('kernel-'): {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          const method = type.startsWith('kernel-') ? restoreMethod : type;
          const size = type.startsWith('kernel-') ? kernelSize : 3;
          if (method === 'gaussian') {
            ctx.filter = `blur(${Math.max(1, Math.floor(size / 2))}px)`;
            ctx.drawImage(img, 0, 0);
            setProcessedImage(canvas.toDataURL());
            return;
          }
          if (method === 'median') {
            const filtered = medianFilter(pixels, canvas.width, canvas.height, size);
            ctx.putImageData(new ImageData(filtered, canvas.width, canvas.height), 0, 0);
            setProcessedImage(canvas.toDataURL());
            return;
          }
          if (method === 'mean') {
            const kernel = Array(size * size).fill(1);
            const factor = 1 / (size * size);
            const result = convolve(pixels, canvas.width, canvas.height, kernel, size, factor);
            ctx.putImageData(new ImageData(result, canvas.width, canvas.height), 0, 0);
            setProcessedImage(canvas.toDataURL());
            return;
          }
          return;
        }
        case type === 'remove-noise': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const filtered = medianFilter(imageData.data, canvas.width, canvas.height, 3);
          ctx.putImageData(new ImageData(filtered, canvas.width, canvas.height), 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'threshold': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            const value = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            const binary = value > thresholdValue ? 255 : 0;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = binary;
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case ['canny', 'sobel', 'prewitt', 'robert', 'laplacian', 'log'].includes(type): {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const kernel = {
            sobel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
            prewitt: [-1, 0, 1, -1, 0, 1, -1, 0, 1],
            robert: [1, 0, 0, 0, -1, 0, 0, 0, 0],
            laplacian: [0, 1, 0, 1, -4, 1, 0, 1, 0],
            log: [0, 0, -1, 0, 2, 0, -1, 0, 0],
            canny: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
          }[type] || [-1, 0, 1, -2, 0, 2, -1, 0, 1];
          const result = convolve(imageData.data, canvas.width, canvas.height, kernel, 3);
          const output = new Uint8ClampedArray(result.length);
          for (let i = 0; i < result.length; i += 4) {
            const value = Math.min(255, Math.max(0, (result[i] + result[i + 1] + result[i + 2]) / 3));
            output[i] = output[i + 1] = output[i + 2] = value;
            output[i + 3] = result[i + 3];
          }
          const outputBuffer = new Uint8ClampedArray(output);
          ctx.putImageData(new ImageData(outputBuffer, canvas.width, canvas.height), 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'erosion':
        case type === 'dilation': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = morphological(imageData.data, canvas.width, canvas.height, type as 'erosion' | 'dilation');
          ctx.putImageData(new ImageData(result, canvas.width, canvas.height), 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'split-red':
        case type === 'split-green':
        case type === 'split-blue': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            if (type === 'split-red') {
              pixels[i + 1] = pixels[i + 2] = 0;
            } else if (type === 'split-green') {
              pixels[i] = pixels[i + 2] = 0;
            } else {
              pixels[i] = pixels[i + 1] = 0;
            }
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type.startsWith('hue-'): {
          const shift = parseNum(type.split('-')[1], 0);
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            const [h, s, l] = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
            const [r, g, b] = hslToRgb((h + shift + 360) % 360, s, l);
            pixels[i] = r;
            pixels[i + 1] = g;
            pixels[i + 2] = b;
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type.startsWith('segment-') || type.startsWith('seg-param-'): {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const method = type.startsWith('segment-') ? type.split('-')[1] : selectedSegmentMethod;
          const threshold = segmentParam;
          const output = segmentImage(method, threshold, canvas.width, canvas.height, imageData.data);
          const outputBuffer = new Uint8ClampedArray(output);
          ctx.putImageData(new ImageData(outputBuffer, canvas.width, canvas.height), 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'extract-object': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            const objectMask = gray > 110 ? 255 : 0;
            pixels[i] = pixels[i] * (objectMask / 255);
            pixels[i + 1] = pixels[i + 1] * (objectMask / 255);
            pixels[i + 2] = pixels[i + 2] * (objectMask / 255);
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type.startsWith('compress-method-') || type.startsWith('quality-') || type === 'simulate-compression': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const output = compressImage(compressMethod, qualityValue, imageData.data);
          const outputBuffer = new Uint8ClampedArray(output);
          ctx.putImageData(new ImageData(outputBuffer, canvas.width, canvas.height), 0, 0);
          if (type === 'simulate-compression') {
            alert(`Simulasi kompresi ${compressMethod.toUpperCase()} dengan kualitas ${qualityValue}% selesai.`);
          }
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'run-cnn-inference': {
          return runCnnInference();
        }
        case type === 'grayscale': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          grayscalePixels(imageData.data);
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        case type === 'invert': {
          drawImage();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = 255 - pixels[i];
            pixels[i + 1] = 255 - pixels[i + 1];
            pixels[i + 2] = 255 - pixels[i + 2];
          }
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          return;
        }
        default: {
          drawImage();
          setProcessedImage(canvas.toDataURL());
          return;
        }
      }
    };
  };

  return (
    <div className="app-container">
      <header className="glass-panel app-header">
        <div className="logo-area">
          <div className="logo-icon">M</div>
          <h1>Mipho</h1>
        </div>
        <div className="header-actions">
          <input 
            type="file" 
            id="test-file-input" 
            style={{ display: 'none' }} 
            accept="image/jpeg, image/png, image/bmp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const result = event.target?.result as string;
                  setSourceImage(result);
                  setProcessedImage(result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <button className="glass-button" onClick={handleImport}>Impor Gambar</button>
          <button className="glass-button primary" onClick={handleExport}>Ekspor</button>
        </div>
      </header>

      <main className="app-content">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <Canvas sourceImage={sourceImage} processedImage={processedImage} />
        <RightPanel 
          activeTool={activeTool} 
          onApply={applyFilter} 
          hasImage={!!sourceImage} 
          sourceImage={sourceImage}
          processedImage={processedImage}
          histBefore={histBefore}
          histAfter={histAfter}
          cnnResult={cnnResult}
          cnnStatus={cnnStatus}
        />
      </main>
      
      <style>{`
        .app-container { display: flex; flex-direction: column; height: 100vh; width: 100vw; padding: 1rem; gap: 1rem; overflow: hidden; background: transparent; }
        .app-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.5rem; border-radius: 12px; height: 64px; flex-shrink: 0; }
        .logo-area { display: flex; align-items: center; gap: 0.75rem; }
        .logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--accent-color), #818cf8); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }
        .logo-area h1 { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.03em; }
        .header-actions { display: flex; gap: 0.75rem; }
        .app-content { display: flex; flex: 1; gap: 1rem; min-height: 0; }
        .glass-button.primary { background: var(--accent-color); color: #fff; border-color: transparent; }
        .glass-button.primary:hover:not(:disabled) { background: var(--accent-hover); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35); }
      `}</style>
    </div>
  )
}

export default App;