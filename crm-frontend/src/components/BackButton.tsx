import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button type="button" className="back-btn" onClick={() => navigate(-1)}>
      <ArrowLeft size={18} />
      Вернуться назад
      <style>{`
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--border-color, #ccc);
          color: var(--text-color, #333);
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background 0.2s, border-color 0.2s;
        }
        .back-btn:hover {
          background: rgba(0,0,0,0.05);
          border-color: #1976d2;
        }
        @media (prefers-color-scheme: dark) {
          .back-btn {
            border-color: #555;
            color: #f0f0f0;
          }
          .back-btn:hover {
            background: rgba(255,255,255,0.08);
            border-color: #1976d2;
          }
        }
      `}</style>
    </button>
  );
}
