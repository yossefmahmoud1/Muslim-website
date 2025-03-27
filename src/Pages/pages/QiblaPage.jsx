import { useState, useEffect } from "react";
import Compass from "../../Components/Compass";

const QiblaPage = () => {
  const [direction, setDirection] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);

  const calculateQiblaDirection = (lat, lng) => {
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;

    const phiK = (kaabaLat * Math.PI) / 180.0;
    const lambdaK = (kaabaLng * Math.PI) / 180.0;
    const phi = (lat * Math.PI) / 180.0;
    const lambda = (lng * Math.PI) / 180.0;

    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      );

    return (psi + 360.0) % 360.0;
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          const qibla = calculateQiblaDirection(latitude, longitude);
          setQiblaDirection(qibla);
          setPermissionGranted(true);
        },
        (err) => {
          setError("يجب السماح بالوصول إلى الموقع لتحديد القبلة");
          console.error("Error getting location:", err);
        }
      );
    } else {
      setError("المتصفح لا يدعم خدمة الموقع الجغرافي");
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const watchId = navigator.compass?.watchHeading?.(
      (heading) => {
        setDirection(heading.magneticHeading);
      },
      (err) => {
        console.error("Compass error:", err);
        // بديل للجوالات التي لا تدعم البوصلة مباشرة
        if (window.DeviceOrientationEvent) {
          window.addEventListener("deviceorientation", handleOrientation, true);
        }
      },
      { frequency: 100 }
    );

    const handleOrientation = (event) => {
      if (event.absolute && event.alpha !== null) {
        setDirection(360 - event.alpha);
      }
    };

    return () => {
      if (watchId) navigator.compass.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [permissionGranted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 ">
      <h2 className="text-3xl font-bold mb-8 text-white">اتجاه القبلة</h2>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          {currentLocation && (
            <div className="mb-6 text-lg">
              <p>
                موقعك الحالي: {currentLocation.lat.toFixed(4)}° شمالاً،{" "}
                {currentLocation.lng.toFixed(4)}° شرقاً
              </p>
              <p className="mt-2">اتجاه القبلة: {qiblaDirection.toFixed(1)}°</p>
            </div>
          )}

          <div className="relative w-64 h-64 mb-8">
            <Compass direction={direction} qiblaDirection={qiblaDirection} />
          </div>

          <div className="bg-black/50 border border-white/20 shadow-lg p-4 rounded-lg max-w-md text-white text-right">
            <h3 className="font-bold mb-2 text-lg">إرشادات:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li className="flex justify-end">
                <span>أمسك هاتفك بشكل مستوٍ</span>
              </li>
              <li className="flex justify-end">
                <span>قم بتدوير نفسك حتى تصبح الإبرة الحمراء متجهة للأعلى</span>
              </li>
              <li className="flex justify-end">
                <span>الآن أنت تتجه نحو الكعبة المشرفة</span>
              </li>
              <li className="flex justify-end">
                <span>الخط الأحمر يظهر اتجاه القبلة الحقيقي</span>
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaPage;
