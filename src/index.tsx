import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRoutes } from "routes/AppRoutes";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <AppRoutes />
);