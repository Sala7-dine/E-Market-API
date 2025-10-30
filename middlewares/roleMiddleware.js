// Middleware général pour autoriser certains rôles
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Rôle insuffisant" });
    }

    next();
  };
}

// Middleware spécifique pour admin uniquement
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès admin requis" });
  }
  next();
};

// Middleware pour seller ou admin
export const requireSellerOrAdmin = (req, res, next) => {
  if (!req.user || !["seller", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Accès vendeur ou admin requis" });
  }
  next();
};

// Middleware pour vérifier que l'utilisateur est propriétaire ou admin
export const requireOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;

  if (!req.user) {
    return res.status(403).json({ error: "Accès refusé" });
  }

  // Admin peut tout faire
  if (req.user.role === "admin") {
    return next();
  }

  // Utilisateur peut seulement accéder à ses propres ressources
  if (req.user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({ error: "Accès à cette ressource refusé" });
};

// Middleware pour vérifier que le seller est propriétaire du produit ou admin
export const requireProductOwnerOrAdmin = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const Product = (await import("../models/Product.js")).default;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Admin peut tout faire
    if (req.user.role === "admin") {
      return next();
    }

    // Seller peut seulement modifier ses propres produits
    if (
      req.user.role === "seller" &&
      product.createdBy.toString() === req.user._id.toString()
    ) {
      return next();
    }

    return res
      .status(403)
      .json({ error: "Vous ne pouvez modifier que vos propres produits" });
  } catch {
    return res
      .status(500)
      .json({ error: "Erreur lors de la vérification des permissions" });
  }
};
