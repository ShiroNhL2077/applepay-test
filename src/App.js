import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import Dashboard from "./organizerDash/Dashboard/Dashboard";
import LandingPage from "./landingPage/LandingPage";
import NotFound from "./landingPage/components/NotFound";
import { useEffect, useState } from "react";
import ResetForms from "./landingPage/components/ResetPassword/ResetForms/ResetForms";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/userAction";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import Navbar from "./landingPage/components/Navbar/Navbar";
import Footer from "./landingPage/components/Footer/Footer";
import BuyerProfilePage from "./buyerProfilePage/BuyerProfilePage";
import Cart from "./landingPage/components/Cart/Cart";
import CheckOut from "./landingPage/components/CheckOut/CheckOut";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser()); // Dispatch the action to load the user data
  }, [dispatch]);
  // eslint-disable-next-line
  const [refreshCartIcon, setRefreshCartIcon] = useState(0);

  const Layout = ({ children }) => {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* test deploy again */}

            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<BuyerProfilePage />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckOut />} />
            {/* <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileTest />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/auth/reset-password/:token"
              element={<ResetForms />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
