import { cn } from "@/lib/utils";

export default function BoxLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} role="status">
      <span className="sr-only">Loading website</span>
      <div className="box-loader boxes" aria-hidden="true">
        {[1, 2, 3, 4].map((box) => (
          <div key={box} className={`box box-${box}`}>
            <div className="face face-front" />
            <div className="face face-right" />
            <div className="face face-top" />
            <div className="face face-back" />
          </div>
        ))}
      </div>
    </div>
  );
}
