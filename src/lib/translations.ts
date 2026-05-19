export type Language = "en" | "bn";

export type TranslationKey =
  // ── Common / Shared ──────────────────────────────────────────────
  | "common.save" | "common.cancel" | "common.delete" | "common.edit"
  | "common.search" | "common.loading" | "common.submit" | "common.close"
  | "common.back" | "common.next" | "common.view" | "common.create"
  | "common.export" | "common.import" | "common.filter" | "common.reset"
  | "common.yes" | "common.no" | "common.confirm" | "common.success"
  | "common.error" | "common.warning" | "common.noData" | "common.all"
  | "common.total" | "common.status" | "common.actions" | "common.details"
  | "common.email" | "common.password" | "common.name" | "common.phone"
  | "common.address" | "common.date" | "common.price" | "common.quantity"
  | "common.description" | "common.category" | "common.manage" | "common.add"
  | "common.remove" | "common.update" | "common.signOut" | "common.profile" | "common.refresh"
  | "common.settings" | "common.dashboard" | "common.home" | "common.shop"
  | "common.active" | "common.inactive" | "common.pending" | "common.completed"
  | "common.processing" | "common.cancelled" | "common.refunded"
  | "common.language" | "common.english" | "common.bangla"

  // ── Navigation / Sidebar ─────────────────────────────────────────
  | "nav.dashboard" | "nav.products" | "nav.categories" | "nav.banners"
  | "nav.orders" | "nav.customers" | "nav.inventory" | "nav.analytics"
  | "nav.fraudCheck" | "nav.settings" | "nav.staffMgmt" | "nav.payroll"
  | "nav.management"

  // ── Navbar ───────────────────────────────────────────────────────
  | "navbar.searchPlaceholder" | "navbar.notifications"
  | "navbar.myProfile" | "navbar.myWork" | "navbar.shiftSchedule"
  | "navbar.ordersQueue" | "navbar.adminControls" | "navbar.staffManagement"
  | "navbar.revenuReports" | "navbar.storeSettings" | "navbar.signOut"

  // ── Auth pages ────────────────────────────────────────────────────
  | "auth.login" | "auth.signup" | "auth.logout" | "auth.email"
  | "auth.password" | "auth.confirmPassword" | "auth.fullName"
  | "auth.forgotPassword" | "auth.noAccount" | "auth.hasAccount"
  | "auth.loginTitle" | "auth.loginSubtitle" | "auth.signupTitle"
  | "auth.signupSubtitle" | "auth.orContinueWith" | "auth.agreeToTerms"

  // ── Dashboard Page ────────────────────────────────────────────────
  | "dashboard.greeting.morning" | "dashboard.greeting.afternoon"
  | "dashboard.greeting.evening" | "dashboard.totalRevenue"
  | "dashboard.totalOrders" | "dashboard.activeCustomers"
  | "dashboard.avgOrderValue" | "dashboard.vsLastMonth"
  | "dashboard.revenueOverview" | "dashboard.monthly" | "dashboard.weekly"
  | "dashboard.orderStatus" | "dashboard.topProducts" | "dashboard.recentOrders"
  | "dashboard.activityFeed" | "dashboard.inventoryAlerts" | "dashboard.viewAll"
  | "dashboard.quickActions" | "dashboard.newProduct" | "dashboard.newOrder"
  | "dashboard.customerGrowth" | "dashboard.lowStock" | "dashboard.outOfStock"

  // ── Products ──────────────────────────────────────────────────────
  | "products.title" | "products.addProduct" | "products.editProduct"
  | "products.productName" | "products.sku" | "products.stockLevel"
  | "products.inStock" | "products.outOfStock" | "products.lowStock"
  | "products.price" | "products.comparePrice" | "products.images"
  | "products.noProducts"
  | "products.searchPlaceholder" | "products.allStatuses" | "products.allCategories"
  | "products.active" | "products.draft" | "products.archived"
  | "products.category" | "products.stock" | "products.deleteConfirm"
  | "products.deleteTitle"

  // ── Orders ────────────────────────────────────────────────────────
  | "orders.title" | "orders.orderId" | "orders.customer" | "orders.amount"
  | "orders.orderDate" | "orders.deliveryDate" | "orders.paymentMethod"
  | "orders.shippingAddress" | "orders.orderItems" | "orders.orderHistory"
  | "orders.noOrders" | "orders.updateStatus"
  | "orders.order" | "orders.status" | "orders.payment" | "orders.searchPlaceholder"
  | "orders.allStatuses" | "orders.allPayments"
  | "orders.pending" | "orders.processing" | "orders.shipped" | "orders.delivered"
  | "orders.cancelled" | "orders.refunded" | "orders.paid" | "orders.unpaid" | "orders.failed"

  // ── Customers ─────────────────────────────────────────────────────
  | "customers.title" | "customers.addCustomer" | "customers.totalOrders"
  | "customers.totalSpent" | "customers.joinDate" | "customers.noCustomers"

  // ── Inventory ─────────────────────────────────────────────────────
  | "inventory.title" | "inventory.adjust" | "inventory.threshold"
  | "inventory.currentStock" | "inventory.reserved" | "inventory.available"
  | "inventory.warehouseLocation"

  // ── Analytics ─────────────────────────────────────────────────────
  | "analytics.title" | "analytics.revenue" | "analytics.orders"
  | "analytics.customers" | "analytics.conversionRate" | "analytics.period"

  // ── Settings ─────────────────────────────────────────────────────
  | "settings.title" | "settings.profile" | "settings.appearance"
  | "settings.notifications" | "settings.security" | "settings.store"
  | "settings.myWork" | "settings.displayMode" | "settings.colorTheme"
  | "settings.light" | "settings.dark" | "settings.system"
  | "settings.changePassword" | "settings.currentPassword"
  | "settings.newPassword" | "settings.confirmNewPassword"
  | "settings.saveChanges" | "settings.dangerZone"

  // ── Shop / Landing ────────────────────────────────────────────────
  | "shop.title" | "shop.allProducts" | "shop.searchProducts"
  | "shop.sortBy" | "shop.newest" | "shop.priceLowHigh" | "shop.priceHighLow"
  | "shop.nameAZ" | "shop.addToCart" | "shop.buyNow" | "shop.addedToCart"
  | "shop.addedToWishlist" | "shop.removedFromWishlist" | "shop.noProducts"
  | "shop.categories" | "shop.freeShipping" | "shop.freeShippingDesc"
  | "shop.securePayment" | "shop.securePaymentDesc" | "shop.support247"
  | "shop.support247Desc" | "shop.easyReturns" | "shop.easyReturnsDesc"
  | "shop.trending" | "shop.featuredCategories" | "shop.viewAll"
  | "shop.inStock" | "shop.outOfStock"

  // ── Staff Management (Admin) ──────────────────────────────────────
  | "staff.title" | "staff.inviteStaff" | "staff.totalStaff"
  | "staff.active" | "staff.frozen" | "staff.onLeave" | "staff.terminated"
  | "staff.freeze" | "staff.unfreeze" | "staff.resetPassword"
  | "staff.terminate" | "staff.viewProfile" | "staff.editDetails"
  | "staff.department" | "staff.shift" | "staff.performance"
  | "staff.ordersHandled" | "staff.joinDate" | "staff.lastActive"
  | "staff.sendInvitation"

  // ── Salary / Payroll ──────────────────────────────────────────────
  | "salary.title" | "salary.processPayroll" | "salary.baseSalary"
  | "salary.bonus" | "salary.deduction" | "salary.netSalary"
  | "salary.markPaid" | "salary.paid" | "salary.paymentHistory"
  | "salary.salaryStructure" | "salary.gradeStructure" | "salary.bonusRules"
  | "salary.currentMonth"

  // ── Fraud Check ───────────────────────────────────────────────────
  | "fraud.title" | "fraud.flagged" | "fraud.duplicateOrders"
  | "fraud.manualCheck" | "fraud.customerRisk" | "fraud.checkNow"
  | "fraud.riskLevel" | "fraud.low" | "fraud.medium" | "fraud.high"

  // ── Notifications / toasts ────────────────────────────────────────
  | "toast.signedOut" | "toast.savedSuccess" | "toast.inviteSent"

  // ── Account (Customer) ───────────────────────────────────────────
  | "account.wishlist" | "account.addresses" | "account.paymentMethods";

