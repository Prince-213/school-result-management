import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex w-full ">
      <Sidebar role="admin" />
      {children}
    </div>
  );
}
