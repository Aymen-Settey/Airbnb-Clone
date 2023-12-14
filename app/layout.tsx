import "./globals.css";
import { Nunito } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./Providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import ResetModal from "./components/modals/ResetModal";
import { getServerSession } from "next-auth";
import SessionProvider from "./Providers/SessionProvider";
import Provider from "./Providers/SessionProvider";
export const metadata: Metadata = {
  title: "Airbnb",
  description: "Real Estate Application",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <Provider>
        <body className={font.className}>
          <ClientOnly>
            <ToasterProvider />
            <SearchModal />
            <RentModal />
            <ResetModal />
            <LoginModal />
            <RegisterModal />
            <Navbar currentUser={currentUser} />
          </ClientOnly>

          <div className="pb-20 pt-28">{children}</div>
        </body>
      </Provider>
    </html>
  );
}
