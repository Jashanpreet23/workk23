import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
