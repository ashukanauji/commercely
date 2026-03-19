import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/shop/ProductCard";
import api from "../../utils/api";

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/api/v1/product/get-product"),
          api.get("/api/v1/category/get-category"),
        ]);
        setProducts(productRes.data.products);
        setCategories(categoryRes.data.category);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory
        ? product.category?._id === selectedCategory
        : true;
      const queryMatch = [product.name, product.description, product.category?.name]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [products, query, selectedCategory]);

  return (
    <Layout title="Shop all products | Commercely">
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Catalog</span>
            <h1>Shop the complete collection</h1>
          </div>
        </div>

        <div className="filter-bar card-panel">
          <input
            className="input-control"
            placeholder="Search products, categories, or keywords"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="input-control"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="center-state">Loading catalog...</div>
        ) : filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state card-panel">No products matched your search.</div>
        )}
      </section>
    </Layout>
  );
};

export default ProductListingPage;
