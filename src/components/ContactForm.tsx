import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, User, FileText, Phone, MapPin, Star, Heart, Sparkles, BookOpen, Pencil } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Vui lòng nhập họ tên" }).max(100, { message: "Họ tên không được quá 100 ký tự" }),
  email: z.string().trim().email({ message: "Email không hợp lệ" }).max(255, { message: "Email không được quá 255 ký tự" }),
  subject: z.string().trim().min(1, { message: "Vui lòng nhập chủ đề" }).max(200, { message: "Chủ đề không được quá 200 ký tự" }),
  message: z.string().trim().min(1, { message: "Vui lòng nhập tin nhắn" }).max(1000, { message: "Tin nhắn không được quá 1000 ký tự" })
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ContactFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Gửi thành công!",
        description: "Chúng mình sẽ liên hệ với bạn sớm nhất có thể.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1 }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hoangquockhanh204@gmail.com",
      href: "mailto:hoangquockhanh204@gmail.com",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      title: "Điện thoại",
      value: "0392 290 338",
      href: "tel:0392290338",
      color: "text-green-500"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      value: "280 An Dương Vương, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
      href: "https://maps.google.com/?q=280+An+Dương+Vương,+Quận+5,+TP.HCM",
      color: "text-red-500"
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.1, 1], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        
        {/* Floating decorative icons */}
        <motion.div
          className="absolute top-[15%] right-[10%] text-primary/10"
          animate={{ y: [-15, 15, -15], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-12 h-12 md:w-16 md:h-16" />
        </motion.div>
        <motion.div
          className="absolute top-[25%] left-[5%] text-accent/15"
          animate={{ y: [10, -10, 10], rotate: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          <Heart className="w-8 h-8 md:w-12 md:h-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[8%] text-primary/10"
          animate={{ y: [-8, 8, -8], x: [5, -5, 5] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        >
          <Sparkles className="w-10 h-10 md:w-14 md:h-14" />
        </motion.div>
        <motion.div
          className="absolute bottom-[35%] right-[5%] text-secondary/20"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <BookOpen className="w-10 h-10 md:w-12 md:h-12" />
        </motion.div>
        <motion.div
          className="absolute top-[60%] right-[15%] text-accent/10"
          animate={{ y: [5, -10, 5], rotate: [0, -20, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        >
          <Pencil className="w-8 h-8 md:w-10 md:h-10" />
        </motion.div>
        <motion.div
          className="absolute top-[40%] left-[15%] text-primary/8"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
        
        {/* Emoji floating icons */}
        <motion.div
          className="absolute top-1/4 right-1/4 text-3xl opacity-10"
          animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ✉️
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-[20%] text-2xl opacity-10"
          animate={{ y: [10, -10, 10], rotate: [0, -15, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          💬
        </motion.div>
        <motion.div
          className="absolute top-[70%] right-[25%] text-2xl opacity-10"
          animate={{ y: [-5, 10, -5], x: [5, -5, 5] }}
          transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
        >
          📚
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="h-4 w-4" />
            </motion.div>
            <span>Liên hệ</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Liên hệ với chúng mình
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Có câu hỏi hoặc cần hỗ trợ? Chúng mình luôn sẵn sàng giúp đỡ bạn!
          </motion.p>
        </motion.div>

        {/* Two column layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info - Left Column */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-full py-4">
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-8 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📍
                </motion.span>
                Thông tin liên hệ
              </h3>

              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.href}
                    target={info.title === "Địa chỉ" ? "_blank" : undefined}
                    rel={info.title === "Địa chỉ" ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                      <motion.div
                        className={`p-3 rounded-full bg-background shadow-md ${info.color}`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <info.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground mb-1">{info.title}</p>
                        <p className="text-muted-foreground text-sm md:text-base break-words group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                ))}
              </div>

              {/* Social media hint */}
              <motion.div
                className="mt-8 pt-6 border-t border-border"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💌
                  </motion.span>
                  Chúng mình sẽ phản hồi trong 24h!
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form - Right Column */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="bg-card border-4 border-accent rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden h-full"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                >
                  <label htmlFor="name" className="flex items-center gap-2 font-semibold mb-2">
                    <User className="h-4 w-4 text-primary" />
                    Họ và tên
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nhập họ tên của bạn"
                      value={formData.name}
                      onChange={handleChange}
                      className={`border-2 transition-all duration-300 ${errors.name ? 'border-destructive' : 'border-secondary hover:border-primary/50'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                  {errors.name && (
                    <motion.p 
                      className="text-sm text-destructive mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus">
                  <label htmlFor="email" className="flex items-center gap-2 font-semibold mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`border-2 transition-all duration-300 ${errors.email ? 'border-destructive' : 'border-secondary hover:border-primary/50'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                  {errors.email && (
                    <motion.p 
                      className="text-sm text-destructive mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.div className="mb-6 relative z-10" variants={inputVariants} whileFocus="focus">
                <label htmlFor="subject" className="flex items-center gap-2 font-semibold mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Chủ đề
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Bạn muốn hỏi về điều gì?"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`border-2 transition-all duration-300 ${errors.subject ? 'border-destructive' : 'border-secondary hover:border-primary/50'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
                    disabled={isSubmitting}
                  />
                </motion.div>
                {errors.subject && (
                  <motion.p 
                    className="text-sm text-destructive mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </motion.div>

              <motion.div className="mb-6 relative z-10" variants={inputVariants} whileFocus="focus">
                <label htmlFor="message" className="flex items-center gap-2 font-semibold mb-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Tin nhắn
                </label>
                <motion.div whileHover={{ scale: 1.005 }}>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Viết tin nhắn của bạn ở đây..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`border-2 min-h-[150px] transition-all duration-300 ${errors.message ? 'border-destructive' : 'border-secondary hover:border-primary/50'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
                    disabled={isSubmitting}
                  />
                </motion.div>
                {errors.message && (
                  <motion.p 
                    className="text-sm text-destructive mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto px-8 group relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  {isSubmitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  )}
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
