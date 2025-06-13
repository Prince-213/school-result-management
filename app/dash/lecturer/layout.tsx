import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Sidebar role="lecturer" />
      {children}
    </section>
  );
}
