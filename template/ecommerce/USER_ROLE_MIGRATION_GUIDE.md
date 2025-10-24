# User Role Migration Guide

## Current Status
Your schema is already correctly set up with the `role` attribute in the `users` table. However, you may have a separate `userRoles` table that needs to be cleaned up.

## Step-by-Step Migration Process

### 1. Check Current Database State
First, run this command to check if you have a `userRoles` table:

```bash
npx convex run migrations:checkUserRolesTable
```

### 2. Run the Migration
If the `userRoles` table exists, run the migration to move all role data to the `users` table:

```bash
npx convex run migrations:migrateUserRoles
```

This will:
- Copy all role data from `userRoles` table to the `role` attribute in `users` table
- Set any users without a role to "customer" by default
- Return a summary of how many users were updated

### 3. Delete the userRoles Table (Manual Step)
After running the migration, you need to manually delete the `userRoles` table:

1. Go to your Convex Dashboard
2. Navigate to the "Data" section
3. Find the `userRoles` table
4. Delete the entire table

### 4. Verify the Migration
After completing the above steps, verify that:
- All users have a `role` attribute set to either "customer" or "admin"
- The `userRoles` table no longer exists
- Your application still works correctly

## How the Role System Works Now

### Schema Structure
```typescript
users: defineTable({
  role: v.optional(v.union(v.literal("customer"), v.literal("admin"))), // defaults to 'customer'
})
```

### Default Role Assignment
- New users automatically get `role: "customer"` when they sign up
- The `ensureUserRole` function ensures existing users without roles get "customer" as default
- Admins can be created using the `seedMyAdmin` function

### Role-Based Access Control
- **Customer**: Can browse products, add to cart, place orders, view own orders
- **Admin**: All customer permissions + create/edit/delete products, view all orders, update order status

## Functions Available

### For Users
- `api.auth.ensureUserRole()` - Ensures user has a role (called after signup)
- `api.auth.loggedInUser()` - Gets current user with role information

### For Admins
- `api.admin.seedMyAdmin()` - Makes current user an admin
- `api.admin.assignRole(userId, role)` - Assigns role to specific user

## Testing the Migration

After migration, test these scenarios:
1. Sign up a new user → should get "customer" role automatically
2. Login as existing user → should have proper role
3. Run `api.admin.seedMyAdmin()` → should make current user admin
4. Admin functions should work (product management, order management)

## Troubleshooting

If you encounter issues:
1. Check the Convex logs for any errors during migration
2. Verify all users have a role attribute
3. Ensure the `userRoles` table is completely removed
4. Test role-based access control functions

The migration is designed to be safe and reversible - it only adds data, never removes it from the `users` table.
