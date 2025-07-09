import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
//import './AddProduct.css';
import BarcodeScanner from './BarcodeScanner';
import { ProductProps } from '../../types/product';

const AddProduct: React.FC = () => {
    const { addProduct, isLoading } = useAppContext();
    const [showScanner, setShowScanner] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // URL için
    const [imageFile, setImageFile] = useState<File | null>(null); // Dosya için
    const [imagePreview, setImagePreview] = useState(''); // Önizleme için
    const [imageType, setImageType] = useState<'url' | 'file'>('url'); // Görsel tipi seçimi
    const [barcode, setBarcode] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState<number>(0);
    const [key, setKey] = useState<number>(Date.now()); // Dosya input için key

    // Handle product found from barcode scanner
    const handleProductFound = useCallback((product: ProductProps) => {
        setTitle(product.title);
        setPrice(product.price);
        setDescription(product.description || '');
        setCategory(product.category || '');
        setImageUrl(product.image);
        setImagePreview(product.image);
        setImageType('url');
        setBarcode((product as any).barcode || product._id);
        setSku((product as any).sku || '');
        setStock(product.stock || 0);
        setShowScanner(false);
    }, [setShowScanner]);

    // Görsel dosyası seçildiğinde
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImageType('file');
            
            // Önizleme için URL oluştur
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // URL değiştiğinde önizlemeyi güncelle
    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url || ''); // Boş string olarak başlatmak için
        setImageType('url');
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || price === '' || price <= 0 || !sku) {
            alert('Lütfen ürün adı, fiyatı ve stok kodu alanlarını doldurun.');
            return;
        }

        // Görsel kontrolü
        if (imageType === 'url' && !imageUrl) {
            alert('Lütfen bir görsel URL\'si girin.');
            return;
        }

        if (imageType === 'file' && !imageFile) {
            alert('Lütfen bir görsel dosyası yükleyin.');
            return;
        }

        // FormData oluştur
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price.toString());
        formData.append('description', description || 'Ürün açıklaması bulunmuyor');
        formData.append('category', category);
        formData.append('sku', sku);
        formData.append('stock', stock.toString());
        
        // Görsel tipine göre veri ekle
        if (imageType === 'file' && imageFile) {
            console.log('Dosya yükleniyor:', imageFile.name, imageFile.type, imageFile.size);
            formData.append('image', imageFile);
        } else if (imageType === 'url' && imageUrl) {
            console.log('URL kullanılıyor:', imageUrl);
            formData.append('imageUrl', imageUrl);
        }

        // FormData içeriğini kontrol et (debug için)
        console.log('FormData içeriği:');
        console.log('title:', formData.get('title'));
        console.log('price:', formData.get('price'));
        console.log('description:', formData.get('description'));
        console.log('category:', formData.get('category'));
        console.log('sku:', formData.get('sku'));
        console.log('stock:', formData.get('stock'));
        console.log('image:', formData.get('image'));
        console.log('imageUrl:', formData.get('imageUrl'));

        try {
            const addedProduct = await addProduct(formData);
            console.log('Eklenen ürün:', addedProduct);
            
            // Formu sıfırla
            setTitle('');
            setPrice('');
            setDescription('');
            setCategory('');
            setImageUrl('');
            setImageFile(null);
            setImagePreview('');
            setBarcode('');
            setSku('');
            setStock(0);
            setKey(Date.now()); // Dosya input'u için yeni key oluştur
            alert('Ürün başarıyla eklendi!');
        } catch (error) {
            console.error('Ürün ekleme hatası:', error);
            alert('Ürün eklenirken bir hata oluştu!');
        }
    };

    return (
        <div className="add-product-container">
            <h2 className="mb-4">Yeni Ürün Ekle</h2>

            <div className="mb-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => setShowScanner(!showScanner)}
                >
                    <i className={`bi bi-${showScanner ? 'camera-video-off' : 'camera-video'}`}></i> {showScanner ? 'Tarayıcıyı Kapat' : 'Barkod Tara'}
                </button>
            </div>

            {showScanner ? (
                <div className="mb-3">
                    <BarcodeScanner
                        onProductFound={handleProductFound}
                        onScanError={(e) => {
                            console.error("Tarama hatası:", e);
                            setShowScanner(false);
                            alert('Barkod tarama sırasında bir hata oluştu.');
                        }}
                        onClose={() => setShowScanner(false)}
                    />
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Ürün Adı</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="barcode" className="form-label">Barkod (Opsiyonel)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="barcode"
                            name="barcode"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="sku" className="form-label">SKU (Stok Kodu)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sku"
                            name="sku"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            required
                            placeholder="Örn: ABC-123"
                        />
                        <small className="form-text text-muted">Ürün için benzersiz bir stok kodu girin.</small>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="price" className="form-label">Fiyat</label>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                name="price"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="category" className="form-label">Kategori</label>
                            <select
                                className="form-select"
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Kategori Seçin</option>
                                <option value="Giyim">Giyim</option>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Aksesuar">Aksesuar</option>
                                <option value="Ev & Yaşam">Ev & Yaşam</option>
                                <option value="Kozmetik">Kozmetik</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="stock" className="form-label">Stok Miktarı</label>
                        <input
                            type="number"
                            className="form-control"
                            id="stock"
                            name="stock"
                            min="0"
                            step="1"
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Açıklama (Opsiyonel)</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ürün Görseli</label>
                        
                        <div className="mb-2">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="imageType"
                                    id="imageTypeUrl"
                                    value="url"
                                    checked={imageType === 'url'}
                                    onChange={() => setImageType('url')}
                                />
                                <label className="form-check-label" htmlFor="imageTypeUrl">
                                    URL Kullan
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="imageType"
                                    id="imageTypeFile"
                                    value="file"
                                    checked={imageType === 'file'}
                                    onChange={() => setImageType('file')}
                                />
                                <label className="form-check-label" htmlFor="imageTypeFile">
                                    Dosya Yükle
                                </label>
                            </div>
                        </div>
                        
                        {imageType === 'url' ? (
                            <input
                                type="text"
                                className="form-control"
                                id="imageUrl"
                                name="imageUrl"
                                value={imageUrl}
                                onChange={handleImageUrlChange}
                                placeholder="https://example.com/image.jpg"
                                required={imageType === 'url'}
                            />
                        ) : (
                            <input
                                type="file"
                                className="form-control"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                key={key} // Her sıfırlamada yeni bir key kullanarak input'u yeniden oluştur
                                required={imageType === 'file'}
                            />
                        )}
                        
                        {imagePreview && (
                            <div className="mt-2">
                                <img 
                                    src={imagePreview} 
                                    alt="Ürün önizleme" 
                                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                                    className="img-thumbnail" 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Görsel+Yüklenemedi';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Ekleniyor...' : 'Ürün Ekle'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddProduct;