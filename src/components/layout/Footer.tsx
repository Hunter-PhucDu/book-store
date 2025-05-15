import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiArrowRight,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">About BookStore</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 opacity-75"></span>
            </h3>
            <p className="text-gray-300">
              Your one-stop destination for books across all genres. We provide
              quality books at affordable prices with excellent customer
              service.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-200"
                aria-label="Facebook"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-200"
                aria-label="Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-200"
                aria-label="Instagram"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-200"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 opacity-75"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/store/new-releases"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  New Releases
                </Link>
              </li>
              <li>
                <Link
                  href="/store/deals"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Customer Service</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 opacity-75"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <FiArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 opacity-75"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 group">
                <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5 group-hover:text-blue-400 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  123 BookStore Street
                  <br />
                  Reading City, BC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <FiPhone className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  (123) 456-7890
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <FiMail className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  support@bookstore.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">
              Subscribe to our Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Stay updated with our latest releases, deals, and literary news.
            </p>
            <form className="flex flex-wrap md:flex-nowrap gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 w-full md:w-auto px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors relative overflow-hidden group"
              >
                <span className="relative z-10">Subscribe</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-8">
          &copy; {new Date().getFullYear()} BookStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
