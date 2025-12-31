import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import * as lessons from "../lessons";

export default function Level() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  /* ================= LEVEL FILTER RULES (LOCKED) ================= */
  const LEVEL_FILTERS = {
    "beginner-1": (l) => l.meta.order >= 1 && l.meta.order <= 12,
    "beginner-2": (l) => l.meta.order >= 13 && l.meta.order <= 45,
    "intermediate-1": (l) => l.meta.order >= 50 && l.meta.order <= 85,
    "intermediate-2": () => false, // intentionally empty
    "advanced": (l) => l.meta.order >= 100 && l.meta.order <= 135
  };

  /* ================= RESOLVE LESSONS FOR LEVEL ================= */
  const lessonsForLevel = Object.values(lessons)
    .filter((lesson) => LEVEL_FILTERS[levelId]?.(lesson))
    .sort((a, b) => a.meta.order - b.meta.order)
    .map((lesson) => ({
      id: lesson.meta.id,
      title: lesson.meta.title,
      passcode: lesson.meta.passcode
    }));

  /* ================= HANDLERS ================= */
  const handleLessonClick = (lesson) => {
    if (lesson.passcode) {
      const input = window.prompt("Enter passcode for this lesson:");
      if (input === null) return;
      if (input !== lesson.passcode) {
        alert("Incorrect passcode");
        return;
      }
    }
    navigate(`/classroom/${levelId}/${lesson.id}`);
  };

  /* ================= RENDER ================= */
  return (
    <div className="page">
      {/* ===== HEADER ===== */}
      <div
        style={{
          height: "80px",
          background: "linear-gradient(90deg, #4facfe, #00f2fe)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "24px",
          fontWeight: "600"
        }}
      >
        {levelId.replace("-", " ").toUpperCase()}
      </div>

      {/* ===== AUTH GUARD ===== */}
      {!loading && !user && (
        <div
          className="card"
          style={{ marginTop: "24px", textAlign: "center" }}
        >
          <p>Please login to continue.</p>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {user && lessonsForLevel.length === 0 && (
        <div
          className="card"
          style={{ marginTop: "24px", textAlign: "center" }}
        >
          <p>Lessons for this level will be added soon.</p>
        </div>
      )}

      {/* ===== LESSON LIST ===== */}
      {user && lessonsForLevel.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "24px"
          }}
        >
          {lessonsForLevel.map((lesson, index) => (
            <div
              key={lesson.id}
              className="card"
              style={{
                cursor: "pointer",
                background: "linear-gradient(90deg, #84fab0, #8fd3f4)",
                color: "#fff"
              }}
              onClick={() => handleLessonClick(lesson)}
            >
              {index + 1}. {lesson.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
