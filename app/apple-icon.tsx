import { ImageResponse } from "next/og";

import { MARK_TD_PATH, MARK_VIEWBOX } from "@/components/Logo";

/* Home-screen icon. Square and opaque: iOS rounds the corners itself and
   renders transparency as black. Same drawing as app/icon.svg. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#063268" }}>
        <svg viewBox={MARK_VIEWBOX} width={146} height={80}>
          <path fill="#ffffff" d={MARK_TD_PATH} />
          <circle cx="976" cy="428" r="64" fill="#06a69e" />
          <rect x="931" y="511" width="99" height="301" rx="24" fill="#06a69e" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
