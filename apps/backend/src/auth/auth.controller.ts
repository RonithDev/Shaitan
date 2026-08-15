import { Request, Response } from "express";
import { signup,login } from "./auth.service.js";
import { generateAccessToken } from "./jwt.js";


export async function signupController(
  req: Request,
  res: Response
) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }

    const user = await signup(username, email, password);

    return res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Signup failed"
    });
  }
}

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await login(email, password);

    const accessToken = generateAccessToken(user.id);

    return res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
}