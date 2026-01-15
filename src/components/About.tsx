import { useState } from "react";
import {
  Play,
  Gamepad2,
  BookOpenCheck,
  ScrollText,
  LineChart,
  Clock,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight, floating } from "./animations";

const About = () => {
  const [audience, setAudience] = useState<"parent" | "student" | "teacher" | "school">("parent");

  const commonIntro = (
    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
      VietEdu Odyssey là nền tảng học tập trực tuyến độc đáo, kết hợp giáo dục hiện đại với văn hóa dân gian Việt Nam. Chúng tôi tin rằng học tập là một hành trình vui vẻ, và mỗi đứa trẻ đều có thể phát huy tiềm năng của mình khi được học theo cách phù hợp.
    </p>
  );

  const audienceFeatures: Record<
    typeof audience,
    { icon: React.ElementType; title: string; desc: string }[]
  > = {
    parent: [
      { icon: LineChart, title: "Báo cáo trực quan", desc: "Theo dõi tiến độ, điểm mạnh/yếu của con theo từng bài giảng và trò chơi." },
      { icon: Clock, title: "Tiết kiệm thời gian", desc: "Con tự học chủ động với video và game; phụ huynh nhận nhắc nhở thông minh." },
      { icon: PiggyBank, title: "Tiết kiệm chi phí", desc: "Kho video – game đa dạng thay cho nhiều lớp học phụ thêm." },
      { icon: ShieldCheck, title: "Nội dung an toàn", desc: "Bài học kiểm duyệt kỹ, phù hợp lứa tuổi, bám sát chương trình." }
    ],
    student: [
      { icon: Sparkles, title: "Linh hoạt, chủ động", desc: "Xem video mọi lúc; tua lại phần chưa hiểu, luyện game để ghi nhớ lâu." },
      { icon: Gamepad2, title: "Cạnh tranh, thu hút", desc: "Minigame – thử thách điểm số, bảng xếp hạng khuyến khích học tập." },
      { icon: BookOpenCheck, title: "Lộ trình cá nhân hóa", desc: "Đề xuất video và trò chơi phù hợp năng lực, tăng tiến độ 30%-50%." },
      { icon: ScrollText, title: "Cốt truyện Việt", desc: "Học trong thế giới cổ tích – truyền thuyết Việt đầy màu sắc." }
    ],
    teacher: [
      { icon: Clock, title: "Tiết kiệm thời gian", desc: "Thư viện video – game có sẵn, giao bài và chấm tự động." },
      { icon: LineChart, title: "Hỗ trợ quản lý", desc: "Báo cáo theo lớp/bài, theo dõi mức độ hoàn thành và hiểu bài." },
      { icon: Users, title: "Dạy học hiệu quả", desc: "Kết hợp video minh họa + game tương tác để khởi động và ôn tập." },
      { icon: ShieldCheck, title: "Giảm áp lực", desc: "Công cụ đồng bộ, học liệu chuẩn giúp giảm khối lượng soạn giảng." }
    ],
    school: [
      { icon: Users, title: "Quản lý toàn diện", desc: "Theo dõi hoạt động dạy – học toàn trường theo khối, lớp, môn." },
      { icon: LineChart, title: "Nâng cao chất lượng", desc: "Dữ liệu học tập giúp đánh giá, điều chỉnh kế hoạch bồi dưỡng." },
      { icon: Clock, title: "Tối ưu thời gian", desc: "Giảm thời gian thống kê, báo cáo; tăng thời gian cho chuyên môn." },
      { icon: ShieldCheck, title: "Chuẩn hoá nội dung", desc: "Kho video – game thống nhất, bám chương trình, giàu bản sắc Việt." }
    ]
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-muted/30 to-highlight/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-float" />

        {/* Subtle background icons */}
        <div className="absolute inset-0 opacity-15">
          <Sparkles className="absolute top-12 left-1/4 h-8 w-8 text-primary/70" />
          <Play className="absolute bottom-16 right-1/4 h-10 w-10 text-accent/70" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-6 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold"
            variants={fadeInUp}
          >
            Sứ mệnh của chúng tôi
          </motion.h2>
          <motion.div variants={fadeInUp}>
            {commonIntro}
          </motion.div>
        </motion.div>

        {/* Segmented audience selector */}
        <motion.div
          className="max-w-3xl mx-auto mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="rounded-full bg-muted p-1 flex gap-2 justify-between shadow-inner shimmer-wrapper">
            {([
              { key: "parent", label: "Phụ huynh" },
              { key: "student", label: "Học sinh" },
              { key: "teacher", label: "Giáo viên" },
              { key: "school", label: "Nhà trường" }
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick={() => setAudience(item.key)}
                className={`px-5 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                  audience === item.key
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "hover:bg-card hover:scale-105"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Features grid (single unified section, no chip, no CTA) */}
        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3
            className="text-2xl md:text-3xl font-heading font-bold text-center"
            variants={fadeInUp}
          >
            Một nơi cho hành trình học tập sinh động của mọi đối tượng
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {audienceFeatures[audience].map((f, idx) => (
              <motion.div
                key={idx}
                className="flex gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300 hover:shadow-md group"
                variants={idx % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-semibold mb-1 group-hover:text-primary transition-colors">{f.title}</div>
                  <div className="text-muted-foreground">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
