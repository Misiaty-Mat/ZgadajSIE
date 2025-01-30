import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = ({ onScanned }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      true
    );

    const handleScan = async (data) => {
      await scanner.clear();
      onScanned(data);
    };

    const handleError = (err) => {
      console.error(err);
    };

    scanner.render(handleScan, handleError);
  }, [onScanned]);

  return (
    <div className="confirmEventDiv">
      <div id="reader"></div>
    </div>
  );
};

export default QRCodeScanner;
