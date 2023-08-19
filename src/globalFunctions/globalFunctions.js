export function convertDateFormat(inputDate) {
  if (inputDate === "") {
    return;
  }
  const [year, month, day] = inputDate.split("-");
  const dateObject = new Date(year, parseInt(month) - 1, day);
  const formattedMonth = (dateObject.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const formattedDay = dateObject.getDate().toString().padStart(2, "0");
  const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;
  return formattedDate;
}

export function convertDateTimeString(dateString, timeString) {
  if (dateString === "") {
    return;
  }
  if (timeString === "") {
    return;
  }

  const formattedDate = dateString + "T" + timeString;
  const localDate = new Date(formattedDate);

  return localDate;
}

export function getBudgetByCategory(data) {
  const totalCostByCategory = {};

  data.forEach((budget) => {
    if (totalCostByCategory[budget.BudgetCategory]) {
      totalCostByCategory[budget.BudgetCategory] += budget.Cost;
    } else {
      totalCostByCategory[budget.BudgetCategory] = budget.Cost;
    }
  });

  const result = Object.keys(totalCostByCategory).map((BudgetCategory) => ({
    BudgetCategory,
    Cost: totalCostByCategory[BudgetCategory],
  }));

  return result;
}

export function getBudgetPieChartData(budgetData, totalCost, totalBudget) {
  if (totalBudget === 0) {
    return
  }

  const list = [];
  budgetData.forEach((doc) => {
    var data = {
      x: doc.BudgetCategory,
      y: doc.Cost,
      text: Math.round((doc.Cost / totalBudget) * 100) + "%",
    };
    list.push(data);
  });

  const costDifference = totalBudget - totalCost;

  if (costDifference > 0) {
    var remainingData = {
      x: "Remaining Budget",
      y: costDifference,
      text: Math.round((costDifference / totalBudget) * 100) + "%",
    }
    list.push(remainingData);
  }

  return list;
}
