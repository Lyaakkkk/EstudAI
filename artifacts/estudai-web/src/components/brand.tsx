/** Original vectors with color-only contrast variants; backgrounds remain transparent. */
export function OfficialLogo({ className = '' }: { className?: string }) {
  return <span className={'brand-logo ' + className}><img src={import.meta.env.BASE_URL + 'brand/estudai-logo-light.svg'} width={980} height={360} alt="EstudAI — ORGANIZE • CONVERSE • APRENDA" className="brand-asset-light" /><img src={import.meta.env.BASE_URL + 'brand/estudai-logo-dark.svg'} width={980} height={360} alt="EstudAI — ORGANIZE • CONVERSE • APRENDA" className="brand-asset-dark" /></span>;
}
export function OfficialSparkle({ size = 18, className = '' }: { size?: number; className?: string }) {
  return <span aria-hidden="true" className={className} style={{ width: size, height: size, flexShrink: 0 }}><img src={import.meta.env.BASE_URL + 'brand/estudai-sparkle-light.svg'} width={size} height={size} alt="" className="brand-asset-light" /><img src={import.meta.env.BASE_URL + 'brand/estudai-sparkle-dark.svg'} width={size} height={size} alt="" className="brand-asset-dark" /></span>;
}
