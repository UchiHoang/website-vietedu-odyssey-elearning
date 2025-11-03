import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, GraduationCap } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onRoleChange?: (role: "student" | "teacher" | "admin") => void;
  currentRole?: "student" | "teacher" | "admin";
}

const Header = ({ onRoleChange, currentRole = "student" }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    sectionId: string
  ) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      scrollToSection(sectionId);
      setMobileMenuOpen(false);
    } else {
      navigate(`/#${sectionId}`);
      // Delay to allow route change, then attempt smooth scroll
      setTimeout(() => scrollToSection(sectionId), 0);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover-scale">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-heading font-bold text-primary">
            VietEdu Odyssey
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="text-foreground hover:text-primary font-medium transition-colors"
          >
            Trang chủ
          </a>
          <Link to="/lessons" className="text-foreground hover:text-primary font-medium transition-colors">
            Bài giảng
          </Link>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "about")}
            className="text-foreground hover:text-primary font-medium transition-colors"
          >
            Giới thiệu
          </a>
          <a
            href="#classes"
            onClick={(e) => handleNavClick(e, "classes")}
            className="text-foreground hover:text-primary font-medium transition-colors"
          >
            Lớp học
          </a>
          <a
            href="#leaderboard"
            onClick={(e) => handleNavClick(e, "leaderboard")}
            className="text-foreground hover:text-primary font-medium transition-colors"
          >
            Xếp hạng
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="text-foreground hover:text-primary font-medium transition-colors"
          >
            Liên hệ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button className="hidden md:flex" asChild>
            <Link to="/auth">Đăng nhập</Link>
          </Button>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="block py-2 text-foreground hover:text-primary"
          >
            Trang chủ
          </a>
          <Link to="/lessons" className="block py-2 text-foreground hover:text-primary">
            Bài giảng
          </Link>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "about")}
            className="block py-2 text-foreground hover:text-primary"
          >
            Giới thiệu
          </a>
          <a
            href="#classes"
            onClick={(e) => handleNavClick(e, "classes")}
            className="block py-2 text-foreground hover:text-primary"
          >
            Lớp học
          </a>
          <a
            href="#leaderboard"
            onClick={(e) => handleNavClick(e, "leaderboard")}
            className="block py-2 text-foreground hover:text-primary"
          >
            Xếp hạng
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="block py-2 text-foreground hover:text-primary"
          >
            Liên hệ
          </a>
          <Button className="w-full" asChild>
            <Link to="/auth">Đăng nhập</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
