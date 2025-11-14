import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';

// Afficher les produits du seller
export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const products = await Product.find({ 
            createdBy: sellerId,
            isDelete: false 
        })
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Product.countDocuments({ 
            createdBy: sellerId,
            isDelete: false 
        });

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

// Statistiques du seller
export const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // Nombre total de produits
        const totalProducts = await Product.countDocuments({ 
            createdBy: sellerId,
            isDelete: false 
        });

        // Produits en rupture de stock
        const outOfStock = await Product.countDocuments({ 
            createdBy: sellerId,
            stock: 0,
            isDelete: false 
        });

        // Commandes contenant les produits du seller
        const orderStats = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $match: {
                    'product.createdBy': new mongoose.Types.ObjectId(sellerId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $addToSet: '$_id' },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: ['$items.quantity', '$items.price'] 
                        } 
                    },
                    totalItemsSold: { $sum: '$items.quantity' }
                }
            }
        ]);

        const stats = orderStats[0] || { 
            totalOrders: [], 
            totalRevenue: 0, 
            totalItemsSold: 0 
        };

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                outOfStock,
                totalOrders: stats.totalOrders.length,
                totalRevenue: stats.totalRevenue,
                totalItemsSold: stats.totalItemsSold
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

// Commandes contenant les produits du seller
export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { page = 1, limit = 10, status } = req.query;

        const matchStage = {
            'product.createdBy': new mongoose.Types.ObjectId(sellerId)
        };

        if (status) {
            matchStage.status = status;
        }

        const orders = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    user: { $first: { fullName: '$user.fullName', email: '$user.email' } },
                    status: { $first: '$status' },
                    createdAt: { $first: '$createdAt' },
                    items: {
                        $push: {
                            productId: '$items.productId',
                            productName: '$product.title',
                            quantity: '$items.quantity',
                            price: '$items.price',
                            total: { $multiply: ['$items.quantity', '$items.price'] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    orderTotal: { $sum: '$items.total' }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        // Compter le total pour la pagination
        const totalCount = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: '$_id'
                }
            },
            {
                $count: 'total'
            }
        ]);

        const total = totalCount[0]?.total || 0;

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalOrders: total
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
};