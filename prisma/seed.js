"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
var adapter = new adapter_pg_1.PrismaPg(pool);
var prisma = new client_1.PrismaClient({ adapter: adapter });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminEmail, adminPwd, existingAdmin, hashed, blogs, _i, blogs_1, blog;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    adminEmail = (_a = process.env.ADMIN_EMAIL) !== null && _a !== void 0 ? _a : 'admin@cushionguru.com';
                    adminPwd = (_b = process.env.ADMIN_PASSWORD) !== null && _b !== void 0 ? _b : 'Admin@123';
                    return [4 /*yield*/, prisma.user.findUnique({ where: { email: adminEmail } })];
                case 1:
                    existingAdmin = _c.sent();
                    if (!!existingAdmin) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcryptjs_1.default.hash(adminPwd, 12)];
                case 2:
                    hashed = _c.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: { name: 'CushionGuru Admin', email: adminEmail, password: hashed, role: 'ADMIN' },
                        })];
                case 3:
                    _c.sent();
                    console.log("\u2705 Admin user created: ".concat(adminEmail));
                    return [3 /*break*/, 5];
                case 4:
                    console.log("\u2139\uFE0F  Admin user already exists: ".concat(adminEmail));
                    _c.label = 5;
                case 5:
                    blogs = [
                        { slug: 'outdoor-cushion-care-tips', title: 'Top 10 Outdoor Cushion Care Tips for Longevity', excerpt: 'Learn how to extend the life of your outdoor cushion covers with these expert care tips.', content: 'Full article content here...', imageUrl: null },
                        { slug: 'sunbrella-fabric-guide', title: 'The Complete Guide to Sunbrella® Fabrics', excerpt: 'Discover why Sunbrella® fabrics are the gold standard for performance textiles.', content: 'Full article content here...', imageUrl: null },
                        { slug: 'custom-rv-cushions-guide', title: 'How to Choose Perfect RV Cushions for Your Adventure', excerpt: 'Your RV deserves cushions as adventurous as you are.', content: 'Full article content here...', imageUrl: null },
                    ];
                    _i = 0, blogs_1 = blogs;
                    _c.label = 6;
                case 6:
                    if (!(_i < blogs_1.length)) return [3 /*break*/, 9];
                    blog = blogs_1[_i];
                    return [4 /*yield*/, prisma.blogPost.upsert({
                            where: { slug: blog.slug },
                            update: {},
                            create: blog,
                        })];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log('✅ Blog posts seeded');
                    console.log('🎉 Seeding complete!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (err) { console.error(err); process.exit(1); })
    .finally(function () { return prisma.$disconnect(); });
