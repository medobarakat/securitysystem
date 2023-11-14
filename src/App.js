import { Container } from "@mui/material";
import React from "react";
import ContactForm from "./components/ContactForm";
import "./App.scss";
import HowItWork from "./components/HowItWork";
import Footer from "./components/Footer";
const App = () => {


  return (
    <div className="Wrapper">
      <Container>
        <h1>Help Protect Your Home with a New Security System</h1>
        <h3>
          Quick and easy. Get matched with the best Home Security company in
          your area
        </h3>
        <ContactForm />
        <HowItWork />
        <Footer />
      </Container>
    </div>
  );
};

export default App;
