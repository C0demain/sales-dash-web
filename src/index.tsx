import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoutes } from "routes/AppRoutes";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <AppRoutes />
);