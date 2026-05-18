import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://svgnnfppbrabfgjejabw.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Z25uZnBwYnJhYmZnamVqYWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTEwNzg2OSwiZXhwIjoyMDk0NjgzODY5fQ.R79gPenpX-Jx0tensnnuCprKl1flVk7RS9ZF5hu6iJI";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_USER_ID = "cfa3d9c5-57dc-4dbd-a99d-959a3673c9bb";

const users = [
  {
    email: "ferdousjamanmim@gmail.com",
    password: "12345678Mim",
    full_name: "Ferdous Jaman Mim",
    role: "admin",
    id: ADMIN_USER_ID, // already created
  },
  {
    email: "mim@mim.com",
    password: "1234567890987654321",
    full_name: "Mim User",
    role: "staff",
    id: null, // needs creation
  },
];

async function createOrGetUser(email, password, full_name) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (error) {
    if (error.message?.toLowerCase().includes("already")) {
      console.log(`  ↳ Auth user already exists: ${email}`);
      const { data: list } = await supabase.auth.admin.listUsers();
      const found = list?.users?.find((u) => u.email === email);
      return found?.id ?? null;
    }
    console.error(`  ✗ Auth error for ${email}:`, error.message);
    return null;
  }
  console.log(`  ✓ Auth user created: ${email} (${data.user.id})`);
  return data.user.id;
}

async function upsertProfile(id, email, full_name, role) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id, email, full_name, role, is_active: true, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    )
    .select()
    .single();
  if (error) {
    console.error(`  ✗ Profile error for ${email}:`, error.message);
    return false;
  }
  console.log(`  ✓ Profile ready — ${data.email} | role: ${data.role}`);
  return true;
}

async function main() {
  console.log("Setting up demo accounts...\n");

  for (const user of users) {
    console.log(`Processing: ${user.email}`);
    const uid = user.id ?? (await createOrGetUser(user.email, user.password, user.full_name));
    if (!uid) continue;
    await upsertProfile(uid, user.email, user.full_name, user.role);
    console.log();
  }

  console.log("✅ All demo accounts ready:\n");
  for (const u of users) {
    console.log(`   ${u.role.padEnd(7)} | ${u.email} | ${u.password}`);
  }
}

main();
