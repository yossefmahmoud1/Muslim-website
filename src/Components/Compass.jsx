const Compass = ({ direction, qiblaDirection }) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-full border-4 border-orange-500 bg-gray-900 flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-white"></div>
      </div>

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 
          border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600"
        style={{ transform: `translateX(-50%) rotate(${direction}deg)` }}
      ></div>

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-green-500"
        style={{ transform: `translateX(-50%) rotate(${qiblaDirection}deg)` }}
      >
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
        <div
          key={degree}
          className="absolute top-0 left-1/2 h-full w-px bg-white/50"
          style={{ transform: `translateX(-50%) rotate(${degree}deg)` }}
        >
          <span
            className="absolute top-2 transform -translate-x-1/2 rotate-180 text-xs"
            style={{ transform: `rotate(${-degree}deg)` }}
          >
            {degree}°
          </span>
        </div>
      ))}
    </div>
  );
};

export default Compass;
