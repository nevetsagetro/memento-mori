import { useState, useEffect, useRef } from 'react';

const MementoMori = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [birthYear, setBirthYear] = useState(1997);
  const [lifeExpectancy, setLifeExpectancy] = useState(76);
  const [virtueMarked, setVirtueMarked] = useState(false);
  const [lastVirtueDate, setLastVirtueDate] = useState<string | null>(null);
  const [cosmicView, setCosmicView] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Generate 52 weeks for any year
  const generateWeeks = (year: number) => {
    const weeks = [];
    for (let week = 1; week <= 52; week++) {
      const startDate = new Date(year, 0, 1 + (week - 1) * 7);
      const endDate = new Date(year, 0, 1 + week * 7 - 1);
      weeks.push({
        weekNumber: week,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        quarter: Math.ceil(week / 13)
      });
    }
    return weeks;
  };

  const weeks = generateWeeks(selectedYear);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };
    animationFrameRef.current = requestAnimationFrame(updateTime);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastVirtueDate && lastVirtueDate !== today) {
      setVirtueMarked(false);
      setLastVirtueDate(null);
    }
  }, [currentTime, lastVirtueDate]);

  const handleVirtueClick = () => {
    const today = new Date().toDateString();
    if (!virtueMarked || lastVirtueDate !== today) {
      setVirtueMarked(true);
      setLastVirtueDate(today);
    }
  };

  const calculateCountdown = () => {
    const target = new Date(`${selectedYear}-12-31T23:59:59.999`);
    const diff = target.getTime() - currentTime.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      milliseconds: diff % 1000
    };
  };

  const countdown = calculateCountdown();

  const calculateYearDepletion = () => {
    const startOfYear = new Date(`${selectedYear}-01-01T00:00:00.000`);
    const endOfYear = new Date(`${selectedYear}-12-31T23:59:59.999`);
    const totalMs = endOfYear.getTime() - startOfYear.getTime();
    const elapsedMs = currentTime.getTime() - startOfYear.getTime();
    return Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);
  };

  const yearDepletion = calculateYearDepletion();

  const calculateLifeDepletion = () => {
    const birthDate = new Date(`${birthYear}-01-01T00:00:00.000`);
    const deathDate = new Date(`${birthYear + lifeExpectancy}-01-01T00:00:00.000`);
    const totalMs = deathDate.getTime() - birthDate.getTime();
    const elapsedMs = currentTime.getTime() - birthDate.getTime();
    return Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);
  };

  const lifeDepletion = calculateLifeDepletion();
  const currentDayBlock = Math.floor((currentTime.getHours() * 60 + currentTime.getMinutes()) / 10);
  const dayBlocks = Array.from({ length: 144 }, (_, i) => i);
  const isWeekCompleted = (endDateStr: string) => currentTime > new Date(endDateStr + 'T23:59:59');

  const getCurrentWeekNumber = () => {
    const start = new Date(`${selectedYear}-01-01`);
    if (currentTime < start || currentTime > new Date(`${selectedYear}-12-31T23:59:59`)) return null;
    return Math.floor((currentTime.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
  };

  const currentWeek = getCurrentWeekNumber();
  const pad = (num: number, size: number) => String(num).padStart(size, '0');
  const yearOptions = Array.from({ length: 15 }, (_, i) => 2026 + i);
  const birthYearOptions = Array.from({ length: 101 }, (_, i) => 1920 + i);
  const lifeExpectancyOptions = Array.from({ length: 71 }, (_, i) => 50 + i);

  const generateLifeScaleWeeks = () => {
    const totalWeeks = 100 * 52;
    const currentAgeWeeks = Math.floor(((new Date().getFullYear() - birthYear) * 365.25 + (currentTime.getMonth() * 30.44) + currentTime.getDate()) / 7);
    return {
      totalWeeks,
      currentWeekInLife: currentAgeWeeks,
      weeks: Array.from({ length: totalWeeks }, (_, i) => i)
    };
  };

  const lifeScaleData = generateLifeScaleWeeks();
  const quarters = [weeks.slice(0, 13), weeks.slice(13, 26), weeks.slice(26, 39), weeks.slice(39, 52)];

  return (
    <div style={{ 
    backgroundColor: '#000000', 
    color: '#FFFFFF', 
    minHeight: '100vh',
    width: '100%', // Asegura que ocupe todo el ancho
    fontFamily: "'Courier New', Courier, monospace",
    padding: '48px 16px', // Un poco más de aire arriba
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box' // Importante para que el padding no rompa el ancho
  }}>
      
      {/* Progress Bars */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '1px', backgroundColor: '#000', zIndex: 1000 }}>
        <div style={{ width: `${yearDepletion}%`, height: '1px', backgroundColor: '#FFF' }}></div>
      </div>
      <div style={{ position: 'fixed', top: '2px', left: 0, width: '100%', height: '1px', backgroundColor: '#000', zIndex: 999 }}>
        <div style={{ width: `${lifeDepletion}%`, height: '1px', backgroundColor: '#666' }}></div>
      </div>

      {/* Selectors */}
      <div style={{ marginBottom: '48px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ backgroundColor: '#000', color: '#FFF', border: '1px solid #FFF', padding: '12px', fontSize: '18px', appearance: 'none' }}>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value))} style={{ backgroundColor: '#000', color: '#FFF', border: '1px solid #444', padding: '10px', flex: 1, appearance: 'none' }}>
            {birthYearOptions.map(y => <option key={y} value={y}>Born: {y}</option>)}
          </select>
          <select value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Number(e.target.value))} style={{ backgroundColor: '#000', color: '#FFF', border: '1px solid #444', padding: '10px', flex: 1, appearance: 'none' }}>
            {lifeExpectancyOptions.map(a => <option key={a} value={a}>Life: {a}y</option>)}
          </select>
        </div>
      </div>

      {/* Countdown */}
      <div style={{ textAlign: 'center', marginBottom: '60px', width: '100%', maxWidth: '400px' }}>
        <div style={{ fontSize: '72px', fontVariantNumeric: 'tabular-nums' }}>{pad(countdown.days, 3)}</div>
        <div style={{ fontSize: '10px', color: '#666', letterSpacing: '3px', marginBottom: '30px' }}>DAYS</div>
        <div style={{ fontSize: '48px', fontVariantNumeric: 'tabular-nums' }}>{pad(countdown.hours, 2)}:{pad(countdown.minutes, 2)}</div>
        <div style={{ fontSize: '9px', color: '#666', letterSpacing: '3px', marginBottom: '20px' }}>HOURS : MINUTES</div>
        
        <div onClick={handleVirtueClick} style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: virtueMarked ? '#FFF' : 'transparent', border: '1px solid #333', cursor: 'pointer', margin: '32px auto 8px' }}></div>
        <div style={{ fontSize: '7px', color: '#444' }}>TODAY</div>

        <div onClick={() => setCosmicView(!cosmicView)} style={{ padding: '12px 24px', border: '1px solid #333', fontSize: '8px', color: '#666', letterSpacing: '3px', cursor: 'pointer', marginTop: '30px' }}>
          {cosmicView ? 'RETURN' : 'ABOVE'}
        </div>
      </div>

      {/* Grids */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {!cosmicView ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '3px', marginBottom: '40px' }}>
              {dayBlocks.map(b => <div key={b} style={{ height: '12px', backgroundColor: b <= currentDayBlock ? '#FFF' : 'transparent', border: `1px solid ${b <= currentDayBlock ? '#FFF' : '#1A1A1A'}` }}></div>)}
            </div>
            {quarters.map((q, i) => (
              <div key={i} style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '8px', color: '#444', textAlign: 'center', marginBottom: '12px' }}>Q{i+1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '8px' }}>
                  {q.map(w => (
                    <div key={w.weekNumber} style={{ display: 'flex', justifyContent: 'center' }}>
                      <svg width="20" height="20">
                        <circle cx="10" cy="10" r="8" fill={isWeekCompleted(w.endDate) ? '#FFF' : 'none'} stroke={w.weekNumber === currentWeek ? '#FFF' : '#1A1A1A'} strokeWidth="1" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(52, 5px)', gap: '2px', justifyContent: 'center' }}>
            {lifeScaleData.weeks.map(idx => (
              <div key={idx} style={{ width: '5px', height: '5px', backgroundColor: idx < lifeScaleData.currentWeekInLife ? '#FFF' : '#222', opacity: idx < lifeScaleData.currentWeekInLife ? 0.5 : 0.2, border: idx === lifeScaleData.currentWeekInLife ? '1px solid #FFF' : 'none' }}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MementoMori;