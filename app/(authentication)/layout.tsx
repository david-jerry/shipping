import AuthHeader from "@/components/layout/AuthHeader"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AuthHeader />
      <main className="flex-1">{children}</main>
    </>
  )
}
