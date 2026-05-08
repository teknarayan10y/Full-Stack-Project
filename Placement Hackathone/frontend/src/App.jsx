import { BrowserRouter, Routes, Route } from "react-router-dom";
import MasterJoin from "./MasterJoin";
import AdminCreateEvent from "./AdminCreateEvent";
import Auth from "./pages/Auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/join/:slug" element={<MasterJoin />} />
        <Route path="/admin/create" element={<AdminCreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;