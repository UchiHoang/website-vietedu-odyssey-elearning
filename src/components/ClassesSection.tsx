import ClassCard from "./ClassCard";
import { classes } from "@/data/mockData";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";
import { BookOpen, Pencil } from "lucide-react";

const ClassesSection = () => {
  return (
    <section id="classes" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        {/* Subtle learning icons */}
        <div className="absolute inset-0 opacity-15">
          <BookOpen className="absolute top-10 left-1/4 h-10 w-10 text-primary/70" />
          <Pencil className="absolute bottom-10 right-1/4 h-9 w-9 text-accent/70" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12 space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold"
            variants={fadeInUp}
          >
            Bắt đầu hành trình học tập của bé tại đây
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Mỗi cấp độ là một hành trình mới với câu chuyện riêng và thử thách thú vị, giúp bé khám phá toán học một cách tự nhiên và phát triển toàn diện.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {classes.map((classItem, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <ClassCard {...classItem} gameRoute={classItem.gameRoute} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClassesSection;
