import React, { useState } from 'react';
import { Minus, Plus, Trash2, MapPin, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export const Cart = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { items: cartItems, updateQuantity, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsProcessing(true);
    try {
      // Mock API call to create pre-booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful pre-booking
      clearCart();
      
      // Show success message or redirect to confirmation page
      alert('Pre-booking confirmed! Please collect your items within 24 hours.');
    } catch (error) {
      alert('Failed to process pre-booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-600">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="mb-4">Start adding products to your cart to pre-book them.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const collectionDeadline = addHours(new Date(), 24);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.product.id} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                          <p className="text-gray-600 mt-1">{item.product.description}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-end justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                            className="w-16 text-center border rounded-md"
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Price per unit</p>
                          <p className="text-lg font-semibold text-gray-800">₹{item.product.price}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Collect from: {item.office.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pre-booking Summary</h2>
            
            <div className="space-y-4">
              {isAuthenticated && user && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pre-booking for:</p>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Collection Deadline</p>
                    <p className="text-sm text-yellow-700">
                      Collect before {format(collectionDeadline, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Please log in to confirm your pre-booking
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
                  isAuthenticated
                    ? isProcessing
                      ? 'bg-green-600 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : isAuthenticated ? (
                  'Confirm Pre-booking'
                ) : (
                  'Login to Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};