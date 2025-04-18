import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './AddProduct.css';
import BarcodeScanner from './BarcodeScanner';
import { ProductProps } from '../../context/AppContext';

const AddProduct: React.FC = () => {
    const { products, addProduct, translate, language } = useAppContext();
    const [showScanner, setShowScanner] = useState(false);

    // Debug - dil değişikliğini izle
    useEffect(() => {
        console.log("AddProduct - Dil değişti:", language);
    }, [language]);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
        stock: 0
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        });

        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = translate('required_field');
        }

        if (formData.price <= 0) {
            newErrors.price = translate('valid_price');
        }

        if (!formData.category) {
            newErrors.category = translate('select_category');
        }

        if (formData.stock < 0) {
            newErrors.stock = translate('valid_stock');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // AppContext'teki addProduct fonksiyonunu çağır
            const newProduct = addProduct({
                title: formData.title,
                price: formData.price,
                description: formData.description,
                category: formData.category,
                image: formData.image || 'https://via.placeholder.com/150',
                stock: formData.stock
            });

            console.log('Ürün başarıyla eklendi:', newProduct);

            // Show success message
            setSuccessMessage(translate('product_added'));

            // Clear form after successful submission
            setFormData({
                title: '',
                price: 0,
                description: '',
                category: '',
                image: '',
                stock: 0
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Ürün eklenirken hata oluştu:', error);
            setErrors({
                form: translate('product_add_error')
            });
        }
    };

    // Handle product found from barcode scanner
    const handleProductFound = (product: ProductProps) => {
        setFormData({
            title: product.title,
            price: product.price,
            description: product.description || '',
            category: product.category || '',
            image: product.image,
            stock: product.stock
        });

        setShowScanner(false);
    };

    return (
        <div className="add-product-container">
            <h2 className="mb-4">{translate('add_product')}</h2>

            {!showScanner ? (
                <>
                    <div className="mb-3">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setShowScanner(true)}
                        >
                            <i className="bi bi-upc-scan me-2"></i>
                            {translate('barcode_scanner')}
                        </button>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success">
                            {successMessage}
                        </div>
                    )}

                    {errors.form && (
                        <div className="alert alert-danger">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">{translate('product_name')}</label>
                            <input
                                type="text"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="price" className="form-label">{translate('price')}</label>
                                <div className="input-group">
                                    <span className="input-group-text">₺</span>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                        id="price"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="stock" className="form-label">{translate('stock')}</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                                    id="stock"
                                    name="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                />
                                {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">{translate('category')}</label>
                            <select
                                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="">{translate('select_category')}</option>
                                <option value="Giyim">{translate('clothing')}</option>
                                <option value="Elektronik">{translate('electronics')}</option>
                                <option value="Aksesuar">{translate('accessories')}</option>
                                <option value="Diğer">{translate('other')}</option>
                            </select>
                            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">{translate('description')}</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">{translate('image_url')}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Ürün önizleme"
                                    className="image-preview mt-2"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary">
                            <i className="bi bi-plus-circle me-2"></i>
                            {translate('add_product')}
                        </button>
                    </form>
                </>
            ) : (
                <div className="mb-3">
                    <BarcodeScanner onProductFound={handleProductFound} products={products} />
                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => setShowScanner(false)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        {translate('back_to_form')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddProduct; 