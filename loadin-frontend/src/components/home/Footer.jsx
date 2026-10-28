import {
  Truck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-slate-950 text-slate-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">

                <Truck className="text-white" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">

                  LoadIn

                </h2>

                <p className="text-xs text-slate-400">

                  Never Return Empty

                </p>

              </div>

            </div>

            <p className="mt-6 leading-7 text-slate-400">

              LoadIn connects truck drivers returning with empty
              vehicles to customers needing transportation,
              reducing empty miles and increasing driver earnings.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-white text-lg font-semibold mb-5">

              Quick Links

            </h3>

            <div className="space-y-3">

              <a href="#" className="block hover:text-blue-400 transition">

                Home

              </a>

              <a
                href="#how-it-works"
                className="block hover:text-blue-400 transition"
              >
                How It Works
              </a>

              <a
                href="#features"
                className="block hover:text-blue-400 transition"
              >
                Features
              </a>

              <a
                href="#testimonials"
                className="block hover:text-blue-400 transition"
              >
                Testimonials
              </a>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-white text-lg font-semibold mb-5">

              Contact

            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <Mail size={18} />

                <span>support@loadin.in</span>

              </div>

              <div className="flex items-center gap-3">

                <Phone size={18} />

                <span>+91 98765 43210</span>

              </div>

              <div className="flex items-center gap-3">

                <MapPin size={18} />

                <span>Hyderabad, India</span>

              </div>

            </div>

          </div>

          {/* Account */}

          <div>

            <h3 className="text-white text-lg font-semibold mb-5">

              Account

            </h3>

            <div className="space-y-3">

              <Link
                to="/driver/login"
                className="block hover:text-blue-400 transition"
              >
                Driver Login
              </Link>

              <Link
                to="/customer/login"
                className="block hover:text-blue-400 transition"
              >
                Customer Login
              </Link>

              <Link
                to="/register"
                className="block hover:text-blue-400 transition"
              >
                Register
              </Link>

            </div>

            {/* <div className="flex gap-4 mt-8">

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Github />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Linkedin />
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Instagram />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Twitter />
              </a> */}

            {/* </div> */}

          </div>

        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-slate-500">

            © 2026 LoadIn. All rights reserved.

          </p>

          <div className="flex gap-6 text-sm">

            <a href="#" className="hover:text-blue-400 transition">

              Privacy Policy

            </a>

            <a href="#" className="hover:text-blue-400 transition">

              Terms & Conditions

            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}