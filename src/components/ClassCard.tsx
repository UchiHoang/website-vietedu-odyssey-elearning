import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface ClassCardProps {
  level: string;
  title: string;
  ageRange: string;
  image: string;
  description: string;
  gameRoute?: string | null;
}

const ClassCard = ({ level, title, ageRange, image, description, gameRoute }: ClassCardProps) => {
  const isAvailable = gameRoute !== null;
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden card-shadow hover-lift transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <Users className="h-3.5 w-3.5" />
            {ageRange} tuổi
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {level}
          </span>
        </div>

        <h3 className="text-xl font-heading font-bold leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {isAvailable && gameRoute ? (
          <Button className="w-full group/btn" asChild>
            <Link to={gameRoute}>
              Vào lớp
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        ) : (
          // Locked items: render visually identical clickable button.
          // If a specific gameRoute exists it will be used above; here we provide
          // a sensible fallback route so the button is clickable like the unlocked state.
          <Button className="w-full group/btn" asChild>
            <Link to="/coming-soon">
              Vào lớp
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-secondary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors" />
    </div>
  );
};

export default ClassCard;
