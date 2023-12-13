import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Sidebar = ({ showSidebar, toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const closeSidebar = (e) => {
    // Check if the click is outside the sidebar
    if (showSidebar && !e.target.closest(".w-64")) {
      if (pathname.includes("/dashboard/customers")) {
        router.push("/dashboard/customers");
      }
      if (pathname.includes("/dashboard/suppliers")) {
        router.push("/dashboard/suppliers");
      }
      //toggleSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);

    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, [showSidebar, toggleSidebar]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 fixed inset-y-0 right-0 z-50 transition-transform duration-300 ease-in-out transform ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar content */}
        <div className="p-4 text-white">
          <h1 className="text-xl font-bold mb-4">Sidebar</h1>
          {/* Add links or other content for the sidebar */}
          <ul>
            <li className="py-2 hover:bg-gray-700">
              <a href="#" className="block">
                Link 1
              </a>
            </li>
            <li className="py-2 hover:bg-gray-700">
              <a href="#" className="block">
                Link 2
              </a>
            </li>
            {/* Add more sidebar links as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
