import authRouter from '#server/routes/auth.js';
import currencyRouter from '#server/routes/currency.js';
import expenseRouter from '#server/routes/expense.js';
import incomeRouter from '#server/routes/income.js';
import userRouter from '#server/routes/user.js';
import expenseCategoryRouter from '#server/routes/expense_category.js';
import dashboardRouter from '#server/routes/dashboard.js';
import currentStateRouter from '#server/routes/current_state.js';

export default function (app) {
    app.use('/api', currencyRouter);
    app.use('/api', authRouter);
    app.use('/api', userRouter);
    app.use('/api/expense', expenseRouter);
    app.use('/api/income', incomeRouter);
    app.use('/api/expenses-category', expenseCategoryRouter);
    app.use('/api/dashboard', dashboardRouter);
    app.use('/api/state', currentStateRouter);
};
