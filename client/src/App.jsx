import HomePage from "./routes/homePage/homePage";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import UpdatePostPage from "./routes/updatePost";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import NotFound from "./routes/noteFound";
import AddProperty from "./routes/newPostPage/newPostPage";

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
function App() {
function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <MainLayout />
    );
  }
}
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Layout />,
  //     children: [
  //       {
  //         path: "/",
  //         element: <HomePage />,
  //       },
  //       {
  //         path: "/list",
  //         element: <ListPage />,
  //         loader: listPageLoader,
  //       },
  //       {
  //         path: "/:id",
  //         element: <SinglePage />,
  //         // loader: singlePageLoader,
  //       },

  //       {
  //         path: "/login",
  //         element: <Login />,
  //       },
  //       {
  //         path: "/register",
  //         element: <Register />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/",
  //     element: <RequireAuth />,
  //     children: [
  //       {
  //         path: "/profile",
  //         element: <ProfilePage />,
  //         // loader: profilePageLoader
  //       },
  //       {
  //         path: "/profile/update",
  //         element: <ProfileUpdatePage />,
  //       },
  //       {
  //         path: "/add",
  //         element: <NewPostPage />,
  //       },
  //       {
  //         path: "/update/:id",
  //         element: <UpdatePostPage />,
  //       }
  //     ],
  //   },
  // ]);

  // return <RouterProvider router={router} />;
  return(
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<ListPage />} />
        <Route path=":id" element={<SinglePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/" element={<RequireAuth />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/update" element={<ProfileUpdatePage />} />
        <Route path="update/:id" element={<UpdatePostPage />} />
        <Route path="add-property" element={<AddProperty />} />
      </Route>
    </Routes>
  )
  
  }

export default App;
