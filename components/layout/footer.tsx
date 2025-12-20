import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center space-x-2 px-2 py-4 border-t-2 border-t-gray-300">
      <Copyright size={12} />
      {new Date().getFullYear()} Proflow. All rights reserved.
    </footer>
  );
};

export default Footer;
