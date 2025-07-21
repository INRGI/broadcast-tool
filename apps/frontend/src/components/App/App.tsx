import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Common/Layout";
import { lazy } from "react";
import NotFound from "../../pages/NotFound";

const BroadcastTool = lazy(
  () => import("../../pages/BroadcastTool/BroadcastTool")
);
const AdminBroadcastTool = lazy(
  () => import("../../pages/AdminBroadcastTool/AdminBroadcastTool")
);

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BroadcastTool />} />

        <Route path="/admin" element={<AdminBroadcastTool />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
