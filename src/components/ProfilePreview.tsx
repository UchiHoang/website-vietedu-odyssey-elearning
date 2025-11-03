import { userProfile } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { User, Star } from "lucide-react";

const ProfilePreview = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-card rounded-2xl card-shadow overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent" />
          
          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-card border-4 border-card flex items-center justify-center text-6xl card-shadow">
                  {userProfile.avatar}
                </div>
              </div>
              
              <div className="flex-1 pt-16 md:pt-20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-1">
                      {userProfile.name}
                    </h3>
                    <p className="text-base text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {userProfile.level}
                    </p>
                  </div>
                  
                  <Button className="hover-scale">
                    Xem hồ sơ đầy đủ
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {userProfile.points}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tổng điểm
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {userProfile.badges.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Huy hiệu
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Huy hiệu đã đạt được
              </h4>
              <div className="flex gap-3">
                {userProfile.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="text-4xl hover-scale cursor-pointer"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePreview;
