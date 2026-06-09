import AppSidebar from './AppSidebar';
export default function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}