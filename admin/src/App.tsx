import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Admin from "./pages/Admin";
import Guard from "./pages/Guard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
  },
]);

function App() {
  return (
    <div className="w-full h-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
