import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Admin from "./pages/Admin";
import Guard from "./pages/Guard";
import EventPage from "./pages/EventPage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Admin />,
      },
      {
        path: "event/:id",
        element: <EventPage />,
      },
    ],
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
