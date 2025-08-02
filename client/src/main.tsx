import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Chart.js for reports
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(<App />);
