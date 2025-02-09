import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { selectSelectedUser } from "../slices/chatSlice";
import { useSelector } from "react-redux";

const HomePage = () => {
  const selectedUser = useSelector(selectSelectedUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile when chat is selected
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && selectedUser) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar with responsive visibility */}
            <div className={`${isSidebarOpen ? "flex" : "hidden"} md:flex`}>
              <Sidebar />
            </div>

            {/* Main chat area */}
            {!selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;