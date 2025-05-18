import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Về Cửa hàng sách Tây Bắc</h3>
            <p className="text-gray-400">
              Cửa hàng sách Tây Bắc là một cửa hàng sách được thiết kế để cung
              cấp cho khách hàng những cuốn sách tốt nhất với giá cả phải chăng
              và dịch vụ tốt nhất.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/store/new-releases"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  New Releases
                </Link>
              </li>
              <li>
                <Link
                  href="/store/deals"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400">
                  123 BookStore Street
                  <br />
                  Reading City, BC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">support@bookstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">
              Subscribe to our Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest releases, deals, and literary news.
            </p>
            <form className="flex flex-wrap md:flex-nowrap gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 w-full md:w-auto px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} BookStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
