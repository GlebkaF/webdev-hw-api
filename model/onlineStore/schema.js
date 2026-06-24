import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    image: { type: String, required: true },
    colors: { type: [String], required: true },
    roomTypes: { type: [String], required: true },
    deliveryDays: { type: Number, required: true },
    popularity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    isSpecial: { type: Boolean, default: false },
});

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "onlineStore_users", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "onlineStore_products", required: true },
            quantity: { type: Number, default: 1 },
        },
    ],
});

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "onlineStore_users", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "onlineStore_products", required: true },
});

FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "onlineStore_users", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "onlineStore_products", required: true },
            quantity: { type: Number, required: true },
            priceAtOrder: { type: Number, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});


export const User = mongoose.models.onlineStore_users || mongoose.model("onlineStore_users", UserSchema);
export const Product = mongoose.models.onlineStore_products || mongoose.model("onlineStore_products", ProductSchema);
export const Cart = mongoose.models.onlineStore_carts || mongoose.model("onlineStore_carts", CartSchema);
export const Favorite = mongoose.models.onlineStore_favorites || mongoose.model("onlineStore_favorites", FavoriteSchema);
export const Order = mongoose.models.onlineStore_orders || mongoose.model("onlineStore_orders", OrderSchema);

