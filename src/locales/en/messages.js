export const messages = {
    info: {
        scheduled_rule: 'Scheduled expenses are automaticatly added in the morning on 23th of each month if actual.',
        monthly_expense_caption: "This expense happens every month. If you want to disable it, press toggle. You can create another regular expense, but there is no opportunity to edit the existing one.",
        calculated_according_to_currencies: 'Calculated according to the defined currencies.',
        base_currency_hint: 'Select base currency for displaying totals',
    },
    confirm: {
        delete_expense_category: 'Are you sure you want to delete expenses category? All expenses of this category will be deleted. Maybe you would like to set it unactive instead?',
        delete_state_category: 'Are you sure you want to delete state category?',
        delete_saving_category: 'Are you sure you want to delete saving category? All savings will still be displayed anyway.',
        fix_state: 'Are you sure you want to add data? It is recommended to fix data once a month.',
        fix_state_existing: 'You have already added sum for this user, period and category.',
        scheduled_delete: 'On deleting scheduled expense previous expenses will not be deleted, only future once will be canceled.',
    },
    success: {
        expense_updated: 'Scheduled expense has been successfully updated',
        currency_set: 'Currency has been successfully set',
        expenses_category_updated: 'Expenses category has been successfully updated',
        expenses_category_deleted: 'Expenses category has been successfully deleted',
        state_category_updated: 'State category has been successfully updated',
        state_category_deleted: 'State category has been successfully deleted',
        saving_category_updated: 'Saving category has been successfully updated',
        saving_category_deleted: 'Saving category has been successfully deleted',
        state_updated: 'State has been successfully updated',
        scheduled_canceled: 'Scheduled expense canceled. Only future occurrences were removed.'
    }
};
