import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/161276/moscow-cathedral-mosque-prospekt-mira-ramadan-sky-161276.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <nav className="bg-black/40 backdrop-blur-md p-3 sticky top-0 z-50 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mx-auto max-w-7xl px-2">
          <h1 className="text-2xl font-bold text-white mb-2 md:mb-0">
            دليل المسلم{" "}
          </h1>
          <div className="flex flex-wrap justify-center gap-1">
            <Link
              to="/"
              className="px-3 py-1 bg-green-800/90 text-white rounded-md hover:bg-green-700 transition text-sm md:text-base"
            >
              الرئيسية
            </Link>
            <Link
              to="/qibla"
              className="px-3 py-1 bg-green-800/90 text-white rounded-md hover:bg-green-700 transition text-sm md:text-base"
            >
              القبلة
            </Link>
            <Link
              to="/adhkar"
              className="px-3 py-1 bg-green-800/90 text-white rounded-md hover:bg-green-700 transition text-sm md:text-base"
            >
              الأذكار
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <ToastContainer
        position="top-left"
        autoClose={3000}
        rtl={true}
        theme="dark"
        toastClassName="bg-green-800/90"
      />
    </div>
  );
};

export default Layout;
