import CategoryExpense from "#server/models/base/category_expense.js";
import Currency from "#server/models/base/currency.js";
import CurrentState from "#server/models/base/current_state.js";
import CurrentStateCategory from "#server/models/base/current_state_category.js";
import Expense from "#server/models/base/expense.js";
import Group from "#server/models/base/group.js";
import Income from "#server/models/base/income.js";
import RepeatableExpense from "#server/models/base/repeatable_expense.js";
import User from "#server/models/base/user.js";
import UserToGroup from "#server/models/base/user_to_group.js";

/** Group relationships */
User.hasMany(Group, {
    as: 'admin',
    foreignKey: {
        name: 'admin_id'
    }
});
Group.belongsTo(User, {
    as: 'admin',
    foreignKey: 'admin_id'
});

User.belongsToMany(Group, {
    as: 'group',
    foreignKey: 'user_id',
    through: UserToGroup
});
Group.belongsToMany(User, {
    as: 'users',
    foreignKey: 'group_id',
    through: UserToGroup
});

CategoryExpense.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(CategoryExpense, {
    as: 'category_expenses',
    foreignKey: 'group_id'
});

Currency.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(Currency, {
    as: 'currencies',
    foreignKey: 'group_id'
});

CurrentStateCategory.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(CurrentStateCategory, {
    as: 'current_state_categories',
    foreignKey: 'group_id'
});

CurrentState.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(CurrentState, {
    as: 'current_states',
    foreignKey: 'group_id'
});

Expense.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(Expense, {
    as: 'expenses',
    foreignKey: 'group_id'
});

Income.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(Income, {
    as: 'incomes',
    foreignKey: 'group_id'
});

RepeatableExpense.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id'
});
Group.hasMany(RepeatableExpense, {
    as: 'repeatable_expenses',
    foreignKey: 'group_id'
});
/** /Group relationships */

/** /Group relationshps */

/** Currency relationships */
CategoryExpense.belongsTo(Currency, {
    as: 'currency',
    foreignKey: 'currency_id'
});
Currency.hasMany(CategoryExpense, {
    as: 'category_expenses',
    foreignKey: 'currency_id'
});

CurrentStateCategory.belongsTo(Currency, {
    as: 'currency',
    foreignKey: 'currency_id'
});
Currency.hasMany(CurrentStateCategory, {
    as: 'current_state_categories',
    foreignKey: 'currency_id'
});

Income.belongsTo(Currency, {
    as: 'currency',
    foreignKey: 'currency_id'
});
Currency.hasMany(Income, {
    as: 'incomes',
    foreignKey: 'currency_id'
});
/** /Currency relationships */

/** User relationships */
CurrentState.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});
User.hasMany(CurrentState, {
    as: 'current_states',
    foreignKey: 'user_id'
});

Expense.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});
User.hasMany(Expense, {
    as: 'expenses',
    foreignKey: 'user_id'
});

Income.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});
User.hasMany(Income, {
    as: 'incomes',
    foreignKey: 'user_id'
});
/** /User relationships */

CurrentState.belongsTo(CurrentStateCategory, {
    as: 'current_state_category',
    foreignKey: 'category_id'
});
CurrentStateCategory.hasMany(CurrentState, {
    as: 'current_states',
    foreignKey: 'category_id'
});

RepeatableExpense.belongsTo(Expense, {
    as: 'expense',
    foreignKey: 'expense_id'
});
Expense.hasMany(RepeatableExpense, {
    as: 'repeatable_expenses',
    foreignKey: 'expense_id'
});

export default {
    User,
    Group,
    CategoryExpense,
    Currency,
    CurrentStateCategory,
    CurrentState,
    Expense,
    Income,
    RepeatableExpense,
};
