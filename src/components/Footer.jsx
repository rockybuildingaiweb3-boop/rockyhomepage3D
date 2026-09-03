import { Link } from "react-router-dom";
import { socialLinks, personalInfo } from "../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer font-poppins mt-auto'>
      <hr className='border-[#E7E7B7]' />

      <div className='footer-container'>
        <p className='text-sm text-[#263746]/70'>
          © {currentYear} <strong className='text-[#263746]'>{personalInfo.name}</strong>. Built with Three.js & React.
        </p>

        <div className='flex gap-4 justify-center items-center'>
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              target={link.link.startsWith("http") ? "_blank" : undefined}
              rel={link.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className='w-9 h-9 rounded-full bg-[#F5F5F0] shadow-sm border border-[#E7E7B7] flex items-center justify-center hover:scale-110 hover:border-[#C97851] transition-all'
              title={link.name}
            >
              <img
                src={link.iconUrl}
                alt={link.name}
                className='w-5 h-5 object-contain'
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
