import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import type { Product } from "../types/index";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  ingredients: "",
  howToUse: "",
  inStock: "true",
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description ?? "",
      ingredients: product.ingredients?.join(", ") ?? "",
      howToUse: product.howToUse ?? "",
      inStock: String(product.inStock),
    });
    setImages([]);
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("howToUse", form.howToUse);
      formData.append("inStock", form.inStock);

      // Convert comma-separated ingredients to array
      form.ingredients.split(",").forEach((i) => {
        formData.append("ingredients", i.trim());
      });

      // Append each image file
      images.forEach((file) => {
        formData.append("images", file);
      });

      if (editing) {
        await updateProduct(editing._id, formData);
      } else {
        await createProduct(formData);
      }

      await fetchProducts();
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="uppercase tracking-widest text-neutral-400 text-sm">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <h2
          className="font-league uppercase leading-none"
          style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
        >
          Products
        </h2>
        <button
          onClick={openCreate}
          className="bg-neutral-900 text-white px-6 py-3 uppercase tracking-widest text-sm hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200">
            <tr>
              {[
                "Image",
                "Name",
                "Category",
                "Price",
                "In Stock",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-4 uppercase tracking-widest text-xs text-neutral-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-neutral-100 hover:bg-neutral-300"
              >
                <td className="px-6 py-4">
                  <img
                    src={product.images?.[0] ?? "/placeholder.jpg"}
                    alt={product.name}
                    className="w-12 h-14 object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4 capitalize text-neutral-500">
                  {product.category}
                </td>
                <td className="px-6 py-4">₦{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`uppercase tracking-widest text-xs px-3 py-1 ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => openEdit(product)}
                      className="uppercase tracking-widest text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="uppercase tracking-widest text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-league uppercase text-2xl leading-none">
                {editing ? "Edit Product" : "New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-900 text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {error && (
              <p className="text-error text-sm uppercase tracking-widest mb-6">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-5">
              {[
                { label: "Name", key: "name", placeholder: "Midnight Oud" },
                {
                  label: "Category",
                  key: "category",
                  placeholder: "fragrance",
                },
                { label: "Price", key: "price", placeholder: "120" },
                {
                  label: "Description",
                  key: "description",
                  placeholder: "A rich dark oud...",
                },
                {
                  label: "Ingredients (comma separated)",
                  key: "ingredients",
                  placeholder: "Oud Wood, Amber, Sandalwood",
                },
                {
                  label: "How to Use",
                  key: "howToUse",
                  placeholder: "Apply to pulse points...",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="uppercase tracking-widest text-xs text-neutral-400">
                    {label}
                  </label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    className="border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              ))}

              {/* In Stock */}
              <div className="flex flex-col gap-1">
                <label className="uppercase tracking-widest text-xs text-neutral-400">
                  In Stock
                </label>
                <select
                  value={form.inStock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inStock: e.target.value }))
                  }
                  className="border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Images */}
              <div className="flex flex-col gap-1">
                <label className="uppercase tracking-widest text-xs text-neutral-400">
                  Images {editing && "(leave empty to keep existing)"}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files) return;

                    const newFiles = Array.from(e.target.files);

                    setImages((prev) => [...prev, ...newFiles]);

                    // optional: reset input so same file can be selected again
                  }}
                  className="border border-neutral-200 px-4 py-3 text-sm text-neutral-500 cursor-pointer"
                />
              </div>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-20 h-20 object-cover border"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs rounded-full hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-neutral-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Update Product"
                    : "Create Product"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-neutral-300 py-4 uppercase tracking-widest text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
