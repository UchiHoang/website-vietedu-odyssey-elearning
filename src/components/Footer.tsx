import { GraduationCap, Mail, Phone, Facebook, Youtube, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface FooterProps {
  compact?: boolean; // Thêm prop này để bật chế độ gọn
}

const Footer = ({ compact = false }: FooterProps) => {
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
      <footer className="bg-accent text-accent-foreground border-t border-accent-foreground/10 py-3 relative z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
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
    <footer className="bg-accent text-accent-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* CỘT 1: Logo & Social */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GraduationCap className="h-8 w-8" />
              </motion.div>
              <span className="text-xl font-heading font-bold">
                VietEdu Odyssey
              </span>
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-heading font-bold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Trang chủ" },
                { to: "#about", label: "Giới thiệu" },
                { to: "#classes", label: "Lớp học" },
                { to: "#leaderboard", label: "Xếp hạng" }
              ].map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <motion.div variants={linkVariants} whileHover="hover">
                    <Link to={link.to} className="opacity-90 hover:opacity-100 transition-opacity inline-block">
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CỘT 3: Hỗ trợ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
                    onClick={(e) => e.preventDefault()} // Ngăn load lại trang khi click link demo
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CỘT 4: Liên hệ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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

              {/* Thêm phần Địa chỉ */}
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
        </div>

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
      </div>
    </footer>
  );
};

export default Footer;