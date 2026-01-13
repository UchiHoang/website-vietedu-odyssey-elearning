import ClassCard from "./ClassCard";
import { classes } from "@/data/mockData";

const ClassesSection = () => {
  return (
    <section id="classes" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            Bắt đầu hành trình học tập của bé tại đây
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mỗi cấp độ là một hành trình mới với câu chuyện riêng và thử thách thú vị, giúp bé khám phá toán học một cách tự nhiên và phát triển toàn diện.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {classes.map((classItem, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ClassCard {...classItem} gameRoute={classItem.gameRoute} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
