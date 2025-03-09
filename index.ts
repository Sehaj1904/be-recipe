import express, { Request, Response, NextFunction } from "express";
import mongoose, { Schema, Document } from "mongoose";

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

mongoose
  .connect(
    "mongodb+srv://ansh099:1z08k228X9ESzH6r@cluster0.9car8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  category: string;
  order: number;
}
const recipeSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are required"],
  },
  instructions: {
    type: String,
    required: [true, "Instructions are required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  order: {
    type: Number,
    default: 0,
  },
});
const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
app.get("/recipes", async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // Sort by category and then by order within each category
    const recipes = await Recipe.find(filter).sort({ category: 1, order: 1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving recipes", error });
  }
});
app.post("/recipes", async (req: any, res: any) => {
  try {
    const { title, ingredients, instructions, category, order } = req.body;

    if (!title || !ingredients || !instructions || !category) {
      return res.status(400).json({
        message: "Title, ingredients, instructions, and category are required",
      });
    }

    let recipeOrder = order;
    if (recipeOrder === undefined) {
      const count = await Recipe.countDocuments({ category });
      recipeOrder = count;
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      category,
      order: recipeOrder,
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error creating recipe", error });
  }
});

app.put("/recipes/:id", async (req: any, res: any) => {
  try {
    const recipeId = req.params.id;
    const updateData = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe", error });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
