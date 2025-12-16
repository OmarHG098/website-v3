interface CertificateCardProps {
  programName?: string;
  studentName?: string;
  certificateLabel?: string;
}

export function CertificateCard({ programName = "Full-Stack Developer", studentName, certificateLabel = "Certificate of Completion" }: CertificateCardProps) {
  return (
    <div 
      className="relative w-full aspect-[4/3] bg-[#485c6e] rounded-lg overflow-hidden shadow-lg"
      data-testid="certificate-card-dynamic"
    >
      {/* Blue header bar - outside the certificate border */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-primary flex items-center px-4 z-10">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="white"/>
            <path d="M8 12h4v8H8v-8zm6 0h4v8h-4v-8zm6 0h4v8h-4v-8z" fill="#0D6EFD"/>
            <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="#0D6EFD"/>
          </svg>
          <span className="text-white font-bold text-base">4Geeks</span>
        </div>
        {/* Window dots - outside the border */}
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        </div>
      </div>

      {/* Colorful corner decorations - outside the white certificate area */}
      {/* Top right corner */}
      <div className="absolute top-10 right-0 z-0">
        <div className="absolute top-0 right-0 w-6 h-14 bg-cyan-400 rounded-bl-full" />
        <div className="absolute top-10 right-0 w-10 h-16 bg-yellow-400 rounded-l-full" />
      </div>
      
      {/* Bottom right corner */}
      <div className="absolute bottom-0 right-0 z-0">
        <div className="absolute bottom-0 right-0 w-14 h-14 bg-blue-500" />
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500 rounded-tl-lg" />
        <div className="absolute bottom-0 right-10 w-3 h-6 bg-red-500" />
      </div>
      
      {/* Left side decoration */}
      <div className="absolute left-0 top-1/3 z-0">
        <div className="absolute left-0 top-0 w-3 h-10 bg-green-400 rounded-r-full" />
        <div className="absolute left-0 top-8 w-4 h-12 bg-blue-400 rounded-r-full" />
      </div>

      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0 z-0">
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-red-500 rounded-tr-full" />
      </div>

      {/* White certificate area with thin colorful border going all around */}
      <div className="absolute top-12 left-2 right-2 bottom-2 z-[1]">
        {/* Rainbow gradient border */}
        <div 
          className="absolute inset-0 rounded-md"
          style={{
            background: 'linear-gradient(90deg, #22c55e 0%, #06b6d4 20%, #3b82f6 40%, #f59e0b 60%, #ef4444 80%, #ec4899 100%)',
            padding: '3px'
          }}
        >
          {/* White inner area */}
          <div className="w-full h-full bg-white rounded-[4px] relative overflow-hidden">
            {/* Center watermark seal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-44 h-44 opacity-[0.12]">
                <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
                  {/* Laurel wreath left */}
                  <g transform="translate(20, 40)">
                    <path d="M35 120c-25-12-42-35-45-65 6 25 25 48 45 65z" fill="currentColor"/>
                    <path d="M32 105c-20-10-32-30-35-55 5 20 18 40 35 55z" fill="currentColor"/>
                    <path d="M28 90c-15-8-25-22-28-42 4 16 14 32 28 42z" fill="currentColor"/>
                    <path d="M24 75c-12-6-18-18-20-35 3 12 10 25 20 35z" fill="currentColor"/>
                    <path d="M20 60c-8-5-14-14-15-28 2 10 7 20 15 28z" fill="currentColor"/>
                  </g>
                  {/* Laurel wreath right */}
                  <g transform="translate(180, 40) scale(-1, 1)">
                    <path d="M35 120c-25-12-42-35-45-65 6 25 25 48 45 65z" fill="currentColor"/>
                    <path d="M32 105c-20-10-32-30-35-55 5 20 18 40 35 55z" fill="currentColor"/>
                    <path d="M28 90c-15-8-25-22-28-42 4 16 14 32 28 42z" fill="currentColor"/>
                    <path d="M24 75c-12-6-18-18-20-35 3 12 10 25 20 35z" fill="currentColor"/>
                    <path d="M20 60c-8-5-14-14-15-28 2 10 7 20 15 28z" fill="currentColor"/>
                  </g>
                  {/* Text arc paths */}
                  <defs>
                    <path id="topArc" d="M 30 100 A 70 70 0 0 1 170 100" fill="none"/>
                    <path id="bottomArc" d="M 170 115 A 65 65 0 0 1 35 115" fill="none"/>
                  </defs>
                  {/* 4GEEKS text top */}
                  <text fill="currentColor" fontSize="14" fontWeight="bold" letterSpacing="8">
                    <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                      4GEEKS
                    </textPath>
                  </text>
                  {/* CODE WILL SET YOU FREE text bottom */}
                  <text fill="currentColor" fontSize="9" fontWeight="bold" letterSpacing="2">
                    <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                      CODE WILL SET YOU FREE
                    </textPath>
                  </text>
                  {/* Outer gear circle with teeth */}
                  <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  {/* Gear teeth */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i * 360 / 20) * Math.PI / 180;
                    const x1 = 100 + 53 * Math.cos(angle);
                    const y1 = 100 + 53 * Math.sin(angle);
                    const x2 = 100 + 62 * Math.cos(angle);
                    const y2 = 100 + 62 * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>;
                  })}
                  {/* Inner circle */}
                  <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" fill="none"/>
                  {/* Center 4Geeks icon placeholder */}
                  <g transform="translate(75, 80)">
                    {/* Simplified 4Geeks logo shape */}
                    <rect x="5" y="5" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M15 12v16M25 12v16M35 12v16" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </g>
                </svg>
              </div>
            </div>

            {/* Certificate content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
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
