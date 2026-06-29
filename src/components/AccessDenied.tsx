export default function AccessDenied() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
        🔒
      </div>
      <h1 className="text-xl font-semibold text-slate-800">Acesso negado</h1>
      <p className="max-w-sm text-slate-500">
        Este link é inválido ou o token de acesso está incorreto. Confirme o link com a agência responsável.
      </p>
    </main>
  );
}
