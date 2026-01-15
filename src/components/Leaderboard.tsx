import { useState } from "react";
import { Crown, Trophy, Medal } from "lucide-react";
import { leaderboard } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Leaderboard = () => {
  const [selectedGrade, setSelectedGrade] = useState("khoi-1");
  const [selectedPeriod, setSelectedPeriod] = useState("tuan");

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3, 10);

  const getRankStyle = (rank: number) => {
    // Provide explicit vertical offsets and slight scale differences so
    // podiums visually stack: 1 > 2 > 3. We prefer explicit translate classes
    // so the islands and avatars appear at slightly different heights.
    switch (rank) {
      case 1:
        return "-translate-y-8 scale-110"; // highest, slightly larger
      case 2:
        return "-translate-y-4 scale-105"; // middle
      case 3:
        return "-translate-y-1 scale-100"; // lowest
      default:
        return "";
    }
  };

  const getIslandSize = (rank: number) => {
    switch (rank) {
      case 1:
        return "w-48 h-40 md:w-56 md:h-44";
      case 2:
        return "w-44 h-36 md:w-52 md:h-40";
      case 3:
        return "w-40 h-32 md:w-44 md:h-36";
      default:
        return "w-36 h-28 md:w-40 md:h-32";
    }
  };

  const getAvatarSize = (rank: number) => {
    switch (rank) {
      case 1:
        return "w-24 h-24 md:w-28 md:h-28 text-5xl";
      case 2:
        return "w-20 h-20 md:w-24 md:h-24 text-4xl";
      case 3:
        return "w-18 h-18 md:w-20 md:h-20 text-3xl";
      default:
        return "w-12 h-12 text-2xl";
    }
  };

  const getRankBadge = (rank: number) => {
    const badges = {
      1: "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.5)]",
      2: "bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
      3: "bg-gradient-to-br from-amber-600 to-amber-800 shadow-[0_0_20px_rgba(217,119,6,0.4)]",
    };
    return badges[rank as keyof typeof badges] || "";
  };

  return (
    <section id="leaderboard" className="py-16 md:py-24 relative overflow-hidden">
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 -z-10" />
      
      {/* Cloud decorations */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/60 rounded-full blur-sm animate-float" />
      <div className="absolute top-20 right-20 w-40 h-20 bg-white/50 rounded-full blur-sm animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-1/4 w-36 h-18 bg-white/40 rounded-full blur-sm animate-float" style={{ animationDelay: "2s" }} />

      {/* Subtle trophy background icons */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <Trophy className="absolute top-24 left-1/3 h-10 w-10 text-yellow-200" />
        <Medal className="absolute bottom-24 right-1/3 h-9 w-9 text-orange-200" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white drop-shadow-lg">
              Bảng xếp hạng
            </h2>
            <p className="text-lg md:text-xl text-white/90 drop-shadow">
              Vinh danh những học sinh xuất sắc nhất
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur">
                <SelectValue placeholder="Chọn khối" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mam-non">Mầm Non</SelectItem>
                <SelectItem value="khoi-1">Khối 1</SelectItem>
                <SelectItem value="khoi-2">Khối 2</SelectItem>
                <SelectItem value="khoi-3">Khối 3</SelectItem>
                <SelectItem value="khoi-4">Khối 4</SelectItem>
                <SelectItem value="khoi-5">Khối 5</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur">
                <SelectValue placeholder="Khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tuan">Tuần này</SelectItem>
                <SelectItem value="thang">Tháng này</SelectItem>
                <SelectItem value="nam">Năm này</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Top label */}
          <div className="text-center mb-12">
            <div className="inline-block bg-lime-300 px-8 py-3 rounded-full shadow-lg">
              <span className="font-heading font-bold text-lg text-gray-800">
                Top 10 - Khối 1
              </span>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="relative mb-16 min-h-[400px] flex items-end justify-center gap-8 px-4">
            {[topThree[1], topThree[0], topThree[2]].map((student, idx) => {
              const displayOrder = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const actualRank = student.rank;
              
              return (
                <div
                  key={student.rank}
                  className={`flex flex-col items-center ${getRankStyle(actualRank)} transition-all animate-fade-in`}
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  {/* Crown for first place */}
                  {actualRank === 1 && (
                    <Crown className="h-12 w-12 text-yellow-400 mb-2 drop-shadow-lg animate-pulse" />
                  )}

                  {/* Avatar with rank badge - with float animation */}
                  <div className="relative mb-2 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                    <div className={`rounded-full ${getRankBadge(actualRank)} flex items-center justify-center border-4 border-white shadow-2xl ${getAvatarSize(actualRank)}`}>
                      <span className="leading-none">{student.avatar}</span>
                    </div>

                    {/* Smaller circular rank badge positioned at the avatar's top-right */}
                    <div className={`absolute -top-2 -right-2 ${getRankBadge(actualRank)} flex items-center justify-center border-2 border-white font-bold text-white ${
                      actualRank === 1 ? 'w-9 h-9 text-sm md:w-10 md:h-10 md:text-base' : actualRank === 2 ? 'w-8 h-8 text-sm' : 'w-7 h-7 text-xs'
                    } rounded-full`}>
                      {actualRank}
                    </div>
                  </div>

                  {/* Student info - with float animation */}
                  <div className="text-center mb-1 px-2 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                    <h3 className="font-heading font-bold text-base md:text-lg text-white drop-shadow-md mb-1">
                      {student.name}
                    </h3>
                    <p className="text-xs md:text-sm text-white/80 drop-shadow">
                      Trường Tiểu học Nguyễn Du
                    </p>
                  </div>

                  {/* Floating Island platform */}
                  <div className="relative animate-float -mt-6" style={{ animationDelay: `${idx * 0.5}s` }}>
                    <img 
                      src="/assets/floating-island.png" 
                      alt="Floating Island" 
                      className={`${getIslandSize(actualRank)} object-contain drop-shadow-2xl`}
                    />
                    <div className="absolute inset-x-0 top-1/3 text-center">
                      <span className="font-bold text-5xl md:text-6xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                        {actualRank}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining ranks (4-10) */}
          <div className="max-w-4xl mx-auto space-y-3 pb-8">
            {remaining.map((student, index) => (
              <div
                key={student.rank}
                className="bg-white/90 backdrop-blur rounded-2xl p-4 md:p-6 flex items-center gap-4 hover:bg-white transition-all hover:scale-[1.02] shadow-lg animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold text-lg">
                  {String(student.rank).padStart(2, '0')}
                </div>

                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                  {student.avatar}
                </div>

                <div className="flex-1">
                  <h4 className="font-heading font-bold text-base md:text-lg">
                    {student.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Trường Tiểu học A Thị trấn Mỹ Luông
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold text-primary">
                    {student.points}
                  </div>
                  <div className="text-xs text-muted-foreground">điểm</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;