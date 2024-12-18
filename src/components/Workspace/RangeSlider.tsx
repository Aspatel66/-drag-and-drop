import React from 'react';

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 1, 
  step = 0.1 
}) => {
  return (
    <div className="range-slider width:100px">
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="slider w-full bg-gray-900/50 border border-gray-700/50 rounded px-2 py-1
                    text-sm text-white placeholder-gray-500 "
    />
    </div>
  );
};

export default RangeSlider;