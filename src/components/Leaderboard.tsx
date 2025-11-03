import { Trophy, Medal, Award } from "lucide-react";
import { leaderboard } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <section id="leaderboard" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
              Bảng xếp hạng
            </h2>
            <p className="text-lg text-muted-foreground">
              Top những học sinh xuất sắc nhất tuần này
            </p>
          </div>

          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
              <h3 className="font-heading font-bold text-xl">Tuần này</h3>
            </div>

            <div className="divide-y">
              {leaderboard.map((player, index) => (
                <div
                  key={player.rank}
                  className="p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(player.rank)}
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-3xl">{player.avatar}</div>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {player.points} điểm
                      </div>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-primary">
                    {player.points}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-muted/30 text-center">
              <Button variant="outline" className="hover-scale">
                Xem toàn bộ bảng xếp hạng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
