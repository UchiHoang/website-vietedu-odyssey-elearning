import { GraduationCap, Mail, Phone, Facebook, Youtube, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer id="contact" className={`bg-accent text-accent-foreground relative overflow-hidden ${className}`}>
      {/* Subtle education icons in footer background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <GraduationCap className="absolute -top-4 right-10 h-10 w-10 text-accent-foreground/60" />
        <Sparkles className="absolute bottom-6 left-10 h-6 w-6 text-accent-foreground/70" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="space-y-4" variants={fadeInUp}>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-heading font-bold flex items-center gap-1">
                VietEdu Odyssey
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <p className="text-sm opacity-90">
              Học qua chơi với văn hóa Việt Nam
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-heading font-bold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="opacity-90 hover:opacity-100 transition-opacity">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="#about" className="opacity-90 hover:opacity-100 transition-opacity">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="#classes" className="opacity-90 hover:opacity-100 transition-opacity">
                  Lớp học
                </Link>
              </li>
              <li>
                <Link to="#leaderboard" className="opacity-90 hover:opacity-100 transition-opacity">
                  Xếp hạng
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-heading font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-heading font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@vietedu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                  <Youtube className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-accent-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>© 2025 VietEdu Odyssey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
