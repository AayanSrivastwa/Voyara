const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const { getDBStatus, getMemoryStore } = require('../config/db');

// @route GET /api/trips/:tripId/expenses (and /api/expenses/trip/:tripId)
const getTripExpenses = async (req, res) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const userId = req.user._id.toString();

    let trip, expenses;

    if (getDBStatus()) {
      trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      expenses = await Expense.find({ tripId }).sort({ date: -1 });
    } else {
      const store = getMemoryStore();
      trip = store.trips.find((t) => t._id.toString() === tripId && t.userId.toString() === userId);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      expenses = store.expenses.filter((e) => e.tripId.toString() === tripId);
    }

    const budget = Number(trip.budget) || 0;
    const currency = trip.currency || 'INR';
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remainingBudget = budget - totalSpent;
    const utilization = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;
    const isOverBudget = totalSpent > budget;

    const categoryMap = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));

    return res.json({
      data: expenses,
      categoryData,
      summary: {
        budget,
        totalSpent,
        remainingBudget,
        utilization,
        isOverBudget,
        currency
      }
    });
  } catch (error) {
    console.error('getTripExpenses error:', error);
    res.status(500).json({ message: 'Failed to retrieve expenses', error: error.message });
  }
};

// @route POST /api/trips/:tripId/expenses (and /api/expenses)
const addExpense = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const tripId = req.params.tripId || req.body.tripId;
    const { title, amount, category, description, date, currency } = req.body;

    if (!tripId || !title || amount === undefined) {
      return res.status(400).json({ message: 'Trip ID, title and amount are required' });
    }

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });

      const expense = await Expense.create({
        tripId,
        userId,
        title,
        amount: Number(amount),
        currency: currency || trip.currency || 'INR',
        category: category || 'Food',
        description: description || '',
        date: date ? new Date(date) : new Date()
      });

      const allExpenses = await Expense.find({ tripId });
      const total = allExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
      if (trip.budget > 0 && total >= trip.budget * 0.8) {
        await Notification.create({
          userId,
          title: total > trip.budget ? `Over Budget: ${trip.destination}` : `Budget Warning: ${trip.destination}`,
          message: `Spent ${trip.currency || 'INR'} ${total.toLocaleString('en-IN')} of ${trip.budget.toLocaleString('en-IN')}.`,
          type: 'budget'
        });
      }

      return res.status(201).json({ data: expense });
    } else {
      const store = getMemoryStore();
      const trip = store.trips.find((t) => t._id.toString() === tripId && t.userId.toString() === userId);
      const newExp = {
        _id: 'exp_' + Date.now(),
        tripId: tripId.toString(),
        userId,
        title,
        amount: Number(amount),
        currency: currency || trip?.currency || 'INR',
        category: category || 'Food',
        description: description || '',
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      store.expenses.push(newExp);
      return res.status(201).json({ data: newExp });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense', error: error.message });
  }
};

// @route PATCH /api/trips/:tripId/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const expense = await Expense.findOneAndUpdate(
        { _id: expenseId, userId },
        req.body,
        { new: true }
      );
      if (!expense) return res.status(404).json({ message: 'Expense not found' });
      return res.json({ data: expense });
    } else {
      const store = getMemoryStore();
      const exp = store.expenses.find((e) => e._id.toString() === expenseId && e.userId.toString() === userId);
      if (!exp) return res.status(404).json({ message: 'Expense not found' });
      Object.assign(exp, req.body);
      return res.json({ data: exp });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
};

// @route DELETE /api/trips/:tripId/expenses/:id (and /api/expenses/:id)
const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
      if (!expense) return res.status(404).json({ message: 'Expense not found' });
      return res.json({ message: 'Expense removed successfully' });
    } else {
      const store = getMemoryStore();
      const initialCount = store.expenses.length;
      store.expenses = store.expenses.filter(
        (e) => !(e._id.toString() === expenseId && e.userId.toString() === userId)
      );
      if (store.expenses.length === initialCount) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      return res.json({ message: 'Expense removed successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
};

module.exports = {
  getTripExpenses,
  addExpense,
  updateExpense,
  deleteExpense
};
