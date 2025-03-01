import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, TrendingUp, Users, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import type { Product, Booking } from '../types';
import { format } from 'date-fns';

const stats = [
  { name: 'Total Products', value: '24', icon: Package, color: 'bg-blue-500' },
  { name: 'Active Bookings', value: '12', icon: TrendingUp, color: 'bg-green-500' },
  { name: 'Customer Reach', value: '150+', icon: Users, color: 'bg-purple-500' },
  { name: 'Pending Collections', value: '5', icon: AlertCircle, color: 'bg-yellow-500' }
];

export const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Pick<Product, 'name' | 'description' | 'price' | 'stock' | 'category' | 'krishiBhavan' | 'imageUrl'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'Seeds',
    krishiBhavan: 'Krishi Bahavan 1',
    imageUrl: ''
  });
  const [bookings] = useState<Booking[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'collections'>('collections');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

  // Fetch products from MongoDB when the component mounts
  const fetchProducts = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/products?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
  
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);
      

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    try {
      let response;
      const productData = { ...formData, user_id: userId };
  
      if (selectedProduct) {
        response = await fetch(`http://localhost:5000/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) throw new Error('Failed to update product');
      } else {
        response = await fetch('http://localhost:5000/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) throw new Error('Failed to add product');
      }
  
      // ✅ Fetch latest products from backend
      await fetchProducts(); 
  
      setShowAddModal(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'Seeds',
        krishiBhavan: 'Krishi Bahavan 1',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error adding/updating product:', error);
    }
  };
  

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      krishiBhavan: product.krishiBhavan,
      imageUrl: product.imageUrl
    });
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('User ID not found');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/products/${productId}?user_id=${userId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete product');
  
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };  

  const handleCompleteCollection = async (bookingId: string) => {
    setProcessingBookingId(bookingId);
    try {
      // Mock API call - replace with actual update
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to complete collection:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking?.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your products and track bookings</p>
        </div>
        {activeTab === 'products' && (
          <button onClick={() => setShowAddModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('collections')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'collections'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Products
          </button>
        </nav>
      </div>

      {activeTab === 'collections' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Order Collections</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={booking.product.imageUrl}
                        alt={booking.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{booking.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          Order #{booking.id} • Quantity: {booking.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ₹{booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <div className="flex items-center space-x-2 mb-2">
                        {booking.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : booking.status === 'confirmed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Package className="h-5 w-5 text-blue-500" />
                        )}
                        <span className="font-medium text-gray-800">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <button
                          onClick={() => handleCompleteCollection(booking.id)}
                          disabled={processingBookingId === booking.id}
                          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors flex items-center space-x-2"
                        >
                          {processingBookingId === booking.id ? (
                            <>
                              <Package className="animate-spin h-5 w-5" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Package className="h-5 w-5" />
                              <span>Complete Collection</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Booking Date</p>
                      <p className="font-medium text-gray-800">
                        {format(booking.bookingDate, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Collection Deadline</p>
                      <p className="font-medium text-gray-800">
                        {format(booking.expiryDate, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Products Table */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Krishi Bhavan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                          {product.krishiBhavan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">₹{product.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          product.stock > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Krishi Bhavan
                </label>
                <select
                  name="krishiBhavan"
                  value={formData.krishiBhavan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Krishi Bhavan 1">Krishi Bhavan 1</option>
                  <option value="Krishi Bhavan 2">Krishi Bhavan 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Seeds">Seeds</option>
                  <option value="Saplings">Saplings</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Fertilizers">Fertilizers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
)}

    </div>
  );
};