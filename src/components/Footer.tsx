import { GraduationCap, Mail, Phone, Facebook, Youtube, Heart, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";

interface FooterProps {
  compact?: boolean; // Chế độ gọn cho trang bài học
  className?: string; // Bổ sung class tùy chỉnh
}

const Footer = ({ compact = false, className = "" }: FooterProps) => {
  const linkVariants = {
    hover: { 
      x: 5, 
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hover: { 
      scale: 1.2, 
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  // --- CHẾ ĐỘ COMPACT (Dành cho trang Bài Học) ---
  if (compact) {
    return (
      <footer className={`bg-accent text-accent-foreground border-t border-accent-foreground/10 py-3 relative z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] ${className}`}>
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                V
              </div>
              <span className="font-heading font-bold text-lg hidden sm:inline-block">
                VietEdu Odyssey
              </span>
            </div>
            <div className="h-4 w-[1px] bg-accent-foreground/20 hidden md:block"></div>
            <p className="text-xs opacity-80">
              © 2025. Made with <Heart className="h-3 w-3 inline text-red-500 fill-red-500 mx-0.5" /> in Vietnam.
            </p>
          </div>

          {/* Links ngang */}
          <div className="flex items-center gap-6 text-xs font-semibold opacity-70">
            <Link to="/" className="hover:text-primary transition-colors hover:opacity-100">TRANG CHỦ</Link>
            <Link to="/#about" className="hover:text-primary transition-colors hover:opacity-100">GIỚI THIỆU</Link>
            <button className="hover:text-primary transition-colors hover:opacity-100">ĐIỀU KHOẢN</button>
            
            {/* Social Icons nhỏ */}
            <div className="flex gap-2 ml-2 pl-4 border-l border-accent-foreground/20">
               <a 
                 href="https://www.facebook.com/HCMUE.VN" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-6 h-6 bg-accent-foreground/5 rounded-full hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
               >
                 <Facebook className="h-3 w-3" />
               </a>
               <a 
                 href="https://www.youtube.com/@vioedutv.official" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-6 h-6 bg-accent-foreground/5 rounded-full hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
               >
                 <Youtube className="h-3 w-3" />
               </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // --- CHẾ ĐỘ FULL (Dành cho Trang chủ) ---
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
          {/* CỘT 1: Logo & Social */}
          <motion.div className="space-y-4" variants={fadeInUp}>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-heading font-bold flex items-center gap-1">
                VietEdu Odyssey
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <p className="text-sm opacity-90">
              Học qua chơi với văn hóa Việt Nam. Nền tảng giáo dục tương tác hàng đầu dành cho học sinh tiểu học.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <motion.a 
                href="https://www.facebook.com/HCMUE.VN" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://www.youtube.com/@vioedutv.official" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* CỘT 2: Liên kết */}
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

          {/* CỘT 3: Hỗ trợ */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-heading font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Hướng dẫn sử dụng",
                "Câu hỏi thường gặp",
                "Chính sách bảo mật",
                "Điều khoản sử dụng"
              ].map((item, index) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <motion.a 
                    href="#" 
                    className="opacity-90 hover:opacity-100 transition-opacity inline-block"
                    variants={linkVariants}
                    whileHover="hover"
                    onClick={(e) => e.preventDefault()}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CỘT 4: Liên hệ */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-heading font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <motion.li 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="bg-primary/10 p-2 rounded-full text-primary"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mail className="h-4 w-4" />
                </motion.div>
                <span>contact@vietedu.vn</span>
              </motion.li>
              
              <motion.li 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="bg-primary/10 p-2 rounded-full text-primary"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Phone className="h-4 w-4" />
                </motion.div>
                <span>(+84) 28 3835 2020</span>
              </motion.li>

              <motion.li 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="bg-primary/10 p-2 rounded-full text-primary mt-[-2px]"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <MapPin className="h-4 w-4" />
                </motion.div>
                <span className="leading-snug">
                  280 An Dương Vương, Phường 4, Quận 5, TP. Hồ Chí Minh
                </span>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bản quyền */}
        <motion.div 
          className="border-t border-accent-foreground/20 pt-8 text-center text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            className="flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            © 2025 VietEdu Odyssey. Made with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.span>
            in Vietnam
          </motion.p>
        </motion.div>

        <div className="border-t border-accent-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>© 2025 VietEdu Odyssey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;