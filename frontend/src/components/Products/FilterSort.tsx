import React, { useState } from 'react';
import './FilterSort.css';

interface FilterSortProps {
    onSort: (sortOption: string) => void;
    onPriceFilter: (min: number | null, max: number | null) => void;
    onStockFilter: (inStockOnly: boolean) => void;
    selectedSortOption: string;
    inStockOnly: boolean;
    minPrice: number | null;
    maxPrice: number | null;
}

const FilterSort: React.FC<FilterSortProps> = ({
    onSort,
    onPriceFilter,
    onStockFilter,
    selectedSortOption,
    inStockOnly,
    minPrice,
    maxPrice
}) => {
    const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || '');
    const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || '');
    const [expanded, setExpanded] = useState(false);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSort(e.target.value);
    };

    const handleStockFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onStockFilter(e.target.checked);
    };

    const handlePriceFilterApply = () => {
        const min = localMinPrice ? parseFloat(localMinPrice) : null;
        const max = localMaxPrice ? parseFloat(localMaxPrice) : null;
        onPriceFilter(min, max);
    };

    const handlePriceFilterClear = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        onPriceFilter(null, null);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="filter-sort-container">
            <div className="filter-sort-header">
                <h5>Filtrele ve Sırala</h5>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={toggleExpand}
                >
                    {expanded ? 'Daralt' : 'Genişlet'}
                    <i className={`bi bi-chevron-${expanded ? 'up' : 'down'} ms-1`}></i>
                </button>
            </div>

            <div className={`filter-sort-content ${expanded ? 'expanded' : ''}`}>
                {/* Sorting options */}
                <div className="filter-group">
                    <label htmlFor="sortSelect" className="filter-label">Sıralama</label>
                    <select
                        id="sortSelect"
                        className="form-select"
                        value={selectedSortOption}
                        onChange={handleSortChange}
                    >
                        <option value="featured">Öne Çıkanlar</option>
                        <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                        <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                        <option value="name-asc">İsim: A-Z</option>
                        <option value="name-desc">İsim: Z-A</option>
                    </select>
                </div>

                {/* Price filter */}
                <div className="filter-group">
                    <label className="filter-label">Fiyat Aralığı</label>
                    <div className="price-range-inputs">
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min"
                                value={localMinPrice}
                                onChange={(e) => setLocalMinPrice(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max"
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="price-range-actions">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={handlePriceFilterApply}
                        >
                            Uygula
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handlePriceFilterClear}
                        >
                            Temizle
                        </button>
                    </div>
                </div>

                {/* Stock filter */}
                <div className="filter-group">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="inStockCheck"
                            checked={inStockOnly}
                            onChange={handleStockFilterChange}
                        />
                        <label className="form-check-label" htmlFor="inStockCheck">
                            Sadece Stokta Olanlar
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSort; 