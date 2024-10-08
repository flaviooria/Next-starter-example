import "@/app/ui/global.css";
import { lato } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${lato.className} antialiased`}>{children}</body>
    </html>
  );
}
