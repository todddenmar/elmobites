import React from "react";
import { useQRCode } from "next-qrcode";
type QrCodeViewerProps = {
  url: string;
};
function QrCodeViewer({ url }: QrCodeViewerProps) {
  const { Image } = useQRCode();
  return (
    <div>
      <div className="flex justify-center flex-col gap-2 items-center">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          text={url}
          options={{
            type: "image/jpeg",
            quality: 0.3,
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 400,
            color: {
              dark: "#000",
              light: "#fff",
            },
          }}
        />
      </div>
    </div>
  );
}

export default QrCodeViewer;
