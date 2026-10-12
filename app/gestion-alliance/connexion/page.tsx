import type { Metadata } from "next";
import Logo from "@/components/Logo";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Connexion admin | ALLIANCE M.O BTP",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-mist bg-white p-8 shadow-rest">
        <div className="flex flex-col items-center text-center">
          <Logo variant="full" height={48} priority />
          <h1 className="mt-6 font-display text-xl font-semibold text-navy">
            Espace administration
          </h1>
          <p className="mt-2 text-sm text-muted">
            Accès réservé. Aucun lien public vers cette page.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
