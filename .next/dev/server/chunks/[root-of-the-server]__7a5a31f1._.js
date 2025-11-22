module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const cached = global.myMongoose || {
    conn: null,
    promise: null
};
if (!global.myMongoose) {
    global.myMongoose = cached;
}
async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(uri, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/models/Expense.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ExpenseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [
            true,
            "Title is required"
        ],
        trim: true
    },
    amount: {
        type: Number,
        required: [
            true,
            "Amount is required"
        ],
        min: [
            0.01,
            "Amount must be greater than 0"
        ]
    },
    category: {
        type: String,
        required: [
            true,
            "Category is required"
        ],
        enum: [
            "Food",
            "Transport",
            "Bills",
            "Shopping",
            "Entertainment",
            "Other"
        ]
    },
    date: {
        type: Date,
        required: [
            true,
            "Date is required"
        ],
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    timestamps: true
});
// Compound index for user and date queries
ExpenseSchema.index({
    user: 1,
    date: -1
});
ExpenseSchema.index({
    user: 1,
    category: 1
});
const Expense = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Expense || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Expense", ExpenseSchema);
const __TURBOPACK__default__export__ = Expense;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/jwt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signToken",
    ()=>signToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}
}),
"[project]/lib/auth-middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateRequest",
    ()=>authenticateRequest,
    "createAuthResponse",
    ()=>createAuthResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/jwt.ts [app-route] (ecmascript)");
;
;
async function authenticateRequest(request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        const token = authHeader.substring(7);
        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        return {
            userId: decoded.userId
        };
    } catch (error) {
        return null;
    }
}
function createAuthResponse(message, status) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message
    }, {
        status
    });
}
}),
"[project]/lib/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorResponse",
    ()=>errorResponse,
    "successResponse",
    ()=>successResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
function successResponse(data, message, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        data,
        message
    }, {
        status
    });
}
function errorResponse(message, status = 400) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message
    }, {
        status
    });
}
}),
"[project]/app/api/analytics/summary/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Expense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Expense.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfMonth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfWeek$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfWeek.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfYear$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfYear.js [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(req) {
    try {
        const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateRequest"])(req);
        if (!authResult) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthResponse"])("Unauthorized", 401);
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "month";
        const now = new Date();
        const startDate = period === "week" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfWeek$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfWeek"])(now, {
            weekStartsOn: 1
        }) : period === "month" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfMonth"])(now) : period === "year" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfYear$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfYear"])(now) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfMonth"])(now);
        const userId = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Types.ObjectId(authResult.userId);
        // Aggregation pipeline for total and category breakdown
        const [totalResult, categoryResult] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Expense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
                {
                    $match: {
                        user: userId,
                        date: {
                            $gte: startDate
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Expense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
                {
                    $match: {
                        user: userId,
                        date: {
                            $gte: startDate
                        }
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        total: {
                            $sum: "$amount"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        total: -1
                    }
                }
            ])
        ]);
        const total = totalResult.length > 0 ? totalResult[0].total : 0;
        const count = totalResult.length > 0 ? totalResult[0].count : 0;
        // Find top category
        const topCategory = categoryResult.length > 0 ? {
            name: categoryResult[0]._id,
            amount: categoryResult[0].total
        } : {
            name: "N/A",
            amount: 0
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])({
            total,
            count,
            topCategory,
            categories: categoryResult.map((c)=>({
                    name: c._id,
                    value: c.total,
                    count: c.count
                }))
        });
    } catch (error) {
        console.error("Analytics summary error:", error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Internal server error", 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7a5a31f1._.js.map