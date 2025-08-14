interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'white' | 'colored';
}

export function Logo({
  width = 24,
  height = 24,
  className = '',
  variant = 'white',
}: LogoProps) {
  const strokeColor =
    variant === 'white' ? 'url(#paint0_linear_187_48)' : '#3B82F6';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21.455 45.2791C22.2551 43.156 23.6945 41.3252 25.58 40.0326C27.4656 38.7401 29.7068 38.0476 32.0029 38.0482C34.299 38.0488 36.5399 38.7425 38.4247 40.036C40.3095 41.3296 41.7479 43.1611 42.5469 45.2846M63 32C63 49.1208 49.1208 63 32 63C14.8792 63 1 49.1208 1 32C1 14.8792 14.8792 1 32 1C49.1208 1 63 14.8792 63 32ZM47 34.3474C47 43.5959 40.4375 48.2201 32.6375 50.9022C32.2291 51.0387 31.7854 51.0322 31.3813 50.8837C23.5625 48.2201 17 43.5959 17 34.3474V21.3996C17 20.909 17.1975 20.4385 17.5492 20.0917C17.9008 19.7448 18.3777 19.5499 18.875 19.5499C22.625 19.5499 27.3125 17.3303 30.575 14.5187C30.9722 14.1839 31.4775 14 32 14C32.5225 14 33.0278 14.1839 33.425 14.5187C36.7062 17.3488 41.375 19.5499 45.125 19.5499C45.6223 19.5499 46.0992 19.7448 46.4508 20.0917C46.8025 20.4385 47 20.909 47 21.3996V34.3474ZM39.5 30.648C39.5 34.7343 36.1421 38.0468 32 38.0468C27.8579 38.0468 24.5 34.7343 24.5 30.648C24.5 26.5618 27.8579 23.2493 32 23.2493C36.1421 23.2493 39.5 26.5618 39.5 30.648Z"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {variant === 'white' && (
        <defs>
          <linearGradient
            id="paint0_linear_187_48"
            x1="32"
            y1="23.2494"
            x2="32"
            y2="38.0469"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
