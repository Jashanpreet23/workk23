import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CommonHomeMain from "@/components/home/CommonHomeMain";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sign up", href: "/signup" },
  { label: "Sign in", href: "/signin" },
  { label: "Sign out", href: "/signout" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <Header links={navLinks} />
      <CommonHomeMain />
      <Footer />
    </div>
  );
}
