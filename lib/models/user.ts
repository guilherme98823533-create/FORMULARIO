// User model - handles all user-related database operations
import { query, queryOne, transaction } from "../database"
import bcrypt from "bcryptjs"
import { generateSlug } from "../utils"

export interface User {
  id: number
  store_name: string
  owner_name: string
  email: string
  slug: string
  whatsapp?: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  store_name: string
  owner_name: string
  email: string
  password: string
  whatsapp?: string
}

export interface UpdateUserData {
  store_name?: string
  owner_name?: string
  email?: string
  whatsapp?: string
}

// Create a new user
export async function createUser(userData: CreateUserData): Promise<User> {
  const { store_name, owner_name, email, password, whatsapp } = userData

  // Hash password
  const password_hash = await bcrypt.hash(password, 12)

  // Generate unique slug
  const baseSlug = generateSlug(store_name)
  let slug = baseSlug
  let counter = 1

  while (await getUserBySlug(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  const user = await queryOne<User>(
    `INSERT INTO users (store_name, owner_name, email, password_hash, slug, whatsapp)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, store_name, owner_name, email, slug, whatsapp, email_verified, created_at, updated_at`,
    [store_name, owner_name, email, password_hash, slug, whatsapp],
  )

  if (!user) {
    throw new Error("Failed to create user")
  }

  return user
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  return queryOne<User>(
    `SELECT id, store_name, owner_name, email, slug, whatsapp, email_verified, created_at, updated_at
     FROM users WHERE id = $1`,
    [id],
  )
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT id, store_name, owner_name, email, slug, whatsapp, email_verified, created_at, updated_at
     FROM users WHERE email = $1`,
    [email],
  )
}

// Get user by slug
export async function getUserBySlug(slug: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT id, store_name, owner_name, email, slug, whatsapp, email_verified, created_at, updated_at
     FROM users WHERE slug = $1`,
    [slug],
  )
}

// Verify user password
export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  const user = await queryOne<User & { password_hash: string }>(
    `SELECT id, store_name, owner_name, email, slug, whatsapp, email_verified, password_hash, created_at, updated_at
     FROM users WHERE email = $1`,
    [email],
  )

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return null
  }

  // Remove password_hash from returned user
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Update user
export async function updateUser(id: number, userData: UpdateUserData): Promise<User | null> {
  const fields = []
  const values = []
  let paramCount = 1

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`)
      values.push(value)
      paramCount++
    }
  })

  if (fields.length === 0) {
    return getUserById(id)
  }

  values.push(id)

  return queryOne<User>(
    `UPDATE users SET ${fields.join(", ")}
     WHERE id = $${paramCount}
     RETURNING id, store_name, owner_name, email, slug, whatsapp, email_verified, created_at, updated_at`,
    values,
  )
}

// Update user password
export async function updateUserPassword(id: number, newPassword: string): Promise<boolean> {
  const password_hash = await bcrypt.hash(newPassword, 12)

  const result = await query("UPDATE users SET password_hash = $1 WHERE id = $2", [password_hash, id])

  return result.length > 0
}

// Mark email as verified
export async function verifyUserEmail(id: number): Promise<boolean> {
  const result = await query("UPDATE users SET email_verified = true WHERE id = $1", [id])

  return result.length > 0
}

// Delete user (soft delete by deactivating)
export async function deleteUser(id: number): Promise<boolean> {
  return transaction(async (client) => {
    // Cancel subscription
    await client.query("UPDATE subscriptions SET status = $1 WHERE user_id = $2", ["cancelled", id])

    // Archive budget requests
    await client.query("UPDATE budget_requests SET status = $1 WHERE user_id = $2", ["archived", id])

    // We don't actually delete the user to maintain data integrity
    // Instead, we could add a 'deleted_at' field and set it
    // For now, just return true
    return true
  })
}
