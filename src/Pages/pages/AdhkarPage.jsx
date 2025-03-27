import { useState } from "react";

const AdhkarPage = () => {
  const [activeCategory, setActiveCategory] = useState("morning");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const adhkar = {
    morning: [
      "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
      "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور",
      "اللهم إني أصبحت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك، أنك أنت الله لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك (3 مرات)",
      "سبحان الله وبحمده (100 مرة)",
    ],
    evening: [
      "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
      "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير",
      "اللهم إني أمسيت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك، أنك أنت الله لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك (3 مرات)",
      "أعوذ بكلمات الله التامات من شر ما خلق (3 مرات)",
    ],
    afterPrayer: [
      "أستغفر الله (3 مرات)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام",
      "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير (10 مرات)",
      "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
      "سبحان الله (33 مرة)، الحمد لله (33 مرة)، الله أكبر (34 مرة)",
    ],
  };

  const copyDhikr = (text) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ الذكر: " + text.substring(0, 20) + "...");
  };

  // تصفية الأذكار الفارغة
  const filteredAdhkar = adhkar[activeCategory].filter(
    (dhikr) => dhikr.trim() !== ""
  );

  return (
    <div className="w-full p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        الأذكار اليومية
      </h2>

      <div className="flex flex-wrap justify-center gap-2 mb-6 w-full max-w-lg">
        {Object.keys(adhkar).map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setExpandedIndex(null); // إعادة تعيين التوسع عند تغيير الفئة
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category
                ? "bg-green-600 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {category === "morning" && "أذكار الصباح"}
            {category === "evening" && "أذكار المساء"}
            {category === "afterPrayer" && "أذكار بعد الصلاة"}
          </button>
        ))}
      </div>

      {filteredAdhkar.length > 0 ? (
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAdhkar.map((dhikr, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <p className="text-white text-lg leading-relaxed text-right">
                  {isExpanded
                    ? dhikr
                    : dhikr.substring(0, 50) + (dhikr.length > 50 ? "..." : "")}
                </p>
                <div className="flex justify-between mt-3">
                  {dhikr.length > 50 && (
                    <button
                      onClick={() =>
                        setExpandedIndex(isExpanded ? null : index)
                      }
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      {isExpanded ? "إخفاء الذكر" : "تكملة الذكر"}
                    </button>
                  )}
                  <button
                    onClick={() => copyDhikr(dhikr)}
                    className="bg-green-700/80 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    نسخ الذكر
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-white text-center py-8">
          لا توجد أذكار متاحة لهذه الفئة حالياً
        </div>
      )}
    </div>
  );
};

export default AdhkarPage;
