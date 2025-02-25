import React, { useState } from 'react';
import { Clock, MapPin, X, Minus, Plus, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, Math.min(value, product.stock)));
  };

  const handleAddToCart = () => {
    // Mock office data - in a real app, this would come from the product's office details
    const office = {
      id: product.officeId,
      name: 'Krishi Bahavan - Central Office',
      location: 'Thiruvananthapuram',
      address: '123 Agriculture Road, Kerala 695001',
      contact: '+91 1234567890'
    };

    addItem(product, quantity, office);
    setShowPopup(false);
    setQuantity(1);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-green-700">₹{product.price}</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">24hr collection window</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Collect from nearest Krishi-Bahavan</span>
            </div>
          </div>
          <button
            onClick={() => setShowPopup(true)}
            disabled={product.stock === 0}
            className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 
                     disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Pre-book Now
          </button>
        </div>
      </div>

      {/* Pre-booking Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-start space-x-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-green-700 font-semibold mt-1">₹{product.price}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Description</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 rounded-md border hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                  min="1"
                  max={product.stock}
                  className="w-20 text-center border rounded-md py-2"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 rounded-md border hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>24-hour collection window after pre-booking</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Collect from nearest Krishi-Bahavan office</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 
                         transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};