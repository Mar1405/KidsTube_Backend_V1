const Users = require("../models/usersModels");

/**
 * Get all users
 *
 * @param {*} req
 * @param {*} res
 */
const usersGet = async (req, res) => {
  try {
    // If a specific user is required
    if (req.query && req.query.id) {
      const user = await Users.findById(req.query.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    }
    // Find by email and password
    else if (req.query && req.query.email && req.query.password) {
      const userByEmail = await Users.findOne({
        email: req.query.email,
        password: req.query.password,
      });
      if (!userByEmail) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(userByEmail);
    } else {
      // Get all users
      const users = await Users.find();
      return res.json(users);
    }
  } catch (err) {
    console.error("Error finding users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */

const usersPost = async (req, res) => {
  const { name, pin, country, birthDate, email, password } = req.body;
  const today = new Date();
  const userBirthDate = new Date(birthDate);
  const age = today.getFullYear() - userBirthDate.getFullYear();

  // Check if user is at least 18 years old
  if (age < 18) {
    return res
      .status(400)
      .json({ error: "User must be at least 18 years old" });
  }

  try {
    const newUser = new Users({
      name,
      pin,
      country,
      birthDate,
      email,
      password,
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error while saving user:", error);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Updates an user
 *
 * @param {*} req
 * @param {*} res
 */
const usersPut = async (req, res) => {
  const { name, pin, country, birthDate, email, password } = req.body;
  try {
    // Verify a valid ID
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get user by ID
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user with data
    user.name = name || user.name;
    user.pin = pin || user.pin;
    user.country = country || user.country;
    user.birthDate = birthDate || user.birthDate;
    user.email = email || user.email;
    user.password = password || user.password;

    // Save changes
    await user.save();

    // Respond with updated user
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Deletes an user
 *
 * @param {*} req
 * @param {*} res
 */

const usersDelete = async (req, res) => {
  try {
    // Check for a valid ID
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get User by ID
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await user.deleteOne();

    // Respond with 204 (No Content)
    return res.status(204).json({});
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
