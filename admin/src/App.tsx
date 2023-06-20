import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Admin from "./pages/Admin";
import Guard from "./pages/Guard";
import EventPage from "./pages/EventPage";
import LocationPage from "./pages/LocationPage";

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
      {
        path: "event/:id/:location_id",
        element: <LocationPage />,
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
