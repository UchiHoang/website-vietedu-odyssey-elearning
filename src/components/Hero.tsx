import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Wand2, BookOpen, Gamepad2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, staggerContainer, zoomIn } from "./animations";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-background via-highlight to-secondary/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" />

        {/* Subtle background icons */}
        <div className="absolute inset-0 opacity-20">
          <BookOpen className="absolute top-24 right-[18%] h-10 w-10 text-accent/50" />
          <Gamepad2 className="absolute bottom-24 left-[15%] h-10 w-10 text-primary/50" />
          <Sparkles className="absolute top-10 left-1/2 h-8 w-8 text-secondary/70" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="space-y-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all duration-300 shimmer-wrapper"
              variants={fadeInLeft}
            >
              <Sparkles className="h-4 w-4" />
              <span>Học qua chơi - Vui là chính!</span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight"
              variants={fadeInLeft}
            >
              Hành trình học tập <br />
              <span className="relative inline-flex items-center gap-2 text-primary">
                <span className="animate-pulse">kỳ diệu</span>
                <Wand2 className="h-6 w-6" />
              </span>{" "}
              cùng <br />
              văn hóa Việt
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-lg"
              variants={fadeInLeft}
            >
              Khám phá toán học và ngôn ngữ qua những câu chuyện dân gian Việt Nam đầy màu sắc và thú vị
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInLeft}
            >
              <Link to="/lessons">
                <Button size="lg" className="text-lg hover-scale shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                  Bắt đầu học
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById("classes");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg hover-scale border-2 hover:border-primary/50 transition-all duration-300 w-full sm:w-auto"
                >
                  Khám phá lớp học
                </Button>
              </button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-8 pt-4"
              variants={fadeInLeft}
            >
              <div className="group cursor-default transition-transform duration-300 hover:scale-125 hover:-translate-y-1">
                <div className="text-3xl font-bold text-emerald-500 group-hover:drop-shadow">
                  5000+
                </div>
                <div className="text-sm text-emerald-700/80">
                  Học sinh
                </div>
              </div>
              <div className="group cursor-default transition-transform duration-300 hover:scale-125 hover:-translate-y-1">
                <div className="text-3xl font-bold text-orange-500 group-hover:drop-shadow">
                  200+
                </div>
                <div className="text-sm text-orange-700/80">
                  Giáo viên
                </div>
              </div>
              <div className="group cursor-default transition-transform duration-300 hover:scale-125 hover:-translate-y-1">
                <div className="text-3xl font-bold text-sky-500 group-hover:drop-shadow">
                  50+
                </div>
                <div className="text-sm text-sky-700/80">
                  Trường học
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            variants={fadeInRight}
          >
            <motion.div
              className="aspect-video rounded-3xl overflow-hidden card-shadow hover-lift transition-all duration-500 group bg-card"
              variants={zoomIn}
            >
              <img
                src={heroBanner}
                alt="Học qua chơi với văn hóa Việt"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-secondary rounded-full opacity-60 blur-2xl"
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full opacity-60 blur-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
