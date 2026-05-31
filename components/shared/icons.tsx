export type IconName =
  | "agenda"
  | "box"
  | "cash"
  | "chart"
  | "dashboard"
  | "file"
  | "price"
  | "service"
  | "settings"
  | "sync"
  | "team"
  | "user";

const paths: Record<IconName, React.ReactNode> = {
  agenda: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4.5 8 7.5 4 7.5-4M12 12v8.5" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 9v.01M18 15v.01" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-8" />
    </>
  ),
  dashboard: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l4 4v14H7V3Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  price: (
    <>
      <path d="M20 12 12 20 4 12V4h8l8 8Z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </>
  ),
  service: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-3 3-3-3 3-3Z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M3 12h3M18 12h3M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1" />
    </>
  ),
  sync: (
    <>
      <path d="M20 7h-5a5 5 0 0 0-8.7-2.2L5 6" />
      <path d="M4 17h5a5 5 0 0 0 8.7 2.2L19 18" />
      <path d="M20 3v4h-4M4 21v-4h4" />
    </>
  ),
  team: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M3.5 20a5 5 0 0 1 9 0M11.5 20a5 5 0 0 1 9 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  )
};

export function AppIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
    >
      {paths[name]}
    </svg>
  );
}
