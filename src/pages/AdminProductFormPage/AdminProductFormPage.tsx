import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product, PaintType, ProductSpecification } from "../../types/product";
import {
  fetchProductById,
  createProduct,
  updateProduct,
} from "../../utils/api";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import "./AdminProductFormPage.css";

const AdminProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== "new";

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "base" as PaintType,
    color: "",
    colorCode: "",
    price: "",
    description: "",
    image: "",
    inStock: true,
    quantity: "",
  });

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    []
  );

  useEffect(() => {
    if (isEditMode && id) {
      loadProduct(id);
    }
  }, [id, isEditMode]);

  const loadProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await fetchProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          brand: product.brand,
          type: product.type,
          color: product.color,
          colorCode: product.colorCode,
          price: product.price.toString(),
          description: product.description || "",
          image: product.image || "",
          inStock: product.inStock,
          quantity: (product.quantity || 0).toString(),
        });
        setSpecifications(product.specifications || []);
      } else {
        setError("Товар не найден");
      }
    } catch (err) {
      setError("Ошибка при загрузке товара");
      console.error("Error loading product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecificationChange = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Название товара обязательно");
      return false;
    }
    if (!formData.brand.trim()) {
      setError("Бренд обязателен");
      return false;
    }
    if (!formData.colorCode.trim()) {
      setError("Код цвета обязателен");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Цена должна быть больше 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const productData: Omit<Product, "id"> = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        type: formData.type,
        color: formData.color.trim(),
        colorCode: formData.colorCode.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim() || "",
        image: formData.image.trim() || undefined,
        inStock: formData.inStock,
        quantity: parseInt(formData.quantity) || 0,
        specifications: specifications.filter(
          (spec) => spec.name.trim() && spec.value.trim()
        ),
      };

      if (isEditMode && id) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Ошибка при сохранении товара");
      console.error("Error saving product:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-form-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка товара...</p>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <div className="admin-form-header">
        <h1>{isEditMode ? "Редактировать товар" : "Добавить товар"}</h1>
        <Button variant="secondary" onClick={() => navigate("/admin")}>
          ← Назад к списку
        </Button>
      </div>

      {error && (
        <div className="admin-form-error">
          <p>{error}</p>
          <Button variant="error" onClick={() => setError(null)}>
            Закрыть
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-product-form">
        <div className="form-section">
          <h2>Основная информация</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Название <span className="required">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Например: Краска базовая BMW 668"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">
                Бренд <span className="required">*</span>
              </label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                placeholder="Например: BMW"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Тип краски</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="base">Базовая</option>
                <option value="metallic">Металлик</option>
                <option value="pearl">Перламутр</option>
                <option value="solid">Сплошная</option>
                <option value="primer">Грунт</option>
                <option value="clearcoat">Лак</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Цвет</label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Например: Черный"
              />
            </div>

            <div className="form-group">
              <label htmlFor="colorCode">
                Код цвета <span className="required">*</span>
              </label>
              <Input
                id="colorCode"
                name="colorCode"
                value={formData.colorCode}
                onChange={handleInputChange}
                required
                placeholder="Например: 668"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Цена (₽) <span className="required">*</span>
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="2500"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Дополнительная информация</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="form-textarea"
                placeholder="Описание товара..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">URL изображения</label>
              <Input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Количество</label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="inStock" className="checkbox-label">
                <input
                  id="inStock"
                  name="inStock"
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                />
                <span>В наличии</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Спецификации</h2>
            <Button
              type="button"
              variant="primary"
              size="small"
              onClick={addSpecification}
            >
              + Добавить спецификацию
            </Button>
          </div>

          {specifications.length === 0 ? (
            <p className="empty-specs">Спецификации не добавлены</p>
          ) : (
            <div className="specifications-list">
              {specifications.map((spec, index) => (
                <div key={index} className="specification-item">
                  <Input
                    placeholder="Название (например: Объем)"
                    value={spec.name}
                    onChange={(e) =>
                      handleSpecificationChange(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Значение (например: 1 л)"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(index, "value", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="error"
                    size="small"
                    onClick={() => removeSpecification(index)}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin")}
            disabled={isSaving}
          >
            Отмена
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Сохранение..." : isEditMode ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
