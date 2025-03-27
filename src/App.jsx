import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../src/Components/Layout";
import QiblaPage from "../src/Pages/pages/QiblaPage";
import AdhkarPage from "../src/Pages/pages/AdhkarPage";
import Mainsec from "../src/Components/Mainsec";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Mainsec />} />
          <Route path="qibla" element={<QiblaPage />} />
          <Route path="adhkar" element={<AdhkarPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
