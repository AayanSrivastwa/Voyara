import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import Notification from '../models/Notification.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const expenses = await Expense.find({ tripId }).sort({ date: -1 });

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const budget = trip.budget || 0;
    const remainingBudget = budget - totalSpent;
    const utilizationPercentage = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

    // Breakdown by category
    const categoryBreakdown = {};
    expenses.forEach((item) => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.amount;
    });

    const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));

    res.status(200).json({
      success: true,
      summary: {
        budget,
        totalSpent: Math.round(totalSpent),
        remainingBudget: Math.round(remainingBudget),
        utilizationPercentage,
        isOverBudget: totalSpent > budget && budget > 0,
        currency: trip.currency || 'INR',
      },
      categoryData,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    next(err);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const { title, category, amount, currency, description, date } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      tripId,
      title,
      category: category || 'Food',
      amount: Number(amount),
      currency: currency || trip.currency || 'INR',
      description,
      date: date ? new Date(date) : new Date(),
    });

    // Check if new total exceeds budget
    const allExpenses = await Expense.find({ tripId });
    const currentTotal = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    if (trip.budget > 0 && currentTotal > trip.budget) {
      try {
        await Notification.create({
          userId: req.user._id,
          title: 'Budget Alert',
          message: `Expenses for trip "${trip.title}" (${trip.currency} ${Math.round(currentTotal)}) have exceeded the allocated budget of ${trip.currency} ${trip.budget}.`,
          type: 'budget',
          relatedTripId: trip._id,
        });
      } catch {
        // Ignore
      }
    }

    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense recorded successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found or unauthorized.' });
    }

    const fields = ['title', 'category', 'amount', 'currency', 'description', 'date'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        expense[field] = req.body[field];
      }
    });

    await expense.save();

    res.status(200).json({
      success: true,
      data: expense,
      message: 'Expense updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found or unauthorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Expense removed.',
    });
  } catch (err) {
    next(err);
  }
};
