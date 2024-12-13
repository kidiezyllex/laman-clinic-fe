export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[100vw] mx-auto xl:px-14 md:px-4 md:py-2 dark:bg-slate-800 bg-slate-100 h-fit">
      {children}
    </div>
  );
}
