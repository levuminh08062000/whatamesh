import "./App.scss";
import Whatamesh from "./components/Whatamesh";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function () {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Whatamesh</title>
        <meta name="description" content="Whatamesh" />
      </Helmet>
      <Whatamesh />
    </HelmetProvider>
  );
}
