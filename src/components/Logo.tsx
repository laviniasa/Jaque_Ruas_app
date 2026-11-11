type Props = {
  /** cor da silhueta */
  cor?: string;
  /** altura em px (a largura é proporcional) */
  altura?: number;
  className?: string;
};

/** Silhueta da Jaque (símbolo da marca) */
export function Silhueta({ cor = "currentColor", altura = 56, className }: Props) {
  const largura = Math.round(altura * (56 / 192));
  return (
    <svg
      role="img"
      aria-label="Jaque Ruas"
      width={largura}
      height={altura}
      viewBox="26 2 56 192"
      className={className}
    >
      <path
        d="M39 10 C 47 3, 59 7, 57 21 C 56 36, 62 54, 60 78 C 59 88, 63 94, 61 100 C 55 90, 52 72, 51 54 C 50 44, 50 38, 50 34 Z"
        fill={cor}
      />
      <ellipse cx="45" cy="17" rx="7" ry="8.4" fill={cor} />
      <path
        d="M43 27 C 41 31, 30 36, 30 44 C 30 50, 36 53, 40 55 C 43 58, 45 62, 45 66 C 45 72, 38 80, 36.5 92 C 35 106, 37 118, 41 130 C 42 136, 41 142, 41 150 C 41 162, 43 172, 44 180 L 42 190 L 47.5 190 C 47.5 184, 48.5 180, 49.5 176 C 52.5 164, 54.5 152, 52.5 142 C 51.5 136, 54 128, 57 120 C 61 110, 64 104, 64 99 C 76 93, 79 75, 66 67 C 59 63, 53 63, 51 59 C 50 53, 55 44, 54 36 C 53 31, 50 28, 48 27 Z"
        fill={cor}
      />
      <rect x="29" y="8" width="8" height="14" rx="1.8" fill={cor} />
    </svg>
  );
}

/** Logo completo: silhueta + nome */
export function Logo({ subtitulo = true }: { subtitulo?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Silhueta cor="var(--color-pink)" altura={56} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl uppercase tracking-wide">
          Jaque <span className="text-pink">Ruas</span>
        </span>
        {subtitulo && (
          <span className="mt-1 font-mono text-[9px] tracking-[0.36em] text-[var(--muted)]">
            PERSONAL · GLÚTEOS
          </span>
        )}
      </span>
    </span>
  );
}
