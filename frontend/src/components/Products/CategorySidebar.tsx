import React from 'react';
import './CategorySidebar.css';

interface CategorySidebarProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    categories,
    selectedCategory,
    onSelectCategory
}) => {
    // Get category icon based on name
    const getCategoryIcon = (category: string): string => {
        switch (category.toLowerCase()) {
            case "men's clothing":
                return "bi-gender-male";
            case "women's clothing":
                return "bi-gender-female";
            case "electronics":
                return "bi-laptop";
            case "jewelery":
                return "bi-gem";
            case "giyim":
                return "bi-palette";
            case "elektronik":
                return "bi-cpu";
            case "aksesuar":
                return "bi-watch";
            default:
                return "bi-tag";
        }
    };

    return (
        <div className="category-sidebar">
            <h5 className="category-heading">Kategoriler</h5>

            <ul className="category-list">
                <li
                    className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => onSelectCategory(null)}
                >
                    <i className="bi bi-grid category-icon"></i>
                    <span>Tüm Ürünler</span>
                    <span className="category-count">({categories.length})</span>
                </li>

                {categories.map(category => (
                    <li
                        key={category}
                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => onSelectCategory(category)}
                    >
                        <i className={`bi ${getCategoryIcon(category)} category-icon`}></i>
                        <span>{category}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar; 