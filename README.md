# Document Statement System - ORM Implementation

Complete CRUD implementation using **Prisma ORM** with **PostgreSQL**.

## 📋 Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** 14+ installed and running
- **npm** or **yarn** package manager

## 🚀 Setup Instructions

### Step 1: Install PostgreSQL

#### macOS (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows:
Download and install from: https://www.postgresql.org/download/windows/

### Step 2: Create Database

Connect to PostgreSQL:
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE document_statement_db;
\q
```

### Step 3: Run DDL Script

Execute the schema DDL:
```bash
psql -U postgres -d document_statement_db -f schema.ddl
```

Verify tables were created:
```bash
psql -U postgres -d document_statement_db -c "\dt"
```

### Step 4: Install Node.js Dependencies

```bash
cd orm-project
npm install
```

This will install:
- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI tools
- `dotenv` - Environment variable management

### Step 5: Configure Database Connection

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and update with your database credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/document_statement_db?schema=public"
```

Replace:
- `YOUR_PASSWORD` with your PostgreSQL password
- `localhost` with your database host if not local
- `5432` with your PostgreSQL port if different

### Step 6: Generate Prisma Client

Generate the Prisma client from your schema:
```bash
npm run db:generate
```

This creates type-safe database client based on your schema.

### Step 7: (Optional) Introspect Existing Database

If you want Prisma to generate the schema from your existing database:
```bash
npm run db:pull
```

This will update `prisma/schema.prisma` based on your database structure.

## 🎯 Running CRUD Demonstration

### Run the Complete CRUD Demo

This demonstrates all CRUD operations on the User table:

```bash
npm run test:crud
```

### What the Demo Does

The CRUD demo performs the following operations **in order**:

1. **READ** - Fetch all existing users
2. **CREATE** - Insert a new user with all fields
3. **READ** - Fetch the newly created user by ID
4. **READ** - Query users with filters (active + has phone)
5. **UPDATE** - Update single user (change name, phone, login date)
6. **UPDATE** - Batch update (update multiple users at once)
7. **READ** - Fetch user with related data (joins)
8. **READ** - Aggregation queries (count, statistics)
9. **UPDATE** - Soft delete (deactivate user)
10. **DELETE** - Hard delete (permanently remove user)
11. **READ** - Verify deletion was successful

### Expected Output

You will see:
- ✅ Step-by-step output for each operation
- 📊 SQL queries executed by Prisma (logged)
- 📋 Detailed user data before/after each operation
- ✔️ Verification that operations completed successfully

## 📁 Project Structure

```
orm-project/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── crud-demo.js           # CRUD operations demonstration
│   └── seed.js                # (Optional) Database seeding
├── .env                       # Database connection (create from .env.example)
├── .env.example               # Example environment variables
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test:crud` | Run CRUD operations demo |
| `npm run db:generate` | Generate Prisma Client from schema |
| `npm run db:push` | Push schema changes to database |
| `npm run db:pull` | Introspect database and update schema |
| `npm run db:studio` | Open Prisma Studio (visual database editor) |
| `npm run db:seed` | Seed database with sample data |

## 📸 Screenshot Instructions

### 1. Database Schema Screenshot

Show tables exist:
```bash
psql -U postgres -d document_statement_db -c "\dt"
```

Take screenshot showing all tables.

### 2. Initial Data Screenshot

Show initial data in User table:
```bash
psql -U postgres -d document_statement_db -c "SELECT user_id, username, email, first_name, last_name, is_active FROM \"User\";"
```

Take screenshot of results.

### 3. Run CRUD Demo

Execute the demo:
```bash
npm run test:crud
```

Take screenshots of:
- Complete terminal output showing all 11 steps
- SQL queries being executed (shown in logs)
- Success messages for each operation

### 4. Final Database State

Show final data after CRUD operations:
```bash
psql -U postgres -d document_statement_db -c "SELECT user_id, username, email, first_name, last_name, is_active FROM \"User\";"
```

Take screenshot showing:
- User that was created and then deleted is gone
- Other users remain in database

## 🎥 Screen Recording Guide

Record your screen while:

1. **Starting** - Show clean terminal
2. **Running** `npm run test:crud`
3. **Watching** all 11 steps execute:
   - Step 1: READ initial users
   - Step 2: CREATE new user
   - Step 3: READ user by ID
   - Step 4: READ with filters
   - Step 5: UPDATE user data
   - Step 6: UPDATE multiple users
   - Step 7: READ with relations
   - Step 8: READ aggregations
   - Step 9: Soft DELETE (deactivate)
   - Step 10: Hard DELETE (remove)
   - Step 11: Verify deletion
4. **Verifying** in database with SQL query
5. **Opening** Prisma Studio: `npm run db:studio`
6. **Showing** data in visual interface

## ✅ Verification Checklist

Before submitting, verify:

- [ ] PostgreSQL is installed and running
- [ ] Database `document_statement_db` exists
- [ ] All tables created from schema.ddl
- [ ] Sample data loaded (from DDL file)
- [ ] `.env` file configured with correct credentials
- [ ] `npm install` completed successfully
- [ ] `npm run db:generate` ran without errors
- [ ] `npm run test:crud` executes all 11 steps
- [ ] CRUD operations show ORM usage (no raw SQL in code)
- [ ] Screenshots taken of database and operations
- [ ] Screen recording shows full CRUD workflow

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Solution**: Check PostgreSQL is running and connection string in `.env` is correct.

```bash
# Check if PostgreSQL is running
pg_isready

# Try connecting manually
psql -U postgres
```

### Error: "relation does not exist"

**Solution**: Run the DDL script to create tables:

```bash
psql -U postgres -d document_statement_db -f schema.ddl
```

### Error: "MODULE_NOT_FOUND"

**Solution**: Install dependencies:

```bash
npm install
```

### Error: "Prisma Client could not locate"

**Solution**: Generate Prisma Client:

```bash
npm run db:generate
```

## 📚 Prisma ORM Features Demonstrated

### Type Safety
- TypeScript-like intellisense in JavaScript
- Auto-completion for all database operations
- Compile-time error checking

### Query Building
- Fluent API for building queries
- No SQL string concatenation
- Protection against SQL injection

### Relations
- Automatic joins using `include`
- Nested reads and writes
- Relationship traversal

### Migrations
- Schema versioning
- Safe database evolution
- Rollback capability

### Performance
- Connection pooling
- Query optimization
- Lazy loading support

## 🎓 Learning Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Examples**: https://github.com/prisma/prisma-examples
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## 📝 Notes

- All CRUD operations use Prisma ORM (no raw SQL)
- UUID primary keys generated automatically
- Timestamps managed by database defaults
- Foreign keys enforce referential integrity
- Cascade deletes configured for related data

## 🏆 Submission Checklist

For homework submission:

1. ✅ **ERD PDF** - From Visual Paradigm
2. ✅ **schema.ddl** - SQL file (already provided)
3. ✅ **ORM Code** - This entire `orm-project` folder (zip or GitHub)
4. ✅ **Database Screenshot** - Show tables exist
5. ✅ **Screen Recording** - CRUD operations running

---

**Created for**: CMSC 5613 - Object-Oriented Software Engineering  
**Assignment**: Database ERD & ORM Implementation  
**ORM**: Prisma 5.x  
**Database**: PostgreSQL 14+  
**Language**: Node.js 18+ (JavaScript ES6+)
