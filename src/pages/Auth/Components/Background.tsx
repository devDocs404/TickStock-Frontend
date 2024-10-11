const Background = () => (
  <div className="absolute inset-0 z-0">
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "rgb(30,58,138)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgb(30,64,175)", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grad1)" />
      <path
        d="M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z"
        fill="rgba(255,255,255,0.05)"
      />
      <path
        d="M0,80 Q25,70 50,80 T100,80 L100,100 L0,100 Z"
        fill="rgba(255,255,255,0.05)"
      />
    </svg>
  </div>
);

export default Background;
