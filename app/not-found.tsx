export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-slate-100 px-4 text-center">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-950">Pagina niet gevonden</h1>
        <p className="mt-4 text-slate-600">Deze Sales App-route bestaat nog niet in Phase 4.1.</p>
        <a className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#003B83] px-4 font-bold text-white transition hover:bg-[#002b60]" href="/">
          Terug naar app
        </a>
      </div>
    </section>
  );
}
