import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">PRIVACY POLICY</h1>
          <p className="text-justify mt-2">
            At Commercelly, we are committed to protecting your privacy. This
            Privacy Policy outlines how we collect, use, and safeguard your
            information when you visit our website or use our services.
          </p>
          <p className="mt-3">
            We may collect personal information such as your name, email
            address, and payment details when you make a purchase or register on
            our site. This information is used to process transactions and
            provide you with a better shopping experience.
          </p>
          <p className="mt-3">
            We do not share your personal information with third parties without
            your consent, except as required by law or to fulfill your orders.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
