import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About Us - Commercelly"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Welcome to Commercelly, your number one source for all things
            related to e-commerce. We're dedicated to giving you the very best
            of online shopping experience, with a focus on dependability,
            customer service, and uniqueness.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
