import { Box, Slider, Typography } from '@mui/material';
import './DayProgress.scss';

interface DayProgressProps {
  value: number | null;
  onChange: (value: number) => void;
}

export default function DaysProgress({ value, onChange }: DayProgressProps) {
  const handleChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  const sliderValue = value ?? 1;

  return (
    <Box className='container'>
      <Box className='labelsContainer'>
        <Typography variant="body2" className='label'>1 day</Typography>
        <Typography variant="body2" className='label'>7 days</Typography>
      </Box>

      <Box className='sliderContainer'>
        <Slider
          value={sliderValue}
          min={1}
          max={7}
          step={1}
          onChange={handleChange}
          classes={{
            root: 'customSlider',
            thumb: 'thumb',
            track: 'track',
            rail: 'rail',
            active: 'active'
          }}
        />
        <Box 
          className='dayLabel' 
          style={{ left: `${((sliderValue - 1) / 6) * 100}%` }}
        >
          <Box className='labelBox'>
            {`${sliderValue} DAY${sliderValue > 1 ? 'S' : ''}`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
