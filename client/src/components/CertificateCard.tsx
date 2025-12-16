import logoImage from "@assets/4geeks-logo.png";

interface CertificateCardProps {
  programName?: string;
  studentName?: string;
  certificateLabel?: string;
}

export function CertificateCard({ programName = "Full-Stack Developer", studentName, certificateLabel = "Certificate of Completion" }: CertificateCardProps) {
  return (
    <div 
      className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg"
      data-testid="certificate-card-dynamic"
      style={{ backgroundColor: '#3b82f6' }}
    >
      {/* Colorful corner decorations - OUTSIDE the white certificate area */}
      {/* Top colored bar accents */}
      <div className="absolute top-0 left-1/4 w-16 h-3 bg-cyan-400 z-0" />
      <div className="absolute top-0 left-1/2 w-20 h-3 bg-yellow-400 z-0" />
      
      {/* Top right corner */}
      <div className="absolute top-3 right-0 z-0">
        <div className="absolute top-0 right-0 w-8 h-16 bg-cyan-400 rounded-bl-full" />
        <div className="absolute top-12 right-0 w-12 h-20 bg-yellow-400 rounded-l-full" />
      </div>
      
      {/* Bottom right corner */}
      <div className="absolute bottom-0 right-0 z-0">
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-600" />
        <div className="absolute bottom-0 right-12 w-6 h-10 bg-orange-500" />
        <div className="absolute bottom-6 right-6 w-6 h-6 bg-red-500" />
      </div>
      
      {/* Left side decoration */}
      <div className="absolute left-0 top-1/4 z-0">
        <div className="absolute left-0 top-0 w-4 h-12 bg-green-400 rounded-r-full" />
        <div className="absolute left-0 top-10 w-5 h-14 bg-blue-400 rounded-r-full" />
      </div>

      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0 z-0">
        <div className="absolute bottom-0 left-0 w-10 h-10 bg-red-500 rounded-tr-full" />
        <div className="absolute bottom-8 left-0 w-6 h-8 bg-blue-400" />
      </div>

      {/* White certificate area with thin colorful border going all around */}
      <div className="absolute top-4 left-4 right-4 bottom-4 z-[1]">
        {/* Rainbow gradient border */}
        <div 
          className="absolute inset-0 rounded-sm p-[3px]"
          style={{
            background: 'linear-gradient(90deg, #22c55e 0%, #06b6d4 15%, #3b82f6 30%, #f59e0b 50%, #ef4444 70%, #ec4899 85%, #22c55e 100%)'
          }}
        >
          {/* White inner area */}
          <div className="w-full h-full bg-white rounded-[2px] relative overflow-hidden">
            {/* Header inside white area: Logo and dots */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
              {/* 4Geeks Logo */}
              <img 
                src={logoImage} 
                alt="4Geeks" 
                className="h-6 w-auto"
              />
              {/* Window dots */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>
            </div>

            {/* Center watermark seal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56 opacity-[0.08]">
                <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
                  {/* Laurel wreath left */}
                  <g transform="translate(15, 35)">
                    <path d="M38 130c-28-14-47-40-50-72 7 28 28 54 50 72z" fill="currentColor"/>
                    <path d="M34 112c-22-11-36-33-39-60 5 22 20 44 39 60z" fill="currentColor"/>
                    <path d="M30 95c-17-9-28-25-31-47 4 18 16 35 31 47z" fill="currentColor"/>
                    <path d="M26 78c-13-7-20-20-22-38 3 14 11 28 22 38z" fill="currentColor"/>
                    <path d="M22 62c-9-5-15-15-17-30 2 11 8 22 17 30z" fill="currentColor"/>
                  </g>
                  {/* Laurel wreath right */}
                  <g transform="translate(185, 35) scale(-1, 1)">
                    <path d="M38 130c-28-14-47-40-50-72 7 28 28 54 50 72z" fill="currentColor"/>
                    <path d="M34 112c-22-11-36-33-39-60 5 22 20 44 39 60z" fill="currentColor"/>
                    <path d="M30 95c-17-9-28-25-31-47 4 18 16 35 31 47z" fill="currentColor"/>
                    <path d="M26 78c-13-7-20-20-22-38 3 14 11 28 22 38z" fill="currentColor"/>
                    <path d="M22 62c-9-5-15-15-17-30 2 11 8 22 17 30z" fill="currentColor"/>
                  </g>
                  {/* Text arc paths */}
                  <defs>
                    <path id="topArc" d="M 25 100 A 75 75 0 0 1 175 100" fill="none"/>
                    <path id="bottomArc" d="M 175 115 A 70 70 0 0 1 25 115" fill="none"/>
                  </defs>
                  {/* 4GEEKS text top */}
                  <text fill="currentColor" fontSize="15" fontWeight="bold" letterSpacing="10">
                    <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                      4GEEKS
                    </textPath>
                  </text>
                  {/* CODE WILL SET YOU FREE text bottom */}
                  <text fill="currentColor" fontSize="10" fontWeight="bold" letterSpacing="3">
                    <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                      CODE WILL SET YOU FREE
                    </textPath>
                  </text>
                  {/* Outer gear circle with teeth */}
                  <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                  {/* Gear teeth */}
                  {[...Array(24)].map((_, i) => {
                    const angle = (i * 360 / 24) * Math.PI / 180;
                    const x1 = 100 + 56 * Math.cos(angle);
                    const y1 = 100 + 56 * Math.sin(angle);
                    const x2 = 100 + 66 * Math.cos(angle);
                    const y2 = 100 + 66 * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>;
                  })}
                  {/* Inner circle with 4Geeks badge */}
                  <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="2" fill="none"/>
                  {/* 4GEEKS text inside badge */}
                  <text x="100" y="78" fill="currentColor" fontSize="8" fontWeight="bold" textAnchor="middle">
                    4GEEKS
                  </text>
                  {/* CODE WILL SET YOU FREE inside badge */}
                  <text x="100" y="130" fill="currentColor" fontSize="5" fontWeight="bold" textAnchor="middle">
                    CODE WILL SET YOU FREE
                  </text>
                  {/* Center geek face icon */}
                  <g transform="translate(72, 85)">
                    {/* Head outline */}
                    <path d="M28 0c-5 0-9 2-12 5-3-2-6-3-10-3-8 0-14 6-14 14v12c0 3 2 5 5 5h42c3 0 5-2 5-5V16c0-8-6-14-14-14h-2z" 
                      fill="currentColor"/>
                    {/* Glasses */}
                    <rect x="4" y="12" width="18" height="14" rx="2" fill="white"/>
                    <rect x="34" y="12" width="18" height="14" rx="2" fill="white"/>
                    <rect x="22" y="16" width="12" height="3" fill="currentColor"/>
                  </g>
                </svg>
              </div>
            </div>

            {/* Certificate content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center pt-8">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">{certificateLabel}</p>
              <h3 className="text-2xl font-bold text-foreground mb-1">{programName}</h3>
              {studentName && (
                <p className="text-lg text-muted-foreground mt-4">
                  Awarded to: <span className="font-semibold text-foreground">{studentName}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
