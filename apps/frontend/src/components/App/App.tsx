import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Common/Layout";
import { lazy } from "react";
import NotFound from "../../pages/NotFound";

const Home = lazy(() => import("../../pages/Home/Home"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
