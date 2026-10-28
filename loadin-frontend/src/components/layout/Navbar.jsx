import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Logo from "./Logo";
import Button from "../ui/Button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      title: "Home",
      href: "#home",
      type: "scroll",
    },
    {
      title: "How It Works",
      href: "#how-it-works",
      type: "scroll",
    },
    {
      title: "Features",
      href: "#features",
      type: "scroll",
    },
    {
      title: "Testimonials",
      href: "#testimonials",
      type: "scroll",
    },
    {
      title: "Contact",
      href: "#footer",
      type: "scroll",
    },
  ];

  return (
    <>
      <header
        className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-300
        ${
          isScrolled
            ? "bg-white/85 backdrop-blur-xl shadow-md border-b border-slate-200"
            : "bg-transparent"
        }
      `}
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* Logo */}

            <Logo />

            {/* Desktop Navigation */}

            <nav className="hidden lg:flex items-center gap-10">

              {navLinks.map((item) =>

                item.type === "route" ? (

                  <NavLink
                    key={item.title}
                    to={item.href}
                    className={({ isActive }) =>
                      `
                      relative
                      cursor-pointer
                      font-medium
                      transition

                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-700 hover:text-blue-600"
                      }

                      after:absolute
                      after:left-0
                      after:-bottom-2
                      after:h-[3px]
                      after:w-0
                      after:rounded-full
                      after:bg-blue-600
                      after:transition-all
                      hover:after:w-full
                    `
                    }
                  >
                    {item.title}
                  </NavLink>

                ) : (

                  <a
                    key={item.title}
                    href={item.href}
                    className="
                    relative
                    cursor-pointer
                    font-medium
                    text-slate-700
                    hover:text-blue-600
                    transition

                    after:absolute
                    after:left-0
                    after:-bottom-2
                    after:h-[3px]
                    after:w-0
                    after:rounded-full
                    after:bg-blue-600
                    after:transition-all
                    hover:after:w-full
                  "
                  >
                    {item.title}
                  </a>

                )

              )}

            </nav>

            {/* Desktop Buttons */}

            <div className="hidden lg:flex items-center gap-3">

              <Link to="/login">

                <Button variant="outline">

                  Login

                </Button>

              </Link>

              <Link to="/register">

                <Button>

                  Register

                </Button>

              </Link>

            </div>

            {/* Mobile Toggle */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
              lg:hidden
              cursor-pointer
              p-2
              rounded-lg
              hover:bg-slate-100
              transition
              "
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Menu */}

      <AnimatePresence>

        {mobileOpen && (

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="
            fixed
            top-20
            left-4
            right-4
            z-40
            rounded-2xl
            bg-white
            shadow-xl
            border
            border-slate-200
            lg:hidden
            "
          >

            <div className="p-6 flex flex-col gap-5">

              {navLinks.map((item) =>

                item.type === "route" ? (

                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-medium text-slate-700"
                  >
                    {item.title}
                  </Link>

                ) : (

                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-medium text-slate-700"
                  >
                    {item.title}
                  </a>

                )

              )}

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Login
                </Button>
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="w-full">
                  Register
                </Button>
              </Link>

            </div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
}