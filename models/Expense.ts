import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId
  title: string
  amount: number
  category: string
  date: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Other"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for user and date queries
ExpenseSchema.index({ user: 1, date: -1 })
ExpenseSchema.index({ user: 1, category: 1 })

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema)

export default Expense
