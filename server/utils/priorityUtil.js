const calculatePriority = (endDate) => {
  const today = new Date();
  const due = new Date(endDate);

  const diffDays = Math.ceil(
    (due - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0 || diffDays <= 2) return "HIGH";
  if (diffDays <= 5) return "MEDIUM";
  return "LOW";
};

module.exports = calculatePriority;
