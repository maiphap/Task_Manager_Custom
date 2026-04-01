const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		return res.status(403).send({
			errMessage: 'Access denied. Admin role required.',
		});
	}
};

module.exports = { isAdmin };
