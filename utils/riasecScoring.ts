
export interface RiasecScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export const calculateRiasecScores = (answers: number[]): RiasecScores => {
  // Each category has 10 questions, so we calculate scores for each category
  const realistic = answers.slice(0, 10).reduce((sum, answer) => sum + answer, 0);
  const investigative = answers.slice(10, 20).reduce((sum, answer) => sum + answer, 0);
  const artistic = answers.slice(20, 30).reduce((sum, answer) => sum + answer, 0);
  const social = answers.slice(30, 40).reduce((sum, answer) => sum + answer, 0);
  const enterprising = answers.slice(40, 50).reduce((sum, answer) => sum + answer, 0);
  const conventional = answers.slice(50, 60).reduce((sum, answer) => sum + answer, 0);

  return {
    realistic,
    investigative,
    artistic,
    social,
    enterprising,
    conventional,
  };
};

export const getTopThreeTypes = (scores: RiasecScores): string[] => {
  const sortedEntries = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  return sortedEntries.map(([type]) => type);
};

export const getHollandCode = (scores: RiasecScores): string => {
  const topThree = getTopThreeTypes(scores);
  return topThree.map(type => type[0].toUpperCase()).join('');
};
