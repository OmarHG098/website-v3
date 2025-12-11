interface CertificateCardProps {
  programName?: string;
  studentName?: string;
  certificateLabel?: string;
}

export function CertificateCard({ programName = "Full-Stack Developer", studentName, certificateLabel = "Certificate of Completion" }: CertificateCardProps) {
  return (
    <div 
      className="relative w-full aspect-[4/3] bg-white rounded-lg overflow-hidden shadow-lg border border-border"
      data-testid="certificate-card-dynamic"
    >
      {/* Blue header bar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-primary flex items-center px-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="white"/>
            <path d="M8 12h4v8H8v-8zm6 0h4v8h-4v-8zm6 0h4v8h-4v-8z" fill="#0D6EFD"/>
            <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="#0D6EFD"/>
          </svg>
          <span className="text-white font-bold text-lg">4Geeks</span>
        </div>
        {/* Window buttons */}
        <div className="ml-auto flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="w-3 h-3 rounded-full bg-red-400" />
        </div>
      </div>

      {/* Colorful corner decorations */}
      {/* Top right */}
      <div className="absolute top-12 right-0 w-16 h-32">
        <div className="absolute top-0 right-0 w-8 h-16 bg-cyan-400 rounded-bl-full" />
        <div className="absolute top-12 right-0 w-12 h-20 bg-yellow-400 rounded-l-full" />
      </div>
      
      {/* Bottom right */}
      <div className="absolute bottom-0 right-0 w-20 h-20">
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500" />
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-orange-500 rounded-tl-lg" />
        <div className="absolute bottom-0 right-8 w-4 h-8 bg-red-500" />
      </div>
      
      {/* Left side decoration */}
      <div className="absolute left-0 top-1/3 w-6 h-24">
        <div className="absolute left-0 top-0 w-4 h-12 bg-green-400 rounded-r-full" />
        <div className="absolute left-0 top-10 w-5 h-14 bg-blue-400 rounded-r-full" />
      </div>

      {/* Center watermark seal */}
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="relative w-48 h-48 opacity-20">
          {/* Outer gear/cog ring */}
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
            {/* Laurel wreath left */}
            <g transform="translate(30, 50)">
              <path d="M40 100c-20-10-35-30-38-55 5 20 20 40 38 55zm-5-10c-15-8-25-25-28-45 4 15 15 32 28 45zm-5-10c-12-6-20-20-22-38 3 12 12 26 22 38z" 
                fill="currentColor" opacity="0.6"/>
            </g>
            {/* Laurel wreath right */}
            <g transform="translate(130, 50) scale(-1, 1)">
              <path d="M40 100c-20-10-35-30-38-55 5 20 20 40 38 55zm-5-10c-15-8-25-25-28-45 4 15 15 32 28 45zm-5-10c-12-6-20-20-22-38 3 12 12 26 22 38z" 
                fill="currentColor" opacity="0.6"/>
            </g>
            {/* Outer dashed circle */}
            <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 2" opacity="0.4"/>
            {/* Text arc - 4GEEKS */}
            <text>
              <textPath href="#topArc" className="text-xs font-bold" fill="currentColor">
                4GEEKS
              </textPath>
            </text>
            <defs>
              <path id="topArc" d="M 30 100 A 70 70 0 0 1 170 100" fill="none"/>
              <path id="bottomArc" d="M 170 100 A 70 70 0 0 1 30 100" fill="none"/>
            </defs>
            {/* Text arc - CODE WILL SET YOU FREE */}
            <text>
              <textPath href="#bottomArc" className="text-xs font-bold" fill="currentColor">
                CODE WILL SET YOU FREE
              </textPath>
            </text>
            {/* Inner gear circle */}
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
            {/* Gear teeth */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360 / 16) * Math.PI / 180;
              const x1 = 100 + 48 * Math.cos(angle);
              const y1 = 100 + 48 * Math.sin(angle);
              const x2 = 100 + 56 * Math.cos(angle);
              const y2 = 100 + 56 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="4" opacity="0.5"/>;
            })}
            {/* Center emblem */}
            <circle cx="100" cy="100" r="35" fill="currentColor" opacity="0.15"/>
            <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Certificate content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 px-8 text-center">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">{certificateLabel}</p>
        <h3 className="text-2xl font-bold text-foreground mb-1">{programName}</h3>
        {studentName && (
          <p className="text-lg text-muted-foreground mt-4">
            Awarded to: <span className="font-semibold text-foreground">{studentName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
