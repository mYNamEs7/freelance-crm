import { Loader2 } from "lucide-react";

type LoaderProps = {
  size?: number;
  className?: string;
};

export default function Loader({ size = 48, className = "" }: LoaderProps) {
  return (
    <div className={`loader-wrap ${className}`} role="status" aria-label="Загрузка">
      <Loader2 size={size} className="loader-icon" strokeWidth={2} />
      <style>{`
        .loader-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 48px;
          width: 100%;
        }
        .loader-icon {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
