
import React from "react";
import Header from "../Header";

const RootContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6F9] text-[#0F172A]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#D0D7DE] shadow-sm">
        <div className="container mx-auto px-6">
          <Header />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="rounded-lg bg-white shadow-sm border border-[#D0D7DE]">
          <div className="p-6">{children}</div>
        </div>
      </main>

      <footer className="border-t border-[#D0D7DE] bg-white">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-[#475569]">
          © 2026 <span className="font-semibold text-[#0070AD]">BLOGi</span>. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default RootContainer;
