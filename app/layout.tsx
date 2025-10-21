import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo Manager - Управляйте задачами эффективно",
  description: "Красивый todo-менеджер с несколькими режимами просмотра: классический, workflowy, канбан, календарь",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
