import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-background via-highlight to-secondary/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all duration-300 animate-fade-in">
              <span>Học qua chơi - Vui là chính!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Hành trình học tập <br />
              <span className="text-primary animate-pulse">kỳ diệu</span> cùng <br />
              văn hóa Việt
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Khám phá toán học và ngôn ngữ qua những câu chuyện dân gian Việt Nam đầy màu sắc và thú vị
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="text-lg hover-scale shadow-lg hover:shadow-xl transition-all duration-300">
                Bắt đầu chơi
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to={"/data"}>
                <Button size="lg" variant="outline" className="text-lg hover-scale border-2 hover:border-primary/50 transition-all duration-300">
                  Khám phá lớp học
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="group">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">5000+</div>
                <div className="text-sm text-muted-foreground">Học sinh</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">200+</div>
                <div className="text-sm text-muted-foreground">Giáo viên</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-sm text-muted-foreground">Trường học</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-video rounded-3xl overflow-hidden card-shadow hover-lift transition-all duration-500 group">
              <img
                src={heroBanner}
                alt="Học qua chơi với văn hóa Việt"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary rounded-full opacity-50 blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full opacity-50 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
