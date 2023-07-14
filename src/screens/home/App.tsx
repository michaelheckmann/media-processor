import { createRoot } from "react-dom/client";
import "../../global.css";
import { Root } from "./components/Root";

const root = createRoot(document.getElementById("app"));
root.render(<Root />);
