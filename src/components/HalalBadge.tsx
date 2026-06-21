export default function HalalBadge({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="11" fill="#1B8B2A" />
      <rect x="3.5" y="3.5" width="53" height="53" rx="8" stroke="white" strokeWidth="1.5" />
      <text x="30" y="31" textAnchor="middle" dominantBaseline="middle"
        fontFamily="Georgia, 'Times New Roman', serif" fontSize="19" fontWeight="bold" fill="white">
        حلال
      </text>
      <line x1="10" y1="38.5" x2="50" y2="38.5" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" />
      <text x="30" y="46.5" textAnchor="middle"
        fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="800" fill="white" letterSpacing="2">
        HALAL
      </text>
      <text x="30" y="55" textAnchor="middle"
        fontFamily="Arial, sans-serif" fontSize="5" fill="white" fillOpacity="0.7" letterSpacing="1">
        MUI
      </text>
    </svg>
  );
}
