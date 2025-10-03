import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { useState } from "react";
import UploadModal from "../components/UploadModal";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar onTryClick={() => setShowModal(true)} />
      <Component {...pageProps} openUploadModal={() => setShowModal(true)} />
      <UploadModal show={showModal} onClose={() => setShowModal(false)} />
      <Footer />
    </>
  );
}
