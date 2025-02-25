import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';
import { useLocation } from 'react-router-dom';

const categories = ['All', 'Seeds', 'Saplings', 'Pesticides', 'Fertilizers'];

const products = [
  {
    id: '1',
    name: 'Organic Tomato Seeds',
    description: 'High-yield, disease-resistant tomato seeds perfect for home gardens',
    price: 45,
    category: 'seeds',
    imageUrl: '/src/components/tomato_seeds.jpg',
    stock: 100,
    officeId: 'kb1'
  },
  {
    id: '2',
    name: 'Mango Saplings',
    description: 'Alphonso mango variety, grafted saplings ready for planting',
    price: 120,
    category: 'saplings',
    imageUrl: '/src/components/mango_sapling.webp',
    stock: 50,
    officeId: 'kb1'
  },
  {
    id: '3',
    name: 'Organic Fertilizer',
    description: 'Natural compost-based fertilizer for better soil health',
    price: 250,
    category: 'fertilizers',
    imageUrl: '/src/components/organic_fertlizer.jpeg',
    stock: 75,
    officeId: 'kb1'
  }
];

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const { query } = useSearchStore();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1));
    }
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        selectedCategory === 'All' || 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
      .filter(product => {
        if (!query) return true;
        
        const searchQuery = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
        );
      });
  }, [selectedCategory, query]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center space-x-2 text-gray-600"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className={`md:w-64 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};