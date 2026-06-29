import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaThLarge,
  FaUserCircle,
  FaChartPie,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useSidebar } from "../../Contexts/SidebarContext";
import logo1 from "../../../assets/userImages/Logo/logo_lght.png";
import logo2 from "../../../assets/Logo/ggl-icon.png";

const navItems = [
  { icon: <FaThLarge />, name: "Dashboard", path: "dashboard" },
  {
    icon: <FaWallet />,
    name: "Deposit",
    subItems: [
      { name: "Deposit", path: "deposits" },
      { name: "Report", path: "deposit-report" },
    ],
  },
  {
    icon: <FaChartPie />,
    name: "Invest Property",
    subItems: [
      { name: "Property Investments", path: "property-investments" },
      { name: "Property Report", path: "property-investment-report" },
    ],
  },
  {
    icon: <FaClockRotateLeft />,
    name: "KYC",
    subItems: [
      { name: "Submit KYC", path: "kyc-submit" },
      { name: "KYC Report", path: "kyc-submit-report" },
    ],
  },
  { icon: <FaHeadset />, name: "Support", path: "support" },
  { icon: <FaUserCircle />, name: "Profile", path: "my-profile" },
  { icon: <FaSignOutAlt />, name: "Logout", action: "logout" },
];

const Sidebar = () => {
  const { isExpanded, isMobileOpen, setIsMobileOpen, isHovered, setIsHovered } =
    useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const showLabels = isExpanded || isHovered || isMobileOpen;

  const isActive = useCallback(
    (path) => Boolean(path && location.pathname.includes(path)),
    [location.pathname]
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    navigate("/user/login");
  };

  useEffect(() => {
    let matched = false;
    navItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) {
          setOpenSubmenu({ index });
          matched = true;
        }
      });
    });
    if (!matched) {
      setOpenSubmenu(null);
    }
  }, [isActive, location.pathname]);

  useEffect(() => {
    if (openSubmenu === null) return;
    const key = `main-${openSubmenu.index}`;
    if (subMenuRefs.current[key]) {
      setSubMenuHeight((prev) => ({
        ...prev,
        [key]: subMenuRefs.current[key]?.scrollHeight || 0,
      }));
    }
  }, [openSubmenu, showLabels]);

  const handleSubmenuToggle = (index) => {
    if (!showLabels) return;
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  const renderMenuItems = () => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => {
        if (nav.action === "logout") {
          return (
            <li key={nav.name}>
              <button
                type="button"
                onClick={handleLogout}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-sm transition ${
                  showLabels ? "justify-start gap-4" : "justify-center"
                } bg-red-50 text-red-600 hover:bg-red-100`}
              >
                <span className="text-lg">{nav.icon}</span>
                {showLabels && <span className="font-medium">{nav.name}</span>}
              </button>
            </li>
          );
        }

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmenuToggle(index)}
                  className={`flex w-full items-center rounded-xl px-4 py-3 text-sm transition ${
                    showLabels ? "justify-start gap-4" : "justify-center"
                  } ${
                    openSubmenu?.index === index
                      ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{nav.icon}</span>
                  {showLabels && (
                    <>
                      <span className="flex-1 text-left">{nav.name}</span>
                      <FaChevronDown
                        className={`transition-transform ${
                          openSubmenu?.index === index ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                {showLabels && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[`main-${index}`] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu?.index === index
                          ? `${subMenuHeight[`main-${index}`] || 0}px`
                          : "0px",
                    }}
                  >
                    <ul className="ml-4 mt-2 space-y-1">
                      {nav.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`block rounded-xl px-3 py-2 text-sm ${
                              isActive(sub.path)
                                ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link
                to={nav.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-sm transition ${
                  showLabels ? "justify-start gap-4" : "justify-center"
                } ${
                  isActive(nav.path)
                    ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{nav.icon}</span>
                {showLabels && <span>{nav.name}</span>}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-[9999] h-screen border-r border-gray-200 bg-[linear-gradient(to_top,#D0FFFD_0%,#FFFFFF_100%)] shadow-lg transition-all duration-300
        w-[245px]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${showLabels ? "lg:w-[245px]" : "lg:w-[73px]"}`}
      onMouseEnter={() => {
        if (!isExpanded && !isMobileOpen) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`border-b border-gray-200 py-6 ${
          showLabels ? "px-6" : "px-2"
        } flex ${showLabels ? "justify-start" : "justify-center"}`}
      >
        <Link to="/" onClick={() => setIsMobileOpen(false)}>
          {showLabels ? (
            <img src={logo1} alt="Logo" width={150} />
          ) : (
            <img src={logo2} alt="Logo" width={34} />
          )}
        </Link>
      </div>

      <div className="h-[calc(100%-84px)] overflow-y-auto px-3 py-6">
        {renderMenuItems()}
      </div>
    </aside>
  );
};

export default Sidebar;
