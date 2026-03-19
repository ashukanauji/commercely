import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title="About Commercely">
      <section className="container section-block split-layout">
        <div>
          <span className="eyebrow">About us</span>
          <h1>Built to showcase a complete full-stack ecommerce experience.</h1>
          <p>
            Commercely combines a React storefront, Express APIs, and MongoDB-backed
            product, user, and order management into a polished shopping workflow.
          </p>
        </div>
        <img src="/images/about.jpeg" alt="About Commercely" className="cover-image" />
      </section>
    </Layout>
  );
};

export default About;
