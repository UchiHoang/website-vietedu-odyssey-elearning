import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const ComingSoon = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-3xl font-heading font-bold">Sắp ra mắt</h1>
        <p className="text-lg text-muted-foreground">
          Trang này sẽ ra mắt trong tương lai. Hãy quay lại sau hoặc xem các lớp hiện có.
        </p>
        <div className="flex justify-center">
          <Link
            to="/lessons"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full shadow hover:opacity-90"
          >
            Xem lớp hiện có
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
