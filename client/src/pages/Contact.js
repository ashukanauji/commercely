import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import Layout from "../components/Layout/Layout";

const Contact = () => {
  return (
    <Layout title="Contact Commercely">
      <section className="container section-block split-layout">
        <img src="/images/contactus.jpeg" alt="Support team" className="cover-image" />
        <div className="card-panel">
          <span className="eyebrow">Need help?</span>
          <h1>We are here for support</h1>
          <p>Reach out for product questions, order help, or admin support.</p>
          <div className="contact-stack">
            <p><BiMailSend /> support@commercely.com</p>
            <p><BiPhoneCall /> +1 (800) 555-0147</p>
            <p><BiSupport /> 24/7 customer care</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
