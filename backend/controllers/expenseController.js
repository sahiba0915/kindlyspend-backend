const xlsx = require('xlsx');
const User = require("../models/User");
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async(req, res) => {
    const userId = req.user.id;

    try{
        const {icon, category, amount, date} = req.body;

        if(!category || !amount || !date){
            return res.status(400).json({message: "All fields are required"});
        }

        const newExpense = new Expense ({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"});
    }
}

// Get All Expense
exports.getAllExpense = async(req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({userId}).sort({data: -1});
        res.json(expense);
    }catch(error){
        res.status(500).json({message: "Server Error"});
    }
}

// Delete Expense
exports.deleteExpense = async(req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense deleted successfully"});
    }catch{
        res.status(500).json({message: "Server Error"})
    }
}

// Download Expense Excel
exports.downloadExpenseExcel = async(req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({userId}).sort({date: -1});

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws, "Expense");
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    }catch(error){
        res.status(500).json({message: "Server Error"});
    }
}