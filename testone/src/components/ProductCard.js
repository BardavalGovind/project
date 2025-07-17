const ProductCard = ({ product, onBuy }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 w-80 h-[460px] flex flex-col justify-between text-center">
    <img
      src={product.thumbnail || "https://via.placeholder.com/150"}
      alt={product.title}
      className="rounded h-48 object-cover mb-4 w-full"
    />
    <h3 className="text-xl font-semibold">{product.title}</h3>
    <p className="text-sm text-gray-600">{product.description}</p>
    <p className="text-lg font-bold mt-2 mb-4">₹{product.price}</p>
    <button
      onClick={() => onBuy(product.id)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Buy Now
    </button>
  </div>
);
export default ProductCard;