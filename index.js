import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("=== FULL DATABASE CRUD START ===");

    // CLEANUP FIRST (order matters)
    await prisma.IMPERSONATION_SESSION.deleteMany();
    await prisma.AUDIT_LOG.deleteMany();
    await prisma.REPORT.deleteMany();
    await prisma.DOCUMENT_METADATA.deleteMany();
    await prisma.NOTIFICATION.deleteMany();
    await prisma.STATEMENT.deleteMany();
    await prisma.ACCOUNT.deleteMany();
    await prisma.CUSTOMER.deleteMany();
    await prisma.ADMIN.deleteMany();
    await prisma.USER.deleteMany();
    await prisma.CLIENT.deleteMany();

    // CLIENT
    const client = await prisma.CLIENT.create({
        data: {
            client_name: "Demo Corp",
            contact_phone: "555-9999",
            contact_email: "contact@demo.com",
            number_of_users: 5
        }
    });
    console.log("CLIENT CREATED:", client);

    // USER
    const user = await prisma.USER.create({
        data: {
            username: "demo_user",
            password_hash: "hash",
            email: "demo@test.com",
            first_name: "Demo",
            last_name: "User",
            phone_number: "555-0000",
            last_login_date: new Date()
        }
    });
    console.log("USER CREATED:", user);

    // CUSTOMER
    const customer = await prisma.CUSTOMER.create({
        data: {
            ssn: "111-22-3333",
            dob: new Date("1999-01-01"),
            delivery_preference: "Electronic",
            user_id: user.user_id
        }
    });
    console.log("CUSTOMER CREATED:", customer);

    // ADMIN
    const admin = await prisma.ADMIN.create({
        data: {
            user_id: user.user_id,
            client_id: client.client_id
        }
    });
    console.log("ADMIN CREATED:", admin);

    // IMPERSONATION_SESSION — sample sessions (admin impersonating customer)
    const imp1 = await prisma.IMPERSONATION_SESSION.create({
        data: {
            admin_id: admin.admin_id,
            customer_id: customer.customer_id,
            ip_address: "192.168.1.10",
            reason: "Customer requested help with delivery preference",
            is_active: 0,
            ended_at: new Date()
        }
    });
    const imp2 = await prisma.IMPERSONATION_SESSION.create({
        data: {
            admin_id: admin.admin_id,
            customer_id: customer.customer_id,
            ip_address: "10.0.0.5",
            reason: "Support ticket #4421",
            is_active: 1
        }
    });
    const imp3 = await prisma.IMPERSONATION_SESSION.create({
        data: {
            admin_id: admin.admin_id,
            customer_id: customer.customer_id,
            ip_address: "172.16.0.1",
            reason: null,
            is_active: 1
        }
    });
    console.log("IMPERSONATION_SESSION CREATED:", { imp1, imp2, imp3 });

    // ACCOUNT
    const account = await prisma.ACCOUNT.create({
        data: {
            account_number: "ACC500",
            account_type: "Checking",
            is_active: 1,
            customer_id: customer.customer_id,
            client_id: client.client_id
        }
    });
    console.log("ACCOUNT CREATED:", account);

    // STATEMENT
    const statement = await prisma.STATEMENT.create({
        data: {
            statement_period: "Feb 2026",
            file_size: 2000,
            page_count: 2,
            document_type: "PDF",
            retention_days: 90,
            pdf_path: "/docs/feb.pdf",
            account_id: account.account_id,
            uploaded_by_admin_id: admin.admin_id,
            checksum: "xyz789abc",
            posted_date: new Date()
        }
    });
    console.log("STATEMENT CREATED:", statement);

    // DOCUMENT METADATA
    const docMeta = await prisma.DOCUMENT_METADATA.create({
        data: {
            upload_date: new Date(),
            document_type: "PDF",
            retention_period: 90,
            statement_id: statement.statement_id
        }
    });
    console.log("DOCUMENT METADATA CREATED:", docMeta);

    // NOTIFICATION
    const notification = await prisma.NOTIFICATION.create({
        data: {
            subject: "Statement Ready",
            message: "Your statement is available",
            sent_date: new Date(),
            is_read: 0,
            priority: "High",
            user_id: user.user_id
        }
    });
    console.log("NOTIFICATION CREATED:", notification);

    // REPORT
    const report = await prisma.REPORT.create({
        data: {
            type: "Monthly",
            generated_date: new Date(),
            admin_id: admin.admin_id
        }
    });
    console.log("REPORT CREATED:", report);

    // AUDIT LOG
    const auditLog = await prisma.AUDIT_LOG.create({
        data: {
            action: "CREATE",
            entity_type: "ACCOUNT",
            entity_id: Number(account.account_id),
            timestamp: new Date(),
            ip_address: "127.0.0.1",
            details: "Account created",
            user_id: user.user_id,
            admin_id: admin.admin_id
        }
    });
    console.log("AUDIT LOG CREATED:", auditLog);

    // READ
    const allUsers = await prisma.USER.findMany({
        include: {
            CUSTOMER: true,
            ADMIN: true
        }
    });

    console.log("READ USERS:", allUsers);

    // UPDATE
    const updatedAccount = await prisma.ACCOUNT.update({
        where: { account_id: account.account_id },
        data: { account_type: "Savings" }
    });

    console.log("ACCOUNT UPDATED TO SAVINGS:", updatedAccount);

    // DELETE EVERYTHING
    
   /* const deleteAuditLog = await prisma.AUDIT_LOG.deleteMany();
    const deleteReport = await prisma.REPORT.deleteMany();
    const deleteDocMeta = await prisma.DOCUMENT_METADATA.deleteMany();
    const deleteNotif = await prisma.NOTIFICATION.deleteMany();
    const deleteStmt = await prisma.STATEMENT.deleteMany();
    const deleteAcct = await prisma.ACCOUNT.deleteMany();
    const deleteCust = await prisma.CUSTOMER.deleteMany();
    const deleteAdmin = await prisma.ADMIN.deleteMany();
    const deleteUser = await prisma.USER.deleteMany();

    console.log("DELETE RESULTS:", { deleteAuditLog, deleteReport, deleteDocMeta, deleteNotif, deleteStmt, deleteAcct, deleteCust, deleteAdmin, deleteUser });
*/
    console.log("=== FULL CRUD COMPLETE ===");
}

main()
    .catch(console.error)
    .finally(async () => prisma.$disconnect());
