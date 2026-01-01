import React, { useState, useEffect, useRef } from 'react';

const MementoMori = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [birthYear, setBirthYear] = useState(1997);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [virtueMarked, setVirtueMarked] = useState(false);
  const [lastVirtueDate, setLastVirtueDate] = useState(null);
  const [cosmicView, setCosmicView] = useState(false);
  const [lifeScale, setLifeScale] = useState(80);
  const animationFrameRef = useRef(null);

  // Generate 52 weeks for any year
  const generateWeeks = (year) => {
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
    const diff = target - currentTime;
    
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
    const totalYearMs = endOfYear - startOfYear;
    const elapsedMs = currentTime - startOfYear;
    
    if (elapsedMs <= 0) return 0;
    if (elapsedMs >= totalYearMs) return 100;
    
    return (elapsedMs / totalYearMs) * 100;
  };

  const yearDepletion = calculateYearDepletion();

  // Calculate Life Depletion Percentage
  const calculateLifeDepletion = () => {
    const birthDate = new Date(`${birthYear}-01-01T00:00:00.000`);
    const expectedDeathDate = new Date(`${birthYear + lifeExpectancy}-01-01T00:00:00.000`);
    const totalLifeMs = expectedDeathDate - birthDate;
    const elapsedMs = currentTime - birthDate;
    
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
  const isWeekCompleted = (weekEndDate) => {
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
    
    const diffTime = currentTime - startOfYear;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  const currentWeek = getCurrentWeekNumber();

  // Format number with leading zeros - tabular figures
  const pad = (num, size) => String(num).padStart(size, '0');

  // Generate year options (2026-2040)
  const yearOptions = Array.from({ length: 15 }, (_, i) => 2026 + i);

  // Generate birth year options (1920-2020)
  const birthYearOptions = Array.from({ length: 101 }, (_, i) => 1920 + i);

  // Generate life expectancy options (50-120)
  const lifeExpectancyOptions = Array.from({ length: 71 }, (_, i) => 50 + i);

  // Generate century view (100 years)
  const generateCenturyYears = () => {
    const startYear = Math.floor(selectedYear / 100) * 100;
    return Array.from({ length: 100 }, (_, i) => startYear + i);
  };

  const centuryYears = generateCenturyYears();
  const currentYearInCentury = new Date().getFullYear();

  // Generate life-scale grid (weeks across entire lifespan)
  const generateLifeScaleWeeks = () => {
    const totalWeeks = 100 * 52; // Always show 100 years
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
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none'
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
              WebkitAppearance: 'none',
              MozAppearance: 'none',
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
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              flex: '1'
            }}
          >
            {lifeExpectancyOptions.map(age => (
              <option key={age} value={age}>Life: {age}y</option>
            ))}
          </select>
        </div>
      </div>

      {/* Year Selector */}

      {/* High-Precision Countdown - Hierarchical Typography */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '80px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Days - Largest */}
        <div style={{ 
          fontSize: '72px', 
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 'normal',
          letterSpacing: '0',
          lineHeight: '1',
          marginBottom: '24px',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {pad(countdown.days, 3)}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#666666',
          letterSpacing: '3px',
          marginBottom: '40px'
        }}>
          DAYS
        </div>

        {/* Hours : Minutes */}
        <div style={{ 
          fontSize: '48px', 
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 'normal',
          letterSpacing: '0',
          lineHeight: '1',
          marginBottom: '16px',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {pad(countdown.hours, 2)}:{pad(countdown.minutes, 2)}
        </div>
        <div style={{ 
          fontSize: '9px', 
          color: '#666666',
          letterSpacing: '3px',
          marginBottom: '32px'
        }}>
          HOURS : MINUTES
        </div>

        {/* Seconds */}
        <div style={{ 
          fontSize: '36px', 
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 'normal',
          letterSpacing: '0',
          lineHeight: '1',
          marginBottom: '12px',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {pad(countdown.seconds, 2)}
        </div>
        <div style={{ 
          fontSize: '8px', 
          color: '#666666',
          letterSpacing: '3px',
          marginBottom: '24px'
        }}>
          SECONDS
        </div>

        {/* Milliseconds - Smallest */}
        <div style={{ 
          fontSize: '20px', 
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 'normal',
          letterSpacing: '0',
          lineHeight: '1',
          marginBottom: '8px',
          color: '#999999',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {pad(countdown.milliseconds, 3)}
        </div>
        <div style={{ 
          fontSize: '7px', 
          color: '#444444',
          letterSpacing: '2px',
          marginBottom: '48px'
        }}>
          MILLISECONDS
        </div>

        {/* Binary Virtue Record - Single Dot */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: '32px',
          marginBottom: '24px'
        }}>
          <div
            onClick={handleVirtueClick}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: virtueMarked ? '#FFFFFF' : 'transparent',
              border: `1px solid ${virtueMarked ? '#FFFFFF' : '#333333'}`,
              cursor: 'pointer',
              transition: 'none'
            }}
          ></div>
          <div style={{ 
            fontSize: '7px', 
            color: '#444444',
            letterSpacing: '2px',
            textAlign: 'center'
          }}>
            TODAY
          </div>
        </div>

        {/* Cosmic View Toggle Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '32px',
          marginBottom: '24px'
        }}>
          <div
            onClick={toggleCosmicView}
            style={{
              padding: '12px 24px',
              border: '1px solid #333333',
              fontSize: '8px',
              color: '#666666',
              letterSpacing: '3px',
              cursor: 'pointer',
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            {cosmicView ? 'RETURN TO PRESENT' : 'VIEW FROM ABOVE'}
          </div>
        </div>

        {/* Year Depletion Percentage */}
        <div style={{
          marginTop: '16px',
          paddingTop: '32px',
          borderTop: '1px solid #1A1A1A'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 'normal',
            letterSpacing: '0',
            lineHeight: '1',
            marginBottom: '10px',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {yearDepletion.toFixed(6)}%
          </div>
          <div style={{ 
            fontSize: '8px', 
            color: '#666666',
            letterSpacing: '3px',
            marginBottom: '20px'
          }}>
            YEAR {selectedYear} DEPLETED
          </div>

          {/* Year Depletion Progress Bar */}
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#1A1A1A',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
            <div style={{
              width: `${yearDepletion}%`,
              height: '2px',
              backgroundColor: '#FFFFFF',
              transition: 'none'
            }}></div>
          </div>

          {/* Life Depletion Percentage */}
          <div style={{ 
            fontSize: '28px', 
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 'normal',
            letterSpacing: '0',
            lineHeight: '1',
            marginBottom: '10px',
            fontVariantNumeric: 'tabular-nums',
            color: '#999999'
          }}>
            {lifeDepletion.toFixed(6)}%
          </div>
          <div style={{ 
            fontSize: '8px', 
            color: '#555555',
            letterSpacing: '3px',
            marginBottom: '20px'
          }}>
            LIFE CONSUMED ({birthYear}–{birthYear + lifeExpectancy})
          </div>

          {/* Life Depletion Progress Bar */}
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#1A1A1A',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${lifeDepletion}%`,
              height: '2px',
              backgroundColor: '#666666',
              transition: 'none'
            }}></div>
          </div>
        </div>
      </div>

      {/* Quartered Grid - 4 Seasons */}
      <div style={{ 
        width: '100%',
        maxWidth: '400px',
        marginBottom: '64px'
      }}>

        {!cosmicView ? (
          <>
            {/* Daily Micro-Grid - 144 blocks */}
            <div style={{
              marginBottom: '64px'
            }}>
              <div style={{
                fontSize: '8px',
                color: '#444444',
                letterSpacing: '2px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                TODAY — 144 × 10 MINUTES
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(24, 1fr)',
                gap: '3px',
                marginBottom: '16px'
              }}>
                {dayBlocks.map((block) => {
                  const isPassed = block <= currentDayBlock;
                  
                  return (
                    <div key={block} style={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: isPassed ? '#FFFFFF' : 'transparent',
                        border: `1px solid ${isPassed ? '#FFFFFF' : '#1A1A1A'}`
                      }}></div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                fontSize: '7px',
                color: '#333333',
                letterSpacing: '2px',
                textAlign: 'center'
              }}>
                BLOCK {currentDayBlock + 1} OF 144
              </div>
            </div>

            {quarters.map((quarter, qIndex) => (
              <div key={qIndex}>
                {/* Quarter Label */}
                <div style={{
                  fontSize: '8px',
                  color: '#444444',
                  letterSpacing: '2px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  Q{qIndex + 1}
                </div>
                
                {/* Quarter Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(13, 1fr)',
                  gap: '8px',
                  marginBottom: qIndex < 3 ? '48px' : '0'
                }}>
                  {quarter.map((week) => {
                    const isCompleted = isWeekCompleted(week.endDate);
                    const isCurrent = week.weekNumber === currentWeek;
                    
                    return (
                      <div key={week.weekNumber} style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <svg width="24" height="24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill={isCompleted ? '#FFFFFF' : 'none'}
                            stroke={isCurrent ? '#FFFFFF' : '#1A1A1A'}
                            strokeWidth={isCurrent ? '2' : '1'}
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Cosmic View - Century with Life Milestones */}
            <div style={{
              marginBottom: '32px'
            }}>
              <div style={{
                fontSize: '8px',
                color: '#444444',
                letterSpacing: '2px',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                THE VIEW FROM ABOVE — ONE CENTURY
              </div>
              <div style={{
                fontSize: '7px',
                color: '#333333',
                letterSpacing: '2px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                5,200 WEEKS
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(52, 1fr)',
                gap: '2px',
                marginBottom: '24px'
              }}>
                {lifeScaleData.weeks.map((weekIndex) => {
                  const isPassed = weekIndex < lifeScaleData.currentWeekInLife;
                  const isCurrent = weekIndex === lifeScaleData.currentWeekInLife;
                  const isWithin30Years = weekIndex < (30 * 52);
                  const isWithin50Years = weekIndex < (50 * 52);
                  const isWithinLifeExpectancy = weekIndex < (lifeExpectancy * 52);
                  
                  // Determine fill color based on milestone zones
                  let fillColor = 'transparent';
                  let opacity = 0.03;
                  
                  if (isPassed) {
                    fillColor = '#FFFFFF';
                    opacity = 0.5; // Reduced from 1 to 0.5 for eye comfort
                  } else if (isWithin30Years) {
                    fillColor = '#444444';
                    opacity = 0.4;
                  } else if (isWithin50Years) {
                    fillColor = '#333333';
                    opacity = 0.3;
                  } else if (isWithinLifeExpectancy) {
                    fillColor = '#222222';
                    opacity = 0.2;
                  }
                  
                  return (
                    <div key={weekIndex} style={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: fillColor,
                        border: isCurrent ? '1px solid #FFFFFF' : 'none',
                        opacity: opacity
                      }}></div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                fontSize: '7px',
                color: '#444444',
                letterSpacing: '2px',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                WEEK {lifeScaleData.currentWeekInLife.toLocaleString()} OF 5,200
              </div>

              {/* Legend */}
              <div style={{
                fontSize: '6px',
                color: '#333333',
                letterSpacing: '2px',
                textAlign: 'center',
                lineHeight: '1.8',
                marginBottom: '16px'
              }}>
                30Y ZONE • 50Y ZONE • {lifeExpectancy}Y ZONE
              </div>

              <div style={{
                fontSize: '7px',
                color: '#222222',
                letterSpacing: '1px',
                textAlign: 'center',
                lineHeight: '1.6',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                "Dwell on the beauty of life. Watch the stars, and see yourself running with them."
                <br/>— Marcus Aurelius
              </div>
            </div>
          </>
        )}
      </div>

      {/* Minimalist Footer */}
      <div style={{
        fontSize: '8px',
        color: '#333333',
        letterSpacing: '2px',
        textAlign: 'center'
      }}>
        NEVETS AGETRO
      </div>
      
      <div style={{
        fontSize: '7px',
        color: '#1A1A1A',
        letterSpacing: '2px',
        textAlign: 'center',
        marginTop: '8px'
      }}>
        MEMENTO MORI
      </div>

    </div>
  );
};

export default MementoMori;