/**
 * A venue's patron-facing skin. Only the patron app is themed; bartender and admin
 * screens stay consistent across venues so staff can work anywhere.
 */
export interface VenueTheme {
  displayFont: string; // CSS font-family stack
  bodyFont: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    line: string;
    accent: string;
    onAccent: string;
    ticket: string;
    ticketInk: string;
  };
  radius: string;
  backgroundImage?: string; // CSS background-image value, e.g. a gradient
  /** Optional named signature touch rendered by the patron app (e.g. "papel-picado", "skyline"). */
  signature?: string;
}
