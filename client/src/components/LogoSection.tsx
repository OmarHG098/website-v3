export default function LogoSection() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-3xl font-bold font-serif">Forbes</p>
            <p className="text-xs text-muted-foreground mt-1">Featured</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">CLARK</p>
            <p className="text-xs text-muted-foreground mt-1">Student Success</p>
          </div>
          <div className="text-center border rounded-lg px-4 py-2">
            <p className="text-sm font-semibold">CERTIFIED</p>
            <p className="text-xs text-muted-foreground">Education Partner</p>
          </div>
        </div>
      </div>
    </section>
  );
}
