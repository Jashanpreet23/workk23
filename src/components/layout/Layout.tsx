import Header from "./Header";
import Footer from "./Footer";

/* Nav links are shown in the header on every page */
const navLinks = [
    { label: "Home", href: "/" },
    { label: "Sign up", href: "/signup" },
    { label: "Sign in", href: "/signin" },
    { label: "Sign out", href: "/signout" },
];

type LayoutProps = {
    children: React.ReactNode;
};

/*
 * This shared page wraps every page with the
 * header & footer, so individual pages only need to render
 * their own content
 */
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
            <Header links={navLinks} />
            {children}
            <Footer />
        </div>
    );
}
