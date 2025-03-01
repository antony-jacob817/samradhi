import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface ProductDetails {
  id: number;
  name: string;
  image: string;
  description: string;
  detailed_info: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // Prevent multiple updates

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (hasFetched) return; // Prevent duplicate fetch calls

      setHasFetched(true);
      setLoading(true);

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_product_details?id=${id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch product details");
        }

        setProduct(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, hasFetched]); // Dependency ensures it only runs once per id change

  if (loading)
    return <p className="text-center text-gray-500 text-xl">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 text-xl font-semibold">{error}</p>
    );
  if (!product)
    return (
      <p className="text-center text-gray-500 text-xl">Product not found.</p>
    );

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row items-center lg:items-start gap-8">
      {/* Left Side - Image & Name */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg shadow-lg"
        />
        <h1 className="text-4xl font-bold text-gray-800 mt-4 text-center lg:text-left">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600 mt-2">{product.description}</p>
      </div>

      {/* Right Side - Details */}
      <div className="w-full lg:w-2/3 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mt-6 text-gray-800 border-b-2 pb-2">
          Detailed Information
        </h2>

        {/* Beautified Markdown Styling */}
        <div className="mt-4 text-lg text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400 shadow-sm">
          <ReactMarkdown
            components={{
              h1: (props) => (
                <h1
                  className="text-2xl font-bold mt-4 text-blue-700"
                  {...props}
                />
              ),
              h2: (props) => (
                <h2
                  className="text-xl font-semibold mt-3 text-blue-600"
                  {...props}
                />
              ),
              h3: (props) => (
                <h3
                  className="text-lg font-medium mt-2 text-blue-500"
                  {...props}
                />
              ),
              p: (props) => <p className="mt-2 text-gray-700" {...props} />,
              ul: (props) => (
                <ul
                  className="list-disc list-inside mt-2 space-y-1 text-gray-700"
                  {...props}
                />
              ),
              ol: (props) => (
                <ol
                  className="list-decimal list-inside mt-2 space-y-1 text-gray-700"
                  {...props}
                />
              ),
              li: (props) => <li className="ml-4" {...props} />,
              strong: (props) => (
                <strong className="text-gray-900 font-semibold" {...props} />
              ),
            }}
          >
            {product.detailed_info}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
