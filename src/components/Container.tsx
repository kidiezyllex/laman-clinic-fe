export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[100vw] mx-auto xl:px-14 px-4 py-2 dark:bg-slate-800 bg-slate-50">
      {children}
    </div>
  );
}
