import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type UserRole = "student" | "teacher";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: ""
  });

  // Check if redirected from game requiring login
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate(redirectTo || "/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(redirectTo || "/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });

        if (error) throw error;

        toast({
          title: "Email đã được gửi!",
          description: "Vui lòng kiểm tra email để đặt lại mật khẩu."
        });
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại!"
        });
        navigate("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Lỗi",
            description: "Mật khẩu xác nhận không khớp",
            variant: "destructive"
          });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo || '/'}`,
            data: {
              display_name: formData.username || formData.email.split('@')[0],
              role: selectedRole,
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Đăng ký thành công!",
          description: "Tài khoản của bạn đã được tạo. Vui lòng kiểm tra email để xác nhận."
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đăng nhập bằng Google",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex items-center justify-center p-4 min-h-0">
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
                      {isForgotPassword ? "Quên mật khẩu" : (isLogin ? "Đăng nhập" : "Tạo tài khoản")}
                    </h1>
                    <p className="text-muted-foreground text-base">
                      {isForgotPassword 
                        ? "Nhập email để nhận liên kết đặt lại mật khẩu 📧"
                        : (isLogin 
                          ? "Chào mừng bạn quay trở lại! 👋" 
                          : "Bắt đầu hành trình học tập của bạn 🚀")}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && !isForgotPassword && (
                      <>
                        {/* Role Selection */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-foreground">
                            Bạn là
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedRole("student")}
                              className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                selectedRole === "student"
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <Users className="h-8 w-8" />
                              <span className="font-semibold">Học sinh</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedRole("teacher")}
                              className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                selectedRole === "teacher"
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <BookOpen className="h-8 w-8" />
                              <span className="font-semibold">Giáo viên</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">
                            Tên hiển thị
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Nhập tên hiển thị"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              className="h-12 pl-12 rounded-xl border-2 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Nhập địa chỉ email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="h-12 pl-12 rounded-xl border-2 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {!isForgotPassword && (
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
                    )}

                    {!isLogin && !isForgotPassword && (
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

                    {isLogin && !isForgotPassword && (
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
                        <button 
                          type="button" 
                          onClick={() => setIsForgotPassword(true)}
                          className="text-sm text-primary hover:underline font-semibold"
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-13 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : (isForgotPassword ? "Gửi email" : (isLogin ? "Đăng nhập ngay" : "Tạo tài khoản"))}
                    </Button>

                    {isForgotPassword && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setIsLogin(true);
                        }}
                        className="w-full h-12 rounded-xl border-2"
                      >
                        Quay lại đăng nhập
                      </Button>
                    )}
                  </form>

                  {!isForgotPassword && (
                    <>
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
                            onClick={() => {
                              setIsLogin(!isLogin);
                              setIsForgotPassword(false);
                            }}
                            className="text-primary font-semibold hover:underline"
                          >
                            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                          </button>
                        </p>
                      </div>
                    </>
                  )}
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
