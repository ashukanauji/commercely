import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="app-shell">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
      </Helmet>
      <Toaster position="top-right" />
      <Header />
      <main className="page-shell">{children}</main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Commercely | Modern ecommerce storefront",
  description: "Discover curated fashion, electronics, lifestyle, and home essentials.",
  keywords: "ecommerce, shopping, fashion, home, electronics",
  author: "OpenAI",
};

export default Layout;
