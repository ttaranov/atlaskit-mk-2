export const resetBreakPoints = (primaryToolbarWidth: number) => {
  // 0.12 below if for space that is used in margins and paddings
  const adjustedWidth = primaryToolbarWidth * 1.14;
  breakPoints.BreakPoint1 = adjustedWidth;
  breakPoints.BreakPoint2 = breakPoints.BreakPoint1 - 50;
  breakPoints.BreakPoint3 = breakPoints.BreakPoint2 - 32;
  breakPoints.BreakPoint4 = breakPoints.BreakPoint3 - 32;
  breakPoints.BreakPoint5 = breakPoints.BreakPoint4 - 32;
  breakPoints.BreakPoint6 = breakPoints.BreakPoint5 - 32;
  breakPoints.BreakPoint7 = breakPoints.BreakPoint6 - 32;
  breakPoints.BreakPoint8 = breakPoints.BreakPoint7 - 32;
  breakPoints.BreakPoint9 = breakPoints.BreakPoint8 - primaryToolbarWidth / 10;
  breakPoints.BreakPoint10 = breakPoints.BreakPoint9 - 32;
};

const breakPoints = {
  BreakPoint1: 770,
  BreakPoint2: 694,
  BreakPoint3: 660,
  BreakPoint4: 630,
  BreakPoint5: 600,
  BreakPoint6: 566,
  BreakPoint7: 532,
  BreakPoint8: 500,
  BreakPoint9: 435,
  BreakPoint10: 400,
};

export default breakPoints;
