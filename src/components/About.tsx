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
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-muted/30 to-highlight/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6 mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            Sứ mệnh của chúng tôi
          </h2>
          {commonIntro}
        </div>

        {/* Segmented audience selector */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="rounded-full bg-muted p-1 flex gap-2 justify-between">
            {([
              { key: "parent", label: "Phụ huynh" },
              { key: "student", label: "Học sinh" },
              { key: "teacher", label: "Giáo viên" },
              { key: "school", label: "Nhà trường" }
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick={() => setAudience(item.key)}
                className={`px-5 py-2.5 rounded-full text-sm md:text-base font-semibold transition-colors ${
                  audience === item.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features grid (single unified section, no chip, no CTA) */}
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-center">
            Một nơi cho hành trình học tập sinh động của mọi đối tượng
          </h3>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {audienceFeatures[audience].map((f, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold mb-1">{f.title}</div>
                  <div className="text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
