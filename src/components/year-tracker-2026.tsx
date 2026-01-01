import { useState, useEffect, useRef } from 'react';

const MementoMori = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [birthYear, setBirthYear] = useState(1997);
  const [lifeExpectancy, setLifeExpectancy] = useState(76);
  const [virtueMarked, setVirtueMarked] = useState(false);
  const [lastVirtueDate, setLastVirtueDate] = useState<string | null>(null);
  const [cosmicView, setCosmicView] = useState(false);
  const [lifeScale] = useState(80); // Quitamos setLifeScale si no se usa
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

  // High-precision countdown using requestAnimationFrame
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Toggle cosmic view function
  const toggleCosmicView = () => {
    setCosmicView(prev => !prev);
  };

  // Check if virtue mark has expired (new day)
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastVirtueDate && lastVirtueDate !== today) {
      setVirtueMarked(false);
      setLastVirtueDate(null);
    }
  }, [currentTime, lastVirtueDate]);

  // Handle virtue mark click
  const handleVirtueClick = () => {
    const today = new Date().toDateString();
    if (!virtueMarked || lastVirtueDate !== today) {
      setVirtueMarked(true);
      setLastVirtueDate(today);
    }
  };

  // Calculate countdown to end of selected year
  const calculateCountdown = () => {
    const target = new Date(`${selectedYear}-12-31T23:59:59.999`);
    const diff = target.getTime() - currentTime.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const milliseconds = diff % 1000;
    
    return { days, hours, minutes, seconds, milliseconds };
  };

  const countdown = calculateCountdown();

  // Calculate Year Depletion Percentage
  const calculateYearDepletion = () => {
    const startOfYear = new Date(`${selectedYear}-01-01T00:00:00.000`);
    const endOfYear = new Date(`${selectedYear}-12-31T23:59:59.999`);
    const totalYearMs = endOfYear.getTime() - startOfYear.getTime();
    const elapsedMs = currentTime.getTime() - startOfYear.getTime();
    
    if (elapsedMs <= 0) return 0;
    if (elapsedMs >= totalYearMs) return 100;
    
    return (elapsedMs / totalYearMs) * 100;
  };

  const yearDepletion = calculateYearDepletion();

  // Calculate Life Depletion Percentage
  const calculateLifeDepletion = () => {
    const birthDate = new Date(`${birthYear}-01-01T00:00:00.000`);
    const expectedDeathDate = new Date(`${birthYear + lifeExpectancy}-01-01T00:00:00.000`);
    const totalLifeMs = expectedDeathDate.getTime() - birthDate.getTime();
    const elapsedMs = currentTime.getTime() - birthDate.getTime();
    
    if (elapsedMs <= 0) return 0;
    if (elapsedMs >= totalLifeMs) return 100;
    
    return (elapsedMs / totalLifeMs) * 100;
  };

  const lifeDepletion = calculateLifeDepletion();

  // Calculate current 10-minute block of the day (0-143)
  const getCurrentDayBlock = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return Math.floor(totalMinutes / 10);
  };

  const currentDayBlock = getCurrentDayBlock();

  // Generate array of 144 blocks (24 hours * 6 blocks per hour)
  const dayBlocks = Array.from({ length: 144 }, (_, i) => i);

  // Determine if a week is completed
  const isWeekCompleted = (weekEndDate: string) => {
    const endDate = new Date(weekEndDate + 'T23:59:59');
    return currentTime > endDate;
  };

  // Get current week number for selected year
  const getCurrentWeekNumber = () => {
    const startOfYear = new Date(`${selectedYear}-01-01`);
    const endOfYear = new Date(`${selectedYear}-12-31T23:59:59`);
    
    if (currentTime < startOfYear || currentTime > endOfYear) {
      return null;
    }
    
    const diffTime = currentTime.getTime() - startOfYear.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  const currentWeek = getCurrentWeekNumber();

  // Format number with leading zeros - tabular figures
  const pad = (num: number | string, size: number) => String(num).padStart(size, '0');

  // Generate year options (2026-2040)
  const yearOptions = Array.from({ length: 15 }, (_, i) => 2026 + i);

  // Generate birth year options (1920-2020)
  const birthYearOptions = Array.from({ length: 101 }, (_, i) => 1920 + i);

  // Generate life expectancy options (50-120)
  const lifeExpectancyOptions = Array.from({ length: 71 }, (_, i) => 50 + i);

  // Generate life-scale grid (weeks across entire lifespan)
  const generateLifeScaleWeeks = () => {
    const totalWeeks = 100 * 52; // Always show 100 years
    const currentYearInCentury = new Date().getFullYear();
    const currentAge = currentYearInCentury - birthYear;
    const currentWeekInLife = Math.floor((currentAge * 365.25 + 
      (currentTime.getMonth() * 30.44) + 
      currentTime.getDate()) / 7);
    
    const lifeScaleWeeks = lifeScale * 52; // Weeks in selected life scale
    
    return {
      totalWeeks,
      currentWeekInLife,
      lifeScaleWeeks,
      weeks: Array.from({ length: totalWeeks }, (_, i) => i)
    };
  };

  const lifeScaleData = generateLifeScaleWeeks();

  // Group weeks by quarter
  const quarters = [
    weeks.slice(0, 13),
    weeks.slice(13, 26),
    weeks.slice(26, 39),
    weeks.slice(39, 52)
  ];

  return (
    <div style={{ 
      backgroundColor: '#000000', 
      color: '#FFFFFF', 
      minHeight: '100vh',
      fontFamily: "'Courier New', Courier, monospace",
      padding: '32px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      
      {/* Horizon Line - Year Depletion Progress Bar */}
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '1px',
        backgroundColor: '#000000',
        zIndex: '999'
      }}>
        <div style={{
          width: `${yearDepletion}%`,
          height: '1px',
          backgroundColor: '#FFFFFF',
          transition: 'none'
        }}></div>
      </div>

      {/* Life Depletion Progress Bar - Second Horizon Line */}
      <div style={{
        position: 'fixed',
        top: '2px',
        left: '0',
        width: '100%',
        height: '1px',
        backgroundColor: '#000000',
        zIndex: '998'
      }}>
        <div style={{
          width: `${lifeDepletion}%`,
          height: '1px',
          backgroundColor: '#666666',
          transition: 'none'
        }}></div>
      </div>

      {/* Configuration Section */}
      <div style={{ 
        marginBottom: '48px', 
        width: '100%', 
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '1px solid #FFFFFF',
            padding: '12px',
            fontSize: '18px',
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 'normal',
            textAlign: 'center',
            outline: 'none',
            appearance: 'none'
          }}
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '1px solid #444444',
              padding: '10px',
              fontSize: '14px',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'normal',
              textAlign: 'center',
              outline: 'none',
              appearance: 'none',
              flex: '1'
            }}
          >
            {birthYearOptions.map(year => (
              <option key={year} value={year}>Born: {year}</option>
            ))}
          </select>

          <select
            value={lifeExpectancy}
            onChange={(e) => setLifeExpectancy(Number(e.target.value))}
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '1px solid #444444',
              padding: '10px',
              fontSize: '14px',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'normal',
              textAlign: 'center',
              outline: 'none',
              appearance: 'none',
              flex: '1'
            }}
          >
            {lifeExpectancyOptions.map(age => (
              <option key={age} value={age}>Life: {age}y</option>
            ))}
          </select>
        </div>
      </div>

      {/* High-Precision Countdown */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '80px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '72px', lineHeight: '1', marginBottom: '24px', fontVariantNumeric: 'tabular-nums' }}>
          {pad(countdown.days, 3)}
        </div>
        <div style={{ fontSize: '10px', color: '#666666', letterSpacing: '3px', marginBottom: '40px' }}>DAYS</div>

        <div style={{ fontSize: '48px', lineHeight: '1', marginBottom: '16px', fontVariantNumeric: 'tabular-nums' }}>
          {pad(countdown.hours, 2)}:{pad(countdown.minutes, 2)}
        </div>
        <div style={{ fontSize: '9px', color: '#666666', letterSpacing: '3px', marginBottom: '32px' }}>HOURS : MINUTES</div>

        <div style={{ fontSize: '36px', lineHeight: '1', marginBottom: '12px', fontVariantNumeric: 'tabular-nums' }}>
          {pad(countdown.seconds, 2)}
        </div>
        <div style={{ fontSize: '8px', color: '#666666', letterSpacing: '3px', marginBottom: '24px' }}>SECONDS</div>

        <div style={{ fontSize: '20px', lineHeight: '1', marginBottom: '8px', color: '#999999', fontVariantNumeric: 'tabular-nums' }}>
          {pad(countdown.milliseconds, 3)}
        </div>
        <div style={{ fontSize: '7px', color: '#444444', letterSpacing: '2px', marginBottom: '48px' }}>MILLISECONDS</div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
          <div
            onClick={handleVirtueClick}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: virtueMarked ? '#FFFFFF' : 'transparent',
              border: `1px solid ${virtueMarked ? '#FFFFFF' : '#333333'}`,
              cursor: 'pointer'
            }}
          ></div>
          <div style={{ fontSize: '7px', color: '#444444', letterSpacing: '2px' }}>TODAY</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <div
            onClick={toggleCosmicView}
            style={{ padding: '12px 24px', border: '1px solid #333333', fontSize: '8px', color: '#666666', letterSpacing: '3px', cursor: 'pointer' }}
          >
            {cosmicView ? 'RETURN TO PRESENT' : 'VIEW FROM ABOVE'}
          </div>
        </div>

        <div style={{ marginTop: '16px', paddingTop: '32px', borderTop: '1px solid #1A1A1A' }}>
          <div style={{ fontSize: '28px', lineHeight: '1', marginBottom: '10px', fontVariantNumeric: 'tabular-nums' }}>
            {yearDepletion.toFixed(6)}%
          </div>
          <div style={{ fontSize: '8px', color: '#666666', letterSpacing: '3px', marginBottom: '20px' }}>YEAR {selectedYear} DEPLETED</div>

          <div style={{ width: '100%', height: '2px', backgroundColor: '#1A1A1A', marginBottom: '40px' }}>
            <div style={{ width: `${yearDepletion}%`, height: '2px', backgroundColor: '#FFFFFF' }}></div>
          </div>

          <div style={{ fontSize: '28px', lineHeight: '1', marginBottom: '10px', fontVariantNumeric: 'tabular-nums', color: '#999999' }}>
            {lifeDepletion.toFixed(6)}%
          </div>
          <div style={{ fontSize: '8px', color: '#555555', letterSpacing: '3px', marginBottom: '20px' }}>LIFE CONSUMED</div>

          <div style={{ width: '100%', height: '2px', backgroundColor: '#1A1A1A' }}>
            <div style={{ width: `${lifeDepletion}%`, height: '2px', backgroundColor: '#666666' }}></div>
          </div>
        </div>
      </div>

      {/* Grid rendering */}
      <div style={{ width: '100%', maxWidth: '400px', marginBottom: '64px' }}>
        {!cosmicView ? (
          <>
            <div style={{ marginBottom: '64px' }}>
              <div style={{ fontSize: '8px', color: '#444444', letterSpacing: '2px', marginBottom: '16px', textAlign: 'center' }}>TODAY — 144 × 10 MIN</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '3px' }}>
                {dayBlocks.map((block) => (
                  <div key={block} style={{ width: '12px', height: '12px', backgroundColor: block <= currentDayBlock ? '#FFFFFF' : 'transparent', border: `1px solid ${block <= currentDayBlock ? '#FFFFFF' : '#1A1A1A'}` }}></div>
                ))}
              </div>
            </div>

            {quarters.map((quarter, qIndex) => (
              <div key={qIndex}>
                <div style={{ fontSize: '8px', color: '#444444', letterSpacing: '2px', marginBottom: '16px', textAlign: 'center' }}>Q{qIndex + 1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '8px', marginBottom: '48px' }}>
                  {quarter.map((week) => (
                    <div key={week.weekNumber} style={{ display: 'flex', justifyContent: 'center' }}>
                      <svg width="24" height="24">
                        <circle cx="12" cy="12" r="10" fill={isWeekCompleted(week.endDate) ? '#FFFFFF' : 'none'} stroke={week.weekNumber === currentWeek ? '#FFFFFF' : '#1A1A1A'} strokeWidth={week.weekNumber === currentWeek ? '2' : '1'} />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '8px', color: '#444444', letterSpacing: '2px', marginBottom: '24px' }}>THE VIEW FROM ABOVE — ONE CENTURY</div>
             {/* GRID OPTIMIZADO: Eliminamos anchos fijos para evitar el salto de píxel */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(52, 1fr)', // 52 columnas iguales
              gap: '1px', // Gap pequeño y constante
              marginBottom: '24px', 
              width: '100%'  // Ocupa todo el ancho del contenedor padre
              }}>
              {lifeScaleData.weeks.map((weekIndex) => {
                const isPassed = weekIndex < lifeScaleData.currentWeekInLife;
                const isCurrent = weekIndex === lifeScaleData.currentWeekInLife;
                return (
                  <div key={weekIndex} style={{ 
                    width: '100%', // Se adapta al 1fr del grid
                    aspectRatio: '1/1', // Fuerza a que sea un cuadrado perfecto
                    backgroundColor: isPassed ? '#FFFFFF' : '#222222', 
                    opacity: isPassed ? 0.5 : 0.2,
                    border: isCurrent ? '1px solid #FFFFFF' : 'none',
                    boxSizing: 'border-box'          // Asegura que el borde no sume tamaño extra
                  }}></div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '8px', color: '#333333', letterSpacing: '2px', textAlign: 'center' }}>NEVETS AGETRO</div>
    </div>
  );
};

export default MementoMori;