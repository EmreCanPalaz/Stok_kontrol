import React, { useEffect, useRef, useState } from 'react';
import Quagga, { QuaggaJSConfigObject, InputStreamType } from '@ericblade/quagga2'; // Quagga ve tipleri import edildi
import { useAppContext } from '../../context/AppContext';
import { ProductProps } from '../../types/product';
import './BarcodeScanner.css';

// Define a type for the points as expected by drawPath when using { x: 'x', y: 'y' }
interface PointObject {
    x: number;
    y: number;
}

// Helper function to convert [number, number] pair to {x: number, y: number} object
// Bu fonksiyon, Quagga'dan [x, y] array formatında gelen noktaları {x, y} object formatına çevirir.
const convertPointArrayToObject = (pointArray: number[]): PointObject => {
    // Güvenlik kontrolü
    if (!Array.isArray(pointArray) || pointArray.length < 2 || typeof pointArray[0] !== 'number' || typeof pointArray[1] !== 'number') {
        console.error("Geçersiz nokta formatı:", pointArray);
        return { x: 0, y: 0 }; // Varsayılan değer döndür veya hata fırlat
    }
    return { x: pointArray[0], y: pointArray[1] };
};

// Helper function to convert a polygon (Array<[x, y]>) to Array<{x, y}>
// Bu fonksiyon, [x, y] çiftleri içeren bir array (polygon) alıp, {x, y} objeleri içeren bir array döndürür.
const convertPolygonArrayToObject = (polygonArray: number[][] | readonly number[][]): PointObject[] => {
    if (!Array.isArray(polygonArray)) {
        console.error("Geçersiz poligon formatı:", polygonArray);
        return [];
    }
    // Array'in elemanlarının da array ve sayı içerdiğini kontrol et
    if (polygonArray.length > 0 && (!Array.isArray(polygonArray[0]) || polygonArray[0].length < 2 || typeof polygonArray[0][0] !== 'number')) {
         console.error("Poligon array elemanları geçersiz formatta:", polygonArray);
         return [];
    }
    return polygonArray.map(point => convertPointArrayToObject(point));
};

interface BarcodeScannerProps {
  onProductFound: (product: ProductProps) => void;
  onScanError: (error: Error) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductFound, onScanError, onClose }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Cleanup function definition must be inside useEffect
    const cleanup = () => {
      console.log("Quagga cleanup başladı.");
      // Remove all event listeners to prevent memory leaks
      Quagga.offDetected();
      Quagga.offProcessed();
      // Call Quagga.stop() directly. It should handle if it's already stopped.
      try {
         Quagga.stop();
      } catch (e) {
         console.warn("Quagga.stop() sırasında hata oluştu, muhtemelen zaten durdurulmuştu:", e);
      }
      setIsScanning(false);
      console.log("Quagga durduruldu ve event listenerlar kaldırıldı.");
    };

    if (scannerRef.current) {
      setIsScanning(true);
      const config: QuaggaJSConfigObject = {
        inputStream: {
          name: "Live",
          type: "LiveStream" as InputStreamType,
          target: scannerRef.current,
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 100 },
            facingMode: "environment"
          },
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
        },
        locate: true,
      };

      Quagga.init(config, (err?: Error) => {
        if (err) {
          console.error("Quagga başlatma hatası:", err);
          onScanError(err);
          cleanup();
          return;
        }
        console.log("Quagga başlatıldı.");
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        if (code) {
          console.log("Barkod Algılandı:", code);
          cleanup();

          const simulatedProduct: ProductProps = {
              _id: code,
              title: `Tarandı Ürün (${code})`,
              price: 0,
              image: 'https://via.placeholder.com/150',
              stock: 0,
              description: 'Barkod ile bulunan ürün',
              sku: code, // Barkod değerini SKU olarak kullanıyoruz
          };

          onProductFound(simulatedProduct);
        }
      });

      Quagga.onProcessed((result) => {
           const drawingCtx = Quagga.canvas.ctx.overlay;
           const drawingCanvas = Quagga.canvas.dom.overlay;

           if (result) {
               drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width") || "0"), parseInt(drawingCanvas.getAttribute("height") || "0"));

               if (Array.isArray(result.boxes)) {
                    result.boxes.forEach((box: number[][]) => {
                       const boxAsObjects = convertPolygonArrayToObject(box);
                       if (Array.isArray(boxAsObjects) && boxAsObjects.length > 0) {
                            Quagga.ImageDebug.drawPath(boxAsObjects, { x: 'x', y: 'y' }, drawingCtx, { color: "green", lineWidth: 2 });
                       }
                   });
               }

               if (result.box && Array.isArray(result.box) && result.box.length > 0) {
                    const resultBoxAsObjects = convertPolygonArrayToObject(result.box);
                    if (Array.isArray(resultBoxAsObjects) && resultBoxAsObjects.length > 0) {
                        Quagga.ImageDebug.drawPath(resultBoxAsObjects, { x: 'x', y: 'y' }, drawingCtx, { color: "#00F", lineWidth: 2 });
                     }
               }

               if (result.line && Array.isArray(result.line) && result.line.length >= 2) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
               }
           }
       });

      return cleanup;
    }
  }, [scannerRef, onScanError, onProductFound, onClose]);

  return (
    <div className="barcode-scanner-container">
      <div id="interactive" className="viewport" ref={scannerRef} />

      {isScanning && (
         <div className="scanner-message">
            <div className="loading-spinner"></div>
            <p>Barkod aranıyor...</p>
         </div>
      )}

       <button className="btn btn-danger mt-3" onClick={onClose}>
           <i className="bi bi-x-circle me-2"></i> Tarayıcıyı Kapat
       </button>

    </div>
  );
};

export default BarcodeScanner; 