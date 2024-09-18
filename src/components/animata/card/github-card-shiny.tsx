import { Children, useCallback, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

import { useMousePosition } from "../../../../hook/useMousePosition";
import { cn } from "@/lib/utils";

export default function GithubCardShiny({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) {
      return;
    }

    const { width, height } = overlayRef.current?.getBoundingClientRect() ?? {};
    const xOffset = x - width / 2;
    const yOffset = y - height / 2;

    overlayRef.current?.style.setProperty("--x", `${xOffset}px`);
    overlayRef.current?.style.setProperty("--y", `${yOffset}px`);
  }, []);

  useMousePosition(containerRef, update);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-96 min-w-fit max-w-full overflow-hidden rounded-md border border-border  dark:bg-slate-700 text-zinc-200 shadow-lg",
        className
      )}
    >
      <div
        ref={overlayRef}
        // Adjust height & width as required
        className="-z-1 absolute h-64 w-64 rounded-full bg-white opacity-0 bg-blend-soft-light blur-3xl transition-opacity group-hover:opacity-20"
        style={{
          transform: "translate(var(--x), var(--y))",
        }}
      />

      {/* <div className="font-mono text-sm">
        cmake.yml
        <div className="text-xs text-zinc-400">on: push</div>
      </div> */}

      <div className="z-10 flex w-full min-w-fit flex-col gap-2 rounded-md py-4">
        {children}
      </div>
    </div>
  );
}
