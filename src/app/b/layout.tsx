// Layout separado para las páginas públicas (bio-link)
// Este layout NO incluye el Sidebar de administración
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
