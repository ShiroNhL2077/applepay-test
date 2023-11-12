import Category from "../models/Categories.js";


// Add a new category or update an inactive category by name
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if a category with the same name exists and isActive is true
    let existingCategory = await Category.findOne({ name, isActive: true });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Check if a category with the same name exists but is inactive (isActive: false)
    existingCategory = await Category.findOne({ name, isActive: false });

    if (existingCategory) {
      // Update the existing inactive category to be active
      existingCategory.isActive = true;
      existingCategory.description = description;
      const updatedCategory = await existingCategory.save();
      return res.status(200).json(updatedCategory);
    }

    // If no category with the same name exists, create a new one
    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();
    return res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a category by ID
export const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if the category exists and isActive is true
    const category = await Category.findOne({
      _id: categoryId,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found or has been deleted" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Safe delete a category by setting isActive to false
export const safeDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if the category exists
    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!existingCategory.isActive) {
      return res.status(400).json({ message: "Category is already deleted" });
    }

    // Set isActive to false to mark it as deleted
    existingCategory.isActive = false;
    const updatedCategory = await existingCategory.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

