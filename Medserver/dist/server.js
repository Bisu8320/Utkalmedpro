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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const celebrate_1 = require("celebrate");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const config_1 = require("./configs/config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const bookingings_routes_1 = __importDefault(require("./routes/bookingings.routes"));
const app = (0, express_1.default)();
const PORT = 8080;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(auth_middleware_1.authAndAttachUser);
(0, auth_routes_1.default)(app);
(0, bookingings_routes_1.default)(app);
app.use((0, celebrate_1.errors)());
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.connectDb)();
    console.log(`🚀  Server is running on port ${PORT}`);
}));
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.Configs.MONGODB_URL);
        console.log('✅ DB connected');
    }
    catch (error) {
        console.error('❌ DB connection error:', error);
        process.exit(1);
    }
});
exports.connectDb = connectDb;
