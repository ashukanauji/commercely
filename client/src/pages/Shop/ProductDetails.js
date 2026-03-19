import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/shop/ProductCard";
import { useCart } from "../../context/cart";
import { formatCurrency } from "../../utils/format";
import api from "../../utils/api";

const ProductDetails = () => {
  const { slug } = useParams();
  const { cart, setCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/v1/product/get-product/${slug}`);
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item._id === product._id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        )
      );
    } else {
      setCart((currentCart) => [...currentCart, { ...product, cartQuantity: 1 }]);
    }
    toast.success("Added to cart");
  };

  return (
    <Layout title={product ? `${product.name} | Commercely` : "Product details"}>
      <section className="container section-block">
        {loading ? (
          <div className="center-state">Loading product...</div>
        ) : product ? (
          <>
            <div className="details-grid card-panel">
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                alt={product.name}
                className="details-image"
              />
              <div className="details-content">
                <span className="pill">{product.category?.name}</span>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <div className="details-meta">
                  <strong>{formatCurrency(product.price)}</strong>
                  <span>{product.quantity} items in stock</span>
                  <span>{product.shipping ? "Ships free" : "Digital / pickup"}</span>
                </div>
                <button type="button" className="primary-btn" onClick={handleAddToCart}>
                  <FiShoppingCart /> Add to cart
                </button>
              </div>
            </div>

            <div className="section-heading top-gap">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2>Related products</h2>
              </div>
            </div>
            <div className="product-grid">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state card-panel">Product not found.</div>
        )}
      </section>
    </Layout>
  );
};

export default ProductDetails;
