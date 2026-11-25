import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import App from "./App.jsx";
import NewAccount from "./NewAccount.jsx";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import TrySebas from "./components/login_folder/TrySebas.jsx";
import Discover from "./components/login_folder/Discover.jsx";
import GetHelp from "./components/login_folder/GetHelp.jsx";
import Tarification from "./components/login_folder/Tarification.jsx";

export default function AppRouter() {
  return (
      <GoogleReCaptchaProvider reCaptchaKey={"6LeT8JQsAAAAAMPOINA491NrqHHXRlGNdD9olgIw"}>
    <Routes>
      <Route path="/" element={<Discover />} />
      <Route path="/app" element={<App />} />
      <Route path="/create_account" element={<NewAccount />} />
      <Route path="/try-sebas" element={<TrySebas />} />
      <Route path="/login" element={<Login />} />
      <Route path="/get-help" element={<GetHelp />} />
      <Route path="/tarifs" element={<Tarification />} />
    </Routes>
      </GoogleReCaptchaProvider>
  );
}
