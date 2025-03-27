import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const MainPage = () => {
  const [city, setCity] = useState("القاهرة");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const cities = ["القاهرة", "الاسكندرية", "الجيزة", "الاقصر", "اسوان"];

  const prayerList = [
    { key: "Fajr", name: "الفجر" },
    { key: "Dhuhr", name: "الظهر" },
    { key: "Asr", name: "العصر" },
    { key: "Maghrib", name: "المغرب" },
    { key: "Isha", name: "العشاء" },
  ];

  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${hours} ساعة ${minutes} دقيقة ${secondsRemaining} ثانية`;
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=EG&method=5`
        );
        const data = await response.json();
        if (data.data && data.data.timings) {
          setPrayerTimes(data.data.timings);
        } else {
          throw new Error("Invalid prayer times data");
        }
      } catch (error) {
        toast.error("حدث خطأ في جلب مواقيت الصلاة");
        console.error("Error fetching prayer times:", error);
      }
    };

    fetchPrayerTimes();
  }, [city]);

  useEffect(() => {
    if (!prayerTimes) return;

    const updateNextPrayer = () => {
      const now = new Date();
      let foundNextPrayer = null;
      let smallestDiff = Infinity;

      for (let prayer of prayerList) {
        const [hours, minutes] =
          prayerTimes[prayer.key]?.split(":").map(Number) || [];
        if (isNaN(hours)) continue;

        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);

        if (prayerTime < now) {
          prayerTime.setDate(prayerTime.getDate() + 1);
        }

        const diff = prayerTime - now;
        if (diff > 0 && diff < smallestDiff) {
          smallestDiff = diff;
          foundNextPrayer = prayer;
        }
      }

      if (foundNextPrayer) {
        setNextPrayer(foundNextPrayer);
        const timeLeft = Math.floor(smallestDiff / 1000);
        setTimeRemaining(formatTimeRemaining(timeLeft));
      }
    };

    updateNextPrayer();
    const timer = setInterval(updateNextPrayer, 1000);
    return () => clearInterval(timer);
  }, [prayerTimes]);

  useEffect(() => {
    if (city && nextPrayer) {
      setNotificationMessage(
        `تم تغيير المدينة إلى ${city}\nالصلاة القادمة: ${nextPrayer.name}\nالمتبقي: ${timeRemaining}`
      );
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [city]);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 relative">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            key="notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed sm:top-16 top-24 sm:left-3/4  left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center min-w-[300px] max-w-[90vw] whitespace-pre-line"
          >
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-4">
          مواقيت الصلاة في {city}
        </h1>

        <div className="text-center mb-4">
          <p className="text-xl text-white font-semibold">{currentDate}</p>
          {nextPrayer && (
            <p className="text-lg text-black font-bold mt-2">
              الصلاة القادمة: {nextPrayer.name} - المتبقي: {timeRemaining}
            </p>
          )}
        </div>

        <div className="mb-4">
          <div className="relative w-full">
            <select
              className="w-full bg-green-700/80 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={(e) =>
                (e.target.size = cities.length > 5 ? 5 : cities.length)
              }
              onBlur={(e) => (e.target.size = 1)}
            >
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {prayerTimes ? (
            <>
              {prayerList.map((prayer) => (
                <motion.div
                  key={prayer.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex justify-between items-center p-3 rounded-lg transition-all ${
                    nextPrayer?.key === prayer.key
                      ? "bg-green-600/90 shadow-lg"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  <span className="text-white text-right text-lg">
                    {prayerTimes[prayer.key]}
                  </span>
                  <span className="text-white font-medium text-left text-lg">
                    {prayer.name}
                  </span>
                </motion.div>
              ))}
            </>
          ) : (
            <p className="text-center text-white py-4">
              جاري تحميل البيانات...
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MainPage;