// ─────────────────────────────────────────────────────────────────────────────
// English
// ─────────────────────────────────────────────────────────────────────────────
const en: Record<TranslationKey, string> = {
  // Common
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.search": "Search",
  "common.loading": "Loading…",
  "common.submit": "Submit",
  "common.close": "Close",
  "common.back": "Back",
  "common.next": "Next",
  "common.view": "View",
  "common.create": "Create",
  "common.export": "Export",
  "common.import": "Import",
  "common.filter": "Filter",
  "common.reset": "Reset",
  "common.yes": "Yes",
  "common.no": "No",
  "common.confirm": "Confirm",
  "common.success": "Success",
  "common.error": "Error",
  "common.warning": "Warning",
  "common.noData": "No data available",
  "common.all": "All",
  "common.total": "Total",
  "common.status": "Status",
  "common.actions": "Actions",
  "common.details": "Details",
  "common.email": "Email",
  "common.password": "Password",
  "common.name": "Name",
  "common.phone": "Phone",
  "common.address": "Address",
  "common.date": "Date",
  "common.price": "Price",
  "common.quantity": "Quantity",
  "common.description": "Description",
  "common.category": "Category",
  "common.manage": "Manage",
  "common.add": "Add",
  "common.remove": "Remove",
  "common.update": "Update",
  "common.signOut": "Sign out",
  "common.refresh": "Refresh",
  "common.profile": "Profile",
  "common.settings": "Settings",
  "common.dashboard": "Dashboard",
  "common.home": "Home",
  "common.shop": "Shop",
  "common.active": "Active",
  "common.inactive": "Inactive",
  "common.pending": "Pending",
  "common.completed": "Completed",
  "common.processing": "Processing",
  "common.cancelled": "Cancelled",
  "common.refunded": "Refunded",
  "common.language": "Language",
  "common.english": "English",
  "common.bangla": "বাংলা",

  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.products": "Products",
  "nav.categories": "Categories",
  "nav.banners": "Banners",
  "nav.orders": "Orders",
  "nav.customers": "Customers",
  "nav.inventory": "Inventory",
  "nav.analytics": "Analytics",
  "nav.fraudCheck": "Fraud Check",
  "nav.settings": "Settings",
  "nav.staffMgmt": "Staff Mgmt",
  "nav.payroll": "Payroll",
  "nav.management": "Management",

  // Navbar
  "navbar.searchPlaceholder": "Search anything…",
  "navbar.notifications": "Notifications",
  "navbar.myProfile": "My Profile",
  "navbar.myWork": "My Work",
  "navbar.shiftSchedule": "Shift & Schedule",
  "navbar.ordersQueue": "My Orders Queue",
  "navbar.adminControls": "Admin Controls",
  "navbar.staffManagement": "Staff Management",
  "navbar.revenuReports": "Revenue Reports",
  "navbar.storeSettings": "Store Settings",
  "navbar.signOut": "Sign out",

  // Auth
  "auth.login": "Sign In",
  "auth.signup": "Sign Up",
  "auth.logout": "Sign Out",
  "auth.email": "Email address",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm password",
  "auth.fullName": "Full name",
  "auth.forgotPassword": "Forgot password?",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.loginTitle": "Welcome back",
  "auth.loginSubtitle": "Sign in to your ElyXen account",
  "auth.signupTitle": "Create an account",
  "auth.signupSubtitle": "Join ElyXen today",
  "auth.orContinueWith": "Or continue with",
  "auth.agreeToTerms": "By signing up you agree to our Terms & Privacy Policy",

  // Dashboard
  "dashboard.greeting.morning": "Good morning",
  "dashboard.greeting.afternoon": "Good afternoon",
  "dashboard.greeting.evening": "Good evening",
  "dashboard.totalRevenue": "Total Revenue",
  "dashboard.totalOrders": "Total Orders",
  "dashboard.activeCustomers": "Active Customers",
  "dashboard.avgOrderValue": "Avg. Order Value",
  "dashboard.vsLastMonth": "vs last month",
  "dashboard.revenueOverview": "Revenue Overview",
  "dashboard.monthly": "Monthly",
  "dashboard.weekly": "Weekly",
  "dashboard.orderStatus": "Order Status",
  "dashboard.topProducts": "Top Products",
  "dashboard.recentOrders": "Recent Orders",
  "dashboard.activityFeed": "Activity Feed",
  "dashboard.inventoryAlerts": "Inventory Alerts",
  "dashboard.viewAll": "View all",
  "dashboard.quickActions": "Quick Actions",
  "dashboard.newProduct": "New Product",
  "dashboard.newOrder": "New Order",
  "dashboard.customerGrowth": "Customer Growth",
  "dashboard.lowStock": "Low Stock",
  "dashboard.outOfStock": "Out of Stock",

  // Products
  "products.title": "Products",
  "products.addProduct": "Add Product",
  "products.editProduct": "Edit Product",
  "products.productName": "Product Name",
  "products.sku": "SKU",
  "products.stockLevel": "Stock Level",
  "products.inStock": "In Stock",
  "products.outOfStock": "Out of Stock",
  "products.lowStock": "Low Stock",
  "products.price": "Price",
  "products.comparePrice": "Compare Price",
  "products.images": "Images",
  "products.noProducts": "No products found",
  "products.searchPlaceholder": "Search products...",
  "products.allStatuses": "All Status",
  "products.allCategories": "All Categories",
  "products.active": "Active",
  "products.draft": "Draft",
  "products.archived": "Archived",
  "products.category": "Category",
  "products.stock": "Stock",
  "products.deleteTitle": "Delete Product",
  "products.deleteConfirm": "This action cannot be undone.",

  // Orders
  "orders.title": "Orders",
  "orders.orderId": "Order ID",
  "orders.customer": "Customer",
  "orders.amount": "Amount",
  "orders.orderDate": "Order Date",
  "orders.deliveryDate": "Delivery Date",
  "orders.paymentMethod": "Payment Method",
  "orders.shippingAddress": "Shipping Address",
  "orders.orderItems": "Order Items",
  "orders.orderHistory": "Order History",
  "orders.noOrders": "No orders found",
  "orders.updateStatus": "Update Status",
  "orders.order": "Order",
  "orders.status": "Status",
  "orders.payment": "Payment",
  "orders.searchPlaceholder": "Search by order number...",
  "orders.allStatuses": "All Status",
  "orders.allPayments": "All Payments",
  "orders.pending": "Pending",
  "orders.processing": "Processing",
  "orders.shipped": "Shipped",
  "orders.delivered": "Delivered",
  "orders.cancelled": "Cancelled",
  "orders.refunded": "Refunded",
  "orders.paid": "Paid",
  "orders.unpaid": "Unpaid",
  "orders.failed": "Failed",

  // Customers
  "customers.title": "Customers",
  "customers.addCustomer": "Add Customer",
  "customers.totalOrders": "Total Orders",
  "customers.totalSpent": "Total Spent",
  "customers.joinDate": "Join Date",
  "customers.noCustomers": "No customers found",

  // Inventory
  "inventory.title": "Inventory",
  "inventory.adjust": "Adjust",
  "inventory.threshold": "Alert Threshold",
  "inventory.currentStock": "Current Stock",
  "inventory.reserved": "Reserved",
  "inventory.available": "Available",
  "inventory.warehouseLocation": "Location",

  // Analytics
  "analytics.title": "Analytics",
  "analytics.revenue": "Revenue",
  "analytics.orders": "Orders",
  "analytics.customers": "Customers",
  "analytics.conversionRate": "Conversion Rate",
  "analytics.period": "Period",

  // Settings
  "settings.title": "Settings",
  "settings.profile": "Profile",
  "settings.appearance": "Appearance",
  "settings.notifications": "Notifications",
  "settings.security": "Security",
  "settings.store": "Store",
  "settings.myWork": "My Work",
  "settings.displayMode": "Display Mode",
  "settings.colorTheme": "Color Theme",
  "settings.light": "Light",
  "settings.dark": "Dark",
  "settings.system": "System",
  "settings.changePassword": "Change Password",
  "settings.currentPassword": "Current password",
  "settings.newPassword": "New password",
  "settings.confirmNewPassword": "Confirm new password",
  "settings.saveChanges": "Save Changes",
  "settings.dangerZone": "Danger Zone",

  // Shop
  "shop.title": "Shop",
  "shop.allProducts": "All Products",
  "shop.searchProducts": "Search products…",
  "shop.sortBy": "Sort by",
  "shop.newest": "Newest",
  "shop.priceLowHigh": "Price: Low to High",
  "shop.priceHighLow": "Price: High to Low",
  "shop.nameAZ": "Name: A–Z",
  "shop.addToCart": "Cart",
  "shop.buyNow": "Buy Now",
  "shop.addedToCart": "Added to cart!",
  "shop.addedToWishlist": "Added to wishlist!",
  "shop.removedFromWishlist": "Removed from wishlist",
  "shop.noProducts": "No products found",
  "shop.categories": "Categories",
  "shop.freeShipping": "Free Shipping",
  "shop.freeShippingDesc": "On orders over ৳999",
  "shop.securePayment": "Secure Payment",
  "shop.securePaymentDesc": "100% safe & encrypted",
  "shop.support247": "24/7 Support",
  "shop.support247Desc": "Always here to help",
  "shop.easyReturns": "Easy Returns",
  "shop.easyReturnsDesc": "7-day hassle-free return",
  "shop.trending": "Trending Now",
  "shop.featuredCategories": "Shop by Category",
  "shop.viewAll": "View All",
  "shop.inStock": "In Stock",
  "shop.outOfStock": "Out of Stock",

  // Staff
  "staff.title": "Staff Management",
  "staff.inviteStaff": "Invite Staff",
  "staff.totalStaff": "Total Staff",
  "staff.active": "Active",
  "staff.frozen": "Frozen",
  "staff.onLeave": "On Leave",
  "staff.terminated": "Terminated",
  "staff.freeze": "Freeze Account",
  "staff.unfreeze": "Unfreeze Account",
  "staff.resetPassword": "Reset Password",
  "staff.terminate": "Terminate",
  "staff.viewProfile": "View Profile",
  "staff.editDetails": "Edit Details",
  "staff.department": "Department",
  "staff.shift": "Shift",
  "staff.performance": "Performance",
  "staff.ordersHandled": "Orders Handled",
  "staff.joinDate": "Joined",
  "staff.lastActive": "Last Active",
  "staff.sendInvitation": "Send Invitation",

  // Salary
  "salary.title": "Payroll & Salary",
  "salary.processPayroll": "Process Payroll",
  "salary.baseSalary": "Base Salary",
  "salary.bonus": "Bonus",
  "salary.deduction": "Deduction",
  "salary.netSalary": "Net",
  "salary.markPaid": "Mark Paid",
  "salary.paid": "Paid",
  "salary.paymentHistory": "Payment History",
  "salary.salaryStructure": "Salary Structure",
  "salary.gradeStructure": "Grade Structure",
  "salary.bonusRules": "Bonus & Deduction Rules",
  "salary.currentMonth": "Current Month",

  // Fraud
  "fraud.title": "Fraud Check",
  "fraud.flagged": "Fraud Flags",
  "fraud.duplicateOrders": "Duplicate Orders",
  "fraud.manualCheck": "Manual Check",
  "fraud.customerRisk": "Customer Risk",
  "fraud.checkNow": "Check Now",
  "fraud.riskLevel": "Risk Level",
  "fraud.low": "Low",
  "fraud.medium": "Medium",
  "fraud.high": "High",

  // Toasts
  "toast.signedOut": "Signed out successfully.",
  "toast.savedSuccess": "Changes saved successfully",
  "toast.inviteSent": "Invitation sent!",

  // Account
  "account.wishlist": "Wishlist",
  "account.addresses": "Saved Addresses",
  "account.paymentMethods": "Payment Methods",
};

