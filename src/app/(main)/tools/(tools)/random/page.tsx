'use client';

import { Play, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { useState } from 'react';

export default function Random() {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const spin = async () => {
    if (items.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const extraSpins = 5 + Math.random() * 5;
    const finalRotation = rotation + extraSpins * 360 + Math.random() * 360;

    await controls.start({
      rotate: finalRotation,
      transition: { duration: 4, ease: [0.15, 0, 0.15, 1] },
    });

    setRotation(finalRotation);
    setIsSpinning(false);

    // Calculate winner
    const normalizedRotation = finalRotation % 360;
    const sliceAngle = 360 / items.length;
    const winnerIndex = Math.floor(((360 - (normalizedRotation % 360)) % 360) / sliceAngle);
    setWinner(items[winnerIndex]);
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-galaxy-blue/10 rounded-2xl">
            <RotateCcw className="w-8 h-8 text-galaxy-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Vòng quay ngẫu nhiên
            </h1>
            <p className="text-gray-600">
              Công cụ giúp bạn đưa ra quyết định một cách công bằng và thú vị.
            </p>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-full">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Spinner Wheel */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 shrink-0">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                <div
                  className="w-6 h-8 bg-red-500 clip-path-triangle shadow-lg"
                  style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                />
              </div>

              <motion.div
                animate={controls}
                className="w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden shadow-2xl"
                style={{ rotate: rotation }}
              >
                {items.map((item, i) => {
                  const angle = 360 / items.length;
                  const rotate = angle * i;
                  const color = `hsl(${(i * 360) / items.length}, 70%, 60%)`;

                  return (
                    <div
                      key={i}
                      className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                      style={{
                        transform: `rotate(${rotate}deg)`,
                        backgroundColor: color,
                        clipPath: `polygon(0 0, 100% 0, 100% ${Math.tan((angle * Math.PI) / 180) * 100}%, 0 100%)`,
                      }}
                    >
                      <span
                        className="absolute top-4 left-4 text-white font-bold text-xs md:text-sm whitespace-nowrap origin-center"
                        style={{ transform: `rotate(${angle / 2}deg) translateY(20px)` }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}

                {/* Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner z-20 border-4 border-gray-800" />
              </motion.div>

              <button
                onClick={spin}
                disabled={isSpinning || items.length < 2}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                <Play className={`w-8 h-8 text-galaxy-blue ${isSpinning ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            {/* Controls and List */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <RotateCcw className="w-6 h-6 text-galaxy-blue" />
                Vòng quay ngẫu nhiên
              </h2>

              <form onSubmit={addItem} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Thêm lựa chọn..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-galaxy-blue"
                />
                <button
                  type="submit"
                  className="p-2 bg-galaxy-blue text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl group"
                  >
                    <span className="font-medium text-gray-700">{item}</span>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 border border-green-100 rounded-2xl text-center"
                >
                  <p className="text-green-600 text-sm font-medium mb-1">Kết quả:</p>
                  <p className="text-2xl font-bold text-green-700">{winner}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
