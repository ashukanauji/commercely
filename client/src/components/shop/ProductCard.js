import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/cart";
import { formatCurrency } from "../../utils/format";

const ProductCard = ({ product }) => {
  const { cart, setCart } = useCart();

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
      return;
    }

    setCart((currentCart) => [...currentCart, { ...product, cartQuantity: 1 }]);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-image-wrap">
        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <div className="product-card-body">
        <div className="product-card-top">
          <span className="pill">{product.category?.name || "Featured"}</span>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description.slice(0, 90)}...</p>
        <div className="product-card-actions">
          <Link to={`/product/${product.slug}`} className="secondary-btn">
            View details
          </Link>
          <button type="button" className="primary-btn" onClick={handleAddToCart}>
            <FiShoppingCart /> Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