// ─────────────────────────────────────────────────────────────────────────────
// বাংলা (Bengali)
// ─────────────────────────────────────────────────────────────────────────────
const bn: Record<TranslationKey, string> = {
  // Common
  "common.save": "সংরক্ষণ করুন",
  "common.cancel": "বাতিল",
  "common.delete": "মুছুন",
  "common.edit": "সম্পাদনা",
  "common.search": "অনুসন্ধান",
  "common.loading": "লোড হচ্ছে…",
  "common.submit": "জমা দিন",
  "common.close": "বন্ধ করুন",
  "common.back": "পেছনে",
  "common.next": "পরবর্তী",
  "common.view": "দেখুন",
  "common.create": "তৈরি করুন",
  "common.export": "রপ্তানি",
  "common.import": "আমদানি",
  "common.filter": "ফিল্টার",
  "common.reset": "রিসেট",
  "common.yes": "হ্যাঁ",
  "common.no": "না",
  "common.confirm": "নিশ্চিত করুন",
  "common.success": "সফল",
  "common.error": "ত্রুটি",
  "common.warning": "সতর্কতা",
  "common.noData": "কোনো তথ্য নেই",
  "common.all": "সব",
  "common.total": "মোট",
  "common.status": "অবস্থা",
  "common.actions": "কার্যক্রম",
  "common.details": "বিবরণ",
  "common.email": "ইমেইল",
  "common.password": "পাসওয়ার্ড",
  "common.name": "নাম",
  "common.phone": "ফোন",
  "common.address": "ঠিকানা",
  "common.date": "তারিখ",
  "common.price": "মূল্য",
  "common.quantity": "পরিমাণ",
  "common.description": "বিবরণ",
  "common.category": "বিভাগ",
  "common.manage": "পরিচালনা",
  "common.add": "যোগ করুন",
  "common.remove": "সরান",
  "common.update": "আপডেট",
  "common.signOut": "সাইন আউট",
  "common.refresh": "রিফ্রেশ",
  "common.profile": "প্রোফাইল",
  "common.settings": "সেটিংস",
  "common.dashboard": "ড্যাশবোর্ড",
  "common.home": "হোম",
  "common.shop": "শপ",
  "common.active": "সক্রিয়",
  "common.inactive": "নিষ্ক্রিয়",
  "common.pending": "অপেক্ষমাণ",
  "common.completed": "সম্পন্ন",
  "common.processing": "প্রক্রিয়াধীন",
  "common.cancelled": "বাতিল",
  "common.refunded": "ফেরত",
  "common.language": "ভাষা",
  "common.english": "English",
  "common.bangla": "বাংলা",

  // Navigation
  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.products": "পণ্য",
  "nav.categories": "বিভাগ",
  "nav.banners": "ব্যানার",
  "nav.orders": "অর্ডার",
  "nav.customers": "গ্রাহক",
  "nav.inventory": "ইনভেন্টরি",
  "nav.analytics": "বিশ্লেষণ",
  "nav.fraudCheck": "জালিয়াতি চেক",
  "nav.settings": "সেটিংস",
  "nav.staffMgmt": "স্টাফ ব্যবস্থাপনা",
  "nav.payroll": "বেতন",
  "nav.management": "ব্যবস্থাপনা",

  // Navbar
  "navbar.searchPlaceholder": "যেকোনো কিছু খুঁজুন…",
  "navbar.notifications": "বিজ্ঞপ্তি",
  "navbar.myProfile": "আমার প্রোফাইল",
  "navbar.myWork": "আমার কাজ",
  "navbar.shiftSchedule": "শিফট ও সময়সূচি",
  "navbar.ordersQueue": "আমার অর্ডার কিউ",
  "navbar.adminControls": "অ্যাডমিন নিয়ন্ত্রণ",
  "navbar.staffManagement": "স্টাফ ব্যবস্থাপনা",
  "navbar.revenuReports": "আয়ের প্রতিবেদন",
  "navbar.storeSettings": "স্টোর সেটিংস",
  "navbar.signOut": "সাইন আউট",

  // Auth
  "auth.login": "সাইন ইন",
  "auth.signup": "সাইন আপ",
  "auth.logout": "সাইন আউট",
  "auth.email": "ইমেইল ঠিকানা",
  "auth.password": "পাসওয়ার্ড",
  "auth.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
  "auth.fullName": "পুরো নাম",
  "auth.forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
  "auth.noAccount": "অ্যাকাউন্ট নেই?",
  "auth.hasAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
  "auth.loginTitle": "স্বাগতম",
  "auth.loginSubtitle": "আপনার ElyXen অ্যাকাউন্টে সাইন ইন করুন",
  "auth.signupTitle": "অ্যাকাউন্ট তৈরি করুন",
  "auth.signupSubtitle": "আজই ElyXen-এ যোগ দিন",
  "auth.orContinueWith": "অথবা দিয়ে চালিয়ে যান",
  "auth.agreeToTerms": "সাইন আপ করে আপনি আমাদের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মতি জানাচ্ছেন",

  // Dashboard
  "dashboard.greeting.morning": "শুভ সকাল",
  "dashboard.greeting.afternoon": "শুভ অপরাহ্ন",
  "dashboard.greeting.evening": "শুভ সন্ধ্যা",
  "dashboard.totalRevenue": "মোট আয়",
  "dashboard.totalOrders": "মোট অর্ডার",
  "dashboard.activeCustomers": "সক্রিয় গ্রাহক",
  "dashboard.avgOrderValue": "গড় অর্ডার মূল্য",
  "dashboard.vsLastMonth": "গত মাসের তুলনায়",
  "dashboard.revenueOverview": "আয়ের সংক্ষিপ্ত বিবরণ",
  "dashboard.monthly": "মাসিক",
  "dashboard.weekly": "সাপ্তাহিক",
  "dashboard.orderStatus": "অর্ডারের অবস্থা",
  "dashboard.topProducts": "শীর্ষ পণ্য",
  "dashboard.recentOrders": "সাম্প্রতিক অর্ডার",
  "dashboard.activityFeed": "কার্যক্রম ফিড",
  "dashboard.inventoryAlerts": "ইনভেন্টরি সতর্কতা",
  "dashboard.viewAll": "সব দেখুন",
  "dashboard.quickActions": "দ্রুত কার্যক্রম",
  "dashboard.newProduct": "নতুন পণ্য",
  "dashboard.newOrder": "নতুন অর্ডার",
  "dashboard.customerGrowth": "গ্রাহক বৃদ্ধি",
  "dashboard.lowStock": "কম স্টক",
  "dashboard.outOfStock": "স্টক শেষ",

  // Products
  "products.title": "পণ্য",
  "products.addProduct": "পণ্য যোগ করুন",
  "products.editProduct": "পণ্য সম্পাদনা",
  "products.productName": "পণ্যের নাম",
  "products.sku": "SKU",
  "products.stockLevel": "স্টক পরিমাণ",
  "products.inStock": "স্টকে আছে",
  "products.outOfStock": "স্টক শেষ",
  "products.lowStock": "কম স্টক",
  "products.price": "মূল্য",
  "products.comparePrice": "তুলনামূলক মূল্য",
  "products.images": "ছবি",
  "products.noProducts": "কোনো পণ্য পাওয়া যায়নি",
  "products.searchPlaceholder": "পণ্য খুঁজুন...",
  "products.allStatuses": "সকল অবস্থা",
  "products.allCategories": "সকল বিভাগ",
  "products.active": "সক্রিয়",
  "products.draft": "ড্রাফ্ট",
  "products.archived": "সংরক্ষিত",
  "products.category": "বিভাগ",
  "products.stock": "স্টক",
  "products.deleteTitle": "পণ্য মুছুন",
  "products.deleteConfirm": "এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।",

  // Orders
  "orders.title": "অর্ডার",
  "orders.orderId": "অর্ডার আইডি",
  "orders.customer": "গ্রাহক",
  "orders.amount": "পরিমাণ",
  "orders.orderDate": "অর্ডারের তারিখ",
  "orders.deliveryDate": "ডেলিভারির তারিখ",
  "orders.paymentMethod": "পেমেন্ট পদ্ধতি",
  "orders.shippingAddress": "শিপিং ঠিকানা",
  "orders.orderItems": "অর্ডারের আইটেম",
  "orders.orderHistory": "অর্ডারের ইতিহাস",
  "orders.noOrders": "কোনো অর্ডার পাওয়া যায়নি",
  "orders.updateStatus": "অবস্থা আপডেট",
  "orders.order": "অর্ডার",
  "orders.status": "অবস্থা",
  "orders.payment": "পেমেন্ট",
  "orders.searchPlaceholder": "অর্ডার নম্বর দিয়ে খুঁজুন...",
  "orders.allStatuses": "সকল অবস্থা",
  "orders.allPayments": "সকল পেমেন্ট",
  "orders.pending": "অপেক্ষমান",
  "orders.processing": "প্রক্রিয়াধীন",
  "orders.shipped": "শিপ করা হয়েছে",
  "orders.delivered": "ডেলিভারি হয়েছে",
  "orders.cancelled": "বাতিল",
  "orders.refunded": "ফেরত দেওয়া",
  "orders.paid": "পরিশোধিত",
  "orders.unpaid": "অপরিশোধিত",
  "orders.failed": "ব্যর্থ",

  // Customers
  "customers.title": "গ্রাহক",
  "customers.addCustomer": "গ্রাহক যোগ করুন",
  "customers.totalOrders": "মোট অর্ডার",
  "customers.totalSpent": "মোট ব্যয়",
  "customers.joinDate": "যোগদানের তারিখ",
  "customers.noCustomers": "কোনো গ্রাহক পাওয়া যায়নি",

  // Inventory
  "inventory.title": "ইনভেন্টরি",
  "inventory.adjust": "সামঞ্জস্য করুন",
  "inventory.threshold": "সতর্কতা সীমা",
  "inventory.currentStock": "বর্তমান স্টক",
  "inventory.reserved": "সংরক্ষিত",
  "inventory.available": "উপলব্ধ",
  "inventory.warehouseLocation": "অবস্থান",

  // Analytics
  "analytics.title": "বিশ্লেষণ",
  "analytics.revenue": "আয়",
  "analytics.orders": "অর্ডার",
  "analytics.customers": "গ্রাহক",
  "analytics.conversionRate": "রূপান্তর হার",
  "analytics.period": "সময়কাল",

  // Settings
  "settings.title": "সেটিংস",
  "settings.profile": "প্রোফাইল",
  "settings.appearance": "চেহারা",
  "settings.notifications": "বিজ্ঞপ্তি",
  "settings.security": "নিরাপত্তা",
  "settings.store": "স্টোর",
  "settings.myWork": "আমার কাজ",
  "settings.displayMode": "ডিসপ্লে মোড",
  "settings.colorTheme": "রঙের থিম",
  "settings.light": "লাইট",
  "settings.dark": "ডার্ক",
  "settings.system": "সিস্টেম",
  "settings.changePassword": "পাসওয়ার্ড পরিবর্তন",
  "settings.currentPassword": "বর্তমান পাসওয়ার্ড",
  "settings.newPassword": "নতুন পাসওয়ার্ড",
  "settings.confirmNewPassword": "নতুন পাসওয়ার্ড নিশ্চিত করুন",
  "settings.saveChanges": "পরিবর্তন সংরক্ষণ করুন",
  "settings.dangerZone": "বিপজ্জনক অঞ্চল",

  // Shop
  "shop.title": "শপ",
  "shop.allProducts": "সব পণ্য",
  "shop.searchProducts": "পণ্য খুঁজুন…",
  "shop.sortBy": "সাজান",
  "shop.newest": "নতুন",
  "shop.priceLowHigh": "মূল্য: কম থেকে বেশি",
  "shop.priceHighLow": "মূল্য: বেশি থেকে কম",
  "shop.nameAZ": "নাম: A–Z",
  "shop.addToCart": "কার্ট",
  "shop.buyNow": "এখনই কিনুন",
  "shop.addedToCart": "কার্টে যোগ হয়েছে!",
  "shop.addedToWishlist": "উইশলিস্টে যোগ হয়েছে!",
  "shop.removedFromWishlist": "উইশলিস্ট থেকে সরানো হয়েছে",
  "shop.noProducts": "কোনো পণ্য পাওয়া যায়নি",
  "shop.categories": "বিভাগ",
  "shop.freeShipping": "ফ্রি ডেলিভারি",
  "shop.freeShippingDesc": "৳৯৯৯ এর উপরে অর্ডারে",
  "shop.securePayment": "নিরাপদ পেমেন্ট",
  "shop.securePaymentDesc": "১০০% নিরাপদ ও এনক্রিপ্টেড",
  "shop.support247": "২৪/৭ সাপোর্ট",
  "shop.support247Desc": "সবসময় আপনার পাশে",
  "shop.easyReturns": "সহজ রিটার্ন",
  "shop.easyReturnsDesc": "৭ দিনের ঝামেলামুক্ত রিটার্ন",
  "shop.trending": "ট্রেন্ডিং পণ্য",
  "shop.featuredCategories": "বিভাগ অনুযায়ী কিনুন",
  "shop.viewAll": "সব দেখুন",
  "shop.inStock": "স্টকে আছে",
  "shop.outOfStock": "স্টক শেষ",

  // Staff
  "staff.title": "স্টাফ ব্যবস্থাপনা",
  "staff.inviteStaff": "স্টাফ আমন্ত্রণ",
  "staff.totalStaff": "মোট স্টাফ",
  "staff.active": "সক্রিয়",
  "staff.frozen": "স্থগিত",
  "staff.onLeave": "ছুটিতে",
  "staff.terminated": "বরখাস্ত",
  "staff.freeze": "অ্যাকাউন্ট স্থগিত করুন",
  "staff.unfreeze": "অ্যাকাউন্ট চালু করুন",
  "staff.resetPassword": "পাসওয়ার্ড রিসেট",
  "staff.terminate": "বরখাস্ত করুন",
  "staff.viewProfile": "প্রোফাইল দেখুন",
  "staff.editDetails": "তথ্য সম্পাদনা",
  "staff.department": "বিভাগ",
  "staff.shift": "শিফট",
  "staff.performance": "কর্মদক্ষতা",
  "staff.ordersHandled": "পরিচালিত অর্ডার",
  "staff.joinDate": "যোগদান",
  "staff.lastActive": "শেষ সক্রিয়",
  "staff.sendInvitation": "আমন্ত্রণ পাঠান",

  // Salary
  "salary.title": "বেতন ও পে-রোল",
  "salary.processPayroll": "পে-রোল প্রক্রিয়া করুন",
  "salary.baseSalary": "মূল বেতন",
  "salary.bonus": "বোনাস",
  "salary.deduction": "কর্তন",
  "salary.netSalary": "নিট",
  "salary.markPaid": "পরিশোধিত হিসেবে চিহ্নিত করুন",
  "salary.paid": "পরিশোধিত",
  "salary.paymentHistory": "পেমেন্ট ইতিহাস",
  "salary.salaryStructure": "বেতন কাঠামো",
  "salary.gradeStructure": "গ্রেড কাঠামো",
  "salary.bonusRules": "বোনাস ও কর্তনের নিয়ম",
  "salary.currentMonth": "চলতি মাস",

  // Fraud
  "fraud.title": "জালিয়াতি চেক",
  "fraud.flagged": "চিহ্নিত জালিয়াতি",
  "fraud.duplicateOrders": "ডুপ্লিকেট অর্ডার",
  "fraud.manualCheck": "ম্যানুয়াল চেক",
  "fraud.customerRisk": "গ্রাহক ঝুঁকি",
  "fraud.checkNow": "এখনই চেক করুন",
  "fraud.riskLevel": "ঝুঁকির মাত্রা",
  "fraud.low": "কম",
  "fraud.medium": "মাঝারি",
  "fraud.high": "উচ্চ",

  // Toasts
  "toast.signedOut": "সফলভাবে সাইন আউট হয়েছেন।",
  "toast.savedSuccess": "পরিবর্তন সফলভাবে সংরক্ষণ হয়েছে",
  "toast.inviteSent": "আমন্ত্রণ পাঠানো হয়েছে!",

  // Account
  "account.wishlist": "উইশলিস্ট",
  "account.addresses": "সংরক্ষিত ঠিকানা",
  "account.paymentMethods": "পেমেন্ট পদ্ধতি",
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, bn };
