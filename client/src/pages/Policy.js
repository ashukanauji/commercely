import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title="Privacy policy | Commercely">
      <section className="container section-block card-panel prose-block">
        <span className="eyebrow">Privacy policy</span>
        <h1>Your information stays protected</h1>
        <p>
          We collect account, shipping, and order details only to provide the shopping
          experience, fulfill purchases, and support your account securely.
        </p>
        <p>
          Payment in this demo is mock-based, so no real card data is processed. User and
          order data remain within the application database and are never sold to third parties.
        </p>
      </section>
    </Layout>
  );
};

export default Policy;
