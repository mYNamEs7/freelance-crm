import { Loader2 } from "lucide-react";

type LoaderProps = {
  size?: number;
  className?: string;
};

export default function Loader({ size = 48, className = "" }: LoaderProps) {
  return (
    <div
      className={`flex justify-center items-center py-12 w-full ${className}`}
      role="status"
      aria-label="Загрузка"
    >
      <Loader2
        size={size}
        className="animate-spin text-indigo-600 dark:text-indigo-400"
        strokeWidth={2}
      />
    </div>
  );
}
