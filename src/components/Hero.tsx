import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-background via-highlight to-secondary/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              <span>Học qua chơi - Vui là chính!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Hành trình học tập <br />
              <span className="text-primary">kỳ diệu</span> cùng <br />
              văn hóa Việt
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Khám phá toán học và ngôn ngữ qua những câu chuyện dân gian Việt Nam đầy màu sắc và thú vị
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg hover-scale">
                Bắt đầu chơi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg hover-scale">
                Khám phá lớp học
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Học sinh</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Giáo viên</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Trường học</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden card-shadow hover-lift">
              <img
                src={heroBanner}
                alt="Học qua chơi với văn hóa Việt"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary rounded-full opacity-50 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full opacity-50 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
