import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Pagenotfound = () => {
  return (
    <Layout title="Page not found | Commercely">
      <section className="center-state page-shell">
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="primary-btn">Back to home</Link>
      </section>
    </Layout>
  );
};

export default Pagenotfound;
