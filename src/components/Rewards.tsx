import { Trophy, Star, Medal, CheckCircle, Sparkles, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";

const Rewards = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background to-secondary/10">
      {/* Mascot background */}
      <img
        src="/mascot-buffalo.png"
        alt="Mascot"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src.indexOf('/icon.png') === -1) target.src = '/icon.png';
        }}
        className="pointer-events-none select-none opacity-90 absolute left-2 md:left-6 bottom-0 w-40 md:w-56 lg:w-72 z-10 animate-float"
      />

      {/* Curved dotted path background */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-28 hidden md:block"
        height="180"
        viewBox="0 0 1200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 150 C 250 40, 450 40, 700 150 C 900 230, 1050 80, 1200 120"
          stroke="currentColor"
          className="text-muted-foreground/30"
          strokeDasharray="6 10"
          strokeWidth="2"
          fill="transparent"
        />
      </svg>

      {/* Subtle trophy icons */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <Trophy className="absolute top-16 right-10 h-10 w-10 text-primary/80" />
        <Medal className="absolute bottom-16 left-16 h-9 w-9 text-accent/80" />
      </div>

      <div className="container mx-auto px-4 md:pl-24 relative z-0">
        <motion.div
          className="text-center mb-12 space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium shimmer-wrapper mx-auto"
            variants={fadeInUp}
          >
            <Sparkles className="h-4 w-4" />
            <span>Học chăm là có quà</span>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold"
            variants={fadeInUp}
          >
            Lộ trình học tập cá nhân hóa
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Học qua video online và trò chơi toán học với các mốc thành tựu hấp dẫn.
          </motion.p>
        </motion.div>

        {/* Three curved columns centered */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto items-end"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Step 1 */}
          <motion.div
            className="rounded-[2.5rem] overflow-hidden card-shadow bg-gradient-to-b from-primary/10 to-background p-6 md:p-8"
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">1</span>
              <div className="font-heading font-bold text-lg">Đánh giá đầu vào miễn phí</div>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <div className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/>Đánh giá năng lực</div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="rounded-[2.5rem] overflow-hidden card-shadow bg-gradient-to-b from-highlight/20 to-background p-6 md:p-8"
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-secondary/20 text-foreground flex items-center justify-center font-bold">2</span>
              <div className="font-heading font-bold text-lg">Học tập chủ động</div>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-muted glass-panel"><Star className="h-4 w-4 text-primary"/>Xem video lý thuyết</div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-muted glass-panel"><Trophy className="h-4 w-4 text-primary"/>Luyện tập</div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-muted glass-panel"><Medal className="h-4 w-4 text-primary"/>Bài kiểm tra định kỳ</div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="rounded-[2.5rem] overflow-hidden card-shadow bg-gradient-to-b from-secondary/20 to-background p-6 md:p-8"
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-green-200 text-foreground flex items-center justify-center font-bold">3</span>
              <div className="font-heading font-bold text-lg">Tương tác, chinh phục</div>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-muted"><Trophy className="h-4 w-4 text-primary"/>Thách đấu, đấu trường</div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-muted shimmer-wrapper"><Medal className="h-4 w-4 text-primary"/>Đổi quà – huy hiệu</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Flag className="h-4 w-4 text-primary" />
              <span>Hoàn thành lộ trình để mở khóa phần thưởng đặc biệt</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Rewards;
