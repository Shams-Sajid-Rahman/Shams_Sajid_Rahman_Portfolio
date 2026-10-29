import { Braces, Code2, Container, Cpu, Database, GitBranch, Server, type LucideIcon } from "lucide-react";

type Spot = { icon: LucideIcon; cls: string; size: number; delay: string; rot: number };

const SPOTS: Spot[][] = [
  [
    { icon: Code2, cls: "right-[8%] top-[10%]", size: 34, delay: "0s", rot: 8 },
    { icon: Database, cls: "left-[6%] bottom-[10%]", size: 30, delay: "1.4s", rot: -6 },
    { icon: Cpu, cls: "right-[22%] bottom-[14%]", size: 26, delay: "2.6s", rot: 4 },
  ],
  [
    { icon: Server, cls: "right-[10%] bottom-[12%]", size: 32, delay: "0.8s", rot: -5 },
    { icon: Braces, cls: "left-[8%] top-[12%]", size: 28, delay: "2s", rot: 7 },
    { icon: GitBranch, cls: "right-[30%] top-[8%]", size: 24, delay: "3s", rot: -3 },
  ],
  [
    { icon: Container, cls: "left-[10%] bottom-[12%]", size: 30, delay: "0.4s", rot: 5 },
    { icon: Cpu, cls: "right-[9%] top-[14%]", size: 28, delay: "1.8s", rot: -7 },
    { icon: Code2, cls: "right-[28%] bottom-[10%]", size: 24, delay: "2.8s", rot: 3 },
  ],
];

/** Minimal tech icons drifting in the background of a card (dark theme only). */
export default function FloatingIcons({ variant = 0 }: { variant?: number }) {
  const spots = SPOTS[variant % SPOTS.length];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden dark:block">
      {spots.map(({ icon: Icon, cls, size, delay, rot }) => (
        <span
          key={cls}
          style={{ ["--r" as string]: `${rot}deg`, animationDelay: delay }}
          className={`float-slow absolute text-sky-300/25 ${cls}`}
        >
          <Icon size={size} strokeWidth={1.25} />
        </span>
      ))}
    </div>
  );
}
