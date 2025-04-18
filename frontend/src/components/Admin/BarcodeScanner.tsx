import React, { useState, useRef, useEffect } from 'react';
import './BarcodeScanner.css';
import { ProductProps } from '../../context/AppContext';

interface BarcodeScannerProps {
    onProductFound: (product: ProductProps) => void;
    products: ProductProps[];
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductFound, products }) => {
    const [scanning, setScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

    // Function to handle starting the scanner
    const startScanner = async () => {
        setError(null);
        setScanResult(null);
        setScanning(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                scanBarcode();
                setCameraPermission(true);
            }
        } catch (err) {
            console.error('Kamera erişim hatası:', err);
            setError('Kamera erişimi reddedildi veya kullanılamıyor. Lütfen kamera izinlerini kontrol edin.');
            setScanning(false);
            setCameraPermission(false);
        }
    };

    // Function to stop the scanner
    const stopScanner = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setScanning(false);
    };

    // Function to scan barcode from video stream
    const scanBarcode = () => {
        if (!scanning) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Simulate barcode detection with a mock function
                // In a real implementation, you would use a barcode scanning library here
                // For example: zxing, quagga, etc.
                setTimeout(() => {
                    // Simulate finding a barcode with a random product ID
                    if (scanning && Math.random() > 0.6) { // Simulate success sometimes
                        const randomProductIndex = Math.floor(Math.random() * products.length);
                        const randomProduct = products[randomProductIndex];
                        if (randomProduct) {
                            handleProductFound(randomProduct.id.toString());
                            return;
                        }
                    }

                    // Continue scanning if nothing found
                    if (scanning) {
                        requestAnimationFrame(scanBarcode);
                    }
                }, 500);
            }
        } else {
            requestAnimationFrame(scanBarcode);
        }
    };

    // Function to handle manual code input
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim()) {
            handleProductFound(manualCode);
        }
    };

    // Function to handle found barcode/QR code
    const handleProductFound = (code: string) => {
        setScanResult(code);
        stopScanner();

        // Look for product by ID or barcode (in this case, we're using ID)
        const product = products.find(p => p.id.toString() === code);

        if (product) {
            onProductFound(product);
        } else {
            setError(`Ürün bulunamadı. Kod: ${code}`);
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div className="barcode-scanner-container">
            <h3>Barkod / QR Kod Tarayıcı</h3>

            <div className="scanner-controls">
                {!scanning ? (
                    <button
                        className="btn btn-primary mb-3"
                        onClick={startScanner}
                        disabled={cameraPermission === false}
                    >
                        <i className="bi bi-camera me-2"></i>
                        Tarayıcıyı Başlat
                    </button>
                ) : (
                    <button
                        className="btn btn-secondary mb-3"
                        onClick={stopScanner}
                    >
                        <i className="bi bi-stop-circle me-2"></i>
                        Tarayıcıyı Durdur
                    </button>
                )}
            </div>

            {scanning && (
                <div className="scanner-view">
                    <div className="video-container">
                        <video ref={videoRef} className="scanner-video" />
                        <div className="scan-region-highlight"></div>
                        <canvas ref={canvasRef} className="scanner-canvas" />
                    </div>
                    <p className="scanner-help-text">Barkodu veya QR kodu tarayıcı alanına yerleştirin</p>
                </div>
            )}

            <div className="manual-entry mt-4">
                <h5>Manuel Kod Girişi</h5>
                <form onSubmit={handleManualSubmit} className="manual-entry-form">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Barkod veya ürün ID'si girin"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                        />
                        <button type="submit" className="btn btn-outline-primary">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}

            {scanResult && !error && (
                <div className="alert alert-success mt-3">
                    Barkod/QR başarıyla tarandı: {scanResult}
                </div>
            )}

            {cameraPermission === false && (
                <div className="camera-permission-info mt-3">
                    <div className="alert alert-warning">
                        <h5><i className="bi bi-exclamation-triangle me-2"></i>Kamera Erişimi Gerekli</h5>
                        <p>Barkod tarama özelliğini kullanmak için kamera erişimine izin vermeniz gerekmektedir. Lütfen tarayıcı izinlerini kontrol edin.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner; 