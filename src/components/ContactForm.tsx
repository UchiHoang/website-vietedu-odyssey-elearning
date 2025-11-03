import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

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
    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
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
    
    // Simulate form submission
    try {
      // In a real app, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Gửi thành công!",
        description: "Chúng mình sẽ liên hệ với bạn sớm nhất có thể.",
      });
      
      // Reset form
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

  return (
    <section id="contact" className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
              Liên hệ với chúng mình
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Có câu hỏi hoặc cần hỗ trợ? Chúng mình luôn sẵn sàng giúp đỡ bạn!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border-4 border-accent rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block font-semibold mb-2">
                  Họ và tên
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                  className={`border-2 ${errors.name ? 'border-destructive' : 'border-secondary'} focus:border-primary`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block font-semibold mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border-2 ${errors.email ? 'border-destructive' : 'border-secondary'} focus:border-primary`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block font-semibold mb-2">
                Chủ đề
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Bạn muốn hỏi về điều gì?"
                value={formData.subject}
                onChange={handleChange}
                className={`border-2 ${errors.subject ? 'border-destructive' : 'border-secondary'} focus:border-primary`}
                disabled={isSubmitting}
              />
              {errors.subject && (
                <p className="text-sm text-destructive mt-1">{errors.subject}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block font-semibold mb-2">
                Tin nhắn
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Viết tin nhắn của bạn ở đây..."
                value={formData.message}
                onChange={handleChange}
                className={`border-2 min-h-[150px] ${errors.message ? 'border-destructive' : 'border-secondary'} focus:border-primary`}
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">{errors.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
