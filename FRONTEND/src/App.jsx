import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LogInteraction from "./pages/LogInteraction";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/log-interaction" element={<LogInteraction />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;