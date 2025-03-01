import { Leaf, Sprout, FlaskRound as Flask, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

const categories = [
  { name: 'Seeds', icon: Leaf, color: 'bg-yellow-100' },
  { name: 'Saplings', icon: Sprout, color: 'bg-green-100' },
  { name: 'Pesticides', icon: Flask, color: 'bg-red-100' },
  { name: 'Fertilizers', icon: Droplets, color: 'bg-blue-100' }
];

const featuredProducts = [
    {
    id: '1',
    name: 'Organic Tomato Seeds',
    description: 'High-yield, disease-resistant tomato seeds perfect for home gardens',
    price: 45,
    category: 'Seeds',
    imageUrl: '/src/components/tomato_seeds.jpg',
    stock: 100,
    krishiBhavan: 'Krishi Bahavan 1',
    officeId: 'kb1'
  },
  {
    id: '2',
    name: 'Mango Saplings',
    description: 'Alphonso mango variety, grafted saplings ready for planting',
    price: 120,
    category: 'Saplings',
    imageUrl: '/src/components/mango_sapling.webp ',
    stock: 50,
     krishiBhavan: 'Krishi Bahavan 2',
     
    officeId: 'kb1'
  }
] as const;

const products = [
  { id: 1, name: "Moovandan", image: "https://www.fortheloveofnature.in/cdn/shop/products/Mangiferaindica-Moovandan_Mango_1_823x.jpg?v=1640246605", description: "A Popular Early-Bearing Variety" },
  { id: 2, name: "Kilichundan Mango", image: "https://www.greensofkerala.com/wp-content/uploads/2021/04/kilichundan-manga-2.gif", description: "The Parrot-Beak Mango with a Tangy-Sweet Flavor" },
  { id: 3, name: "Neelum", image: "https://tropicaltreeguide.com/wp-content/uploads/2023/04/Mango_Neelum_Fruit_IG_Botanical_Diversity_3-1024x1014.jpg", description: "A High-Yielding and Disease-Resistant Variety of Mango"},
  { id: 4, name: "Alphonso", image: "https://seed2plant.in/cdn/shop/files/AlphonsoMangoGraftedLivePlant.jpg?v=1689071379&width=1100", description:"The King of Mangoes" },
  { id: 5, name: "Cowpea", image: "https://seed2plant.in/cdn/shop/products/cowpeaseeds.jpg?v=1603962956&width=1780", description: "Drought-tolerant legume " },
  { id: 6, name: "Yardlong Bean", image: "https://m.media-amazon.com/images/I/61GCtRXQUNL.jpg", description: "Locally known as Achinga Payar is a popular vegetable characterized by its slender, elongated pods" },
  { id: 7, name: "Winged Bean", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyx8m47r2uid8bsBjhInQs9nlpFmuBXKfT6w&s", description: "Locally known as Kaippayar, this nutrient-rich bean is characterized by its winged edges and high protein content." },
  { id: 8, name: " Sword Bean", image: "https://goldenhillsfarm.in/media/product_images/sward-beans.jpg", description: "Known as Valpayar, this variety has thick, broad pods and is often used in traditional Kerala dishes." },
  { id: 9, name: "Nendran", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqNbKet5tI1Uh_bAZgjTNB0RPSInNnPKkN8A&s", description: " A prominent variety in Kerala, Nendran bananas are large, firm, and slightly sweet" },
  { id: 10, name: "Chengalikodan Nendran", image: "https://www.gikerala.in/images/products/Chengalikkodan_Nendran-Banana-4.webp", description: "Originating from the Chengazhikodu village in Thrissur District, this variety is renowned for its unique taste and vibrant color." },
  { id: 11, name: "Matti Pazham", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9r6XZqXhdCNS3xpTSTkoVXHbo38K_Q1K__g&s", description: "Known for its fragrant aroma and honey-like taste, this small-sized banana is cherished for its unique flavor profile. " },
  { id: 12, name: "Poovan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Kerala_Banana_-_Poovan_Pazham-1.jpg/1200px-Kerala_Banana_-_Poovan_Pazham-1.jpg?20110717070644", description: " A popular dessert banana, Poovan is medium-sized with a thin skin and sweet flesh." }
];

export const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[400px] bg-gradient-to-r from-green-700 to-green-900 rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200"
            alt="Agriculture"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="max-w-2xl px-4">
              <h1 className="text-4xl font-bold text-white mb-4">
                Your Trusted Source for Agricultural Supplies
              </h1>
              <p className="text-lg text-green-100 mb-8">
                Pre-book quality seeds, saplings, pesticides, and fertilizers from your local Krishi-Bahavan
              </p>
              <Link to="/products"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className={`${category.color} p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
              >
                <Icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      ...
      {/* Explore More Varieties */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore More Varieties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <Link to={`/products/${product.id}`} className="text-blue-500 hover:underline mt-2 inline-block">Read More</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};