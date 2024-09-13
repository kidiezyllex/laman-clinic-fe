export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-row items-center justify-center ">
      {children}
    </div>
  );
}
