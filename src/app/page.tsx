export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">Aprovação de Linha Editorial</h1>
      <p className="max-w-md text-slate-500">
        Acesse pelo link único enviado pela agência, no formato{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">/aprovacao/[slug]?token=...</code>
      </p>
    </main>
  );
}
