export default function LogoCloud() {
  return (
    <div>
      <p className="mt-24 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
        Brought to you by
      </p>
      <div className="my-12 grid grid-cols-1	place-items-center space-y-4 sm:mt-8 sm:grid sm:grid-cols-5 sm:gap-6 sm:space-y-0 md:mx-auto md:max-w-2xl">
        <div className="flex h-12 items-center justify-start">
          <a aria-label="Next.js Link" href="https://nextjs.org">
            <img
              alt="Next.js Logo"
              className="h-6 text-white sm:h-12"
              src="/nextjs.svg"
            />
          </a>
        </div>
        <div className="flex h-12 items-center justify-start">
          <a aria-label="Vercel.com Link" href="https://vercel.com">
            <img
              alt="Vercel.com Logo"
              className="h-6 text-white"
              src="/vercel.svg"
            />
          </a>
        </div>
        <div className="flex h-12 items-center justify-start">
          <a aria-label="stripe.com Link" href="https://stripe.com">
            <img
              alt="stripe.com Logo"
              className="h-12 text-white"
              src="/stripe.svg"
            />
          </a>
        </div>
        <div className="flex h-12 items-center justify-start">
          <a aria-label="supabase.io Link" href="https://supabase.io">
            <img
              alt="supabase.io Logo"
              className="h-10 text-white"
              src="/supabase.svg"
            />
          </a>
        </div>
        <div className="flex h-12 items-center justify-start">
          <a aria-label="github.com Link" href="https://github.com">
            <img
              alt="github.com Logo"
              className="h-8 text-white"
              src="/github.svg"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
