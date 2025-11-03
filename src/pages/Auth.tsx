import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!",
      description: isLogin 
        ? "Chào mừng bạn quay trở lại!" 
        : "Tài khoản của bạn đã được tạo thành công."
    });
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Đăng nhập bằng Google",
      description: "Tính năng đang được phát triển"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto">
          
          {/* Back to Home */}
          <div className="mb-6 flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                ←
              </div>
              <span className="font-medium">Về trang chủ</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 hover-scale">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-heading font-bold text-primary">
                VietEdu Odyssey
              </span>
            </Link>
          </div>

          {/* Auth Form Card */}
          <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              
              {/* Left Decorative Panel */}
              <div className="hidden lg:block lg:col-span-2 bg-gradient-to-br from-primary via-primary/90 to-accent p-8 relative overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>
                
                <div className="relative h-full flex flex-col justify-between text-white">
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-heading font-bold mb-3">
                        Chào mừng đến với VietEdu Odyssey
                      </h2>
                      <p className="text-white/90 text-lg leading-relaxed">
                        Hành trình học tập thú vị đang chờ đón bạn!
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Học tập hiệu quả</h3>
                        <p className="text-white/80 text-sm">Phương pháp giảng dạy hiện đại, dễ hiểu</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Theo dõi tiến độ</h3>
                        <p className="text-white/80 text-sm">Hệ thống đánh giá và xếp hạng chi tiết</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Nhận huy hiệu</h3>
                        <p className="text-white/80 text-sm">Thành tích để khích lệ học tập</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="max-w-md mx-auto space-y-8">
                  
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold">
                      {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
                    </h1>
                    <p className="text-muted-foreground text-base">
                      {isLogin 
                        ? "Chào mừng bạn quay trở lại! 👋" 
                        : "Bắt đầu hành trình học tập của bạn 🚀"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Tên đăng nhập
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Nhập tên đăng nhập"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          required
                          className="h-12 pl-12 rounded-xl border-2 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            className="h-12 pl-12 rounded-xl border-2 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          className="h-12 pl-12 pr-12 rounded-xl border-2 focus:border-primary transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                            className="h-12 pl-12 pr-12 rounded-xl border-2 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {isLogin && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          />
                          <label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                            Ghi nhớ đăng nhập
                          </label>
                        </div>
                        <button type="button" className="text-sm text-primary hover:underline font-semibold">
                          Quên mật khẩu?
                        </button>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-13 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                    >
                      {isLogin ? "Đăng nhập ngay" : "Tạo tài khoản"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-card text-muted-foreground font-medium">Hoặc tiếp tục với</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-12 rounded-xl border-2 gap-3 hover:bg-muted/50 transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-semibold">Google</span>
                  </Button>

                  {/* Toggle Login/Register */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                      {" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary font-semibold hover:underline"
                      >
                        {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
