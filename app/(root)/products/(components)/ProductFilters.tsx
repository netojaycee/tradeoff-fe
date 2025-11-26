"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import { useGetCategoriesQuery } from "@/lib/api";

export interface Filters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  conditions?: string[];
  sizes?: string[];
  genders?: string[];
}

export type ProductFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const CONDITIONS = [
  { id: "new", label: "New" },
  { id: "like-new", label: "Like New" },
  { id: "used", label: "Used" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const GENDERS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "unisex", label: "Unisex" },
];

export default function ProductFilters({
  filters,
  onChange,
}: ProductFiltersProps) {
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    condition: false,
    size: false,
    gender: false,
  });

  const [localFilters, setLocalFilters] = useState(filters);

  const toggleExpanded = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const updated = { ...localFilters };
    if (!updated.categories) updated.categories = [];

    if (updated.categories.includes(categoryId)) {
      updated.categories = updated.categories.filter(
        (c: string) => c !== categoryId
      );
    } else {
      updated.categories.push(categoryId);
    }
    setLocalFilters(updated);
    onChange(updated);
  };

  const handlePriceChange = (min: number, max: number) => {
    const updated = { ...localFilters, priceMin: min, priceMax: max };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleConditionToggle = (conditionId: string) => {
    const updated = { ...localFilters };
    if (!updated.conditions) updated.conditions = [];

    if (updated.conditions.includes(conditionId)) {
      updated.conditions = updated.conditions.filter(
        (c: string) => c !== conditionId
      );
    } else {
      updated.conditions.push(conditionId);
    }
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleSizeToggle = (size: string) => {
    const updated = { ...localFilters };
    if (!updated.sizes) updated.sizes = [];

    if (updated.sizes.includes(size)) {
      updated.sizes = updated.sizes.filter((s: string) => s !== size);
    } else {
      updated.sizes.push(size);
    }
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleGenderToggle = (genderId: string) => {
    const updated = { ...localFilters };
    if (!updated.genders) updated.genders = [];

    if (updated.genders.includes(genderId)) {
      updated.genders = updated.genders.filter(
        (g: string) => g !== genderId
      );
    } else {
      updated.genders.push(genderId);
    }
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleReset = () => {
    setLocalFilters({});
    onChange({});
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded("category")}
        >
          <h3 className="font-semibold text-sm">Category</h3>
          <Icon
            icon={
              expanded.category
                ? "mdi:chevron-up"
                : "mdi:chevron-down"
            }
            className="text-lg"
          />
        </div>
        {expanded.category && (
          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category._id}
                    checked={
                      localFilters.categories?.includes(category.slug) || false
                    }
                    onCheckedChange={() =>
                      handleCategoryToggle(category.slug)
                    }
                  />
                  <Label
                    htmlFor={category._id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading categories...</p>
            )}
          </div>
        )}
        <Separator className="my-3" />
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded("price")}
        >
          <h3 className="font-semibold text-sm">Price Range (NGN)</h3>
          <Icon
            icon={
              expanded.price
                ? "mdi:chevron-up"
                : "mdi:chevron-down"
            }
            className="text-lg"
          />
        </div>
        {expanded.price && (
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={localFilters.priceMin || 0}
              onChange={(e) =>
                handlePriceChange(
                  parseInt(e.target.value),
                  localFilters.priceMax || 10000000
                )
              }
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={localFilters.priceMax || 10000000}
              onChange={(e) =>
                handlePriceChange(
                  localFilters.priceMin || 0,
                  parseInt(e.target.value)
                )
              }
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              ₦{(localFilters.priceMin || 0).toLocaleString('en-NG')} - ₦{(localFilters.priceMax || 10000000).toLocaleString('en-NG')}
            </div>
          </div>
        )}
        <Separator className="my-3" />
      </div>

      {/* Condition Filter */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded("condition")}
        >
          <h3 className="font-semibold text-sm">Condition</h3>
          <Icon
            icon={
              expanded.condition
                ? "mdi:chevron-up"
                : "mdi:chevron-down"
            }
            className="text-lg"
          />
        </div>
        {expanded.condition && (
          <div className="space-y-2">
            {CONDITIONS.map((condition) => (
              <div key={condition.id} className="flex items-center space-x-2">
                <Checkbox
                  id={condition.id}
                  checked={
                    localFilters.conditions?.includes(condition.id) ||
                    false
                  }
                  onCheckedChange={() =>
                    handleConditionToggle(condition.id)
                  }
                />
                <Label
                  htmlFor={condition.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
        )}
        <Separator className="my-3" />
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded("size")}
        >
          <h3 className="font-semibold text-sm">Size</h3>
          <Icon
            icon={
              expanded.size
                ? "mdi:chevron-up"
                : "mdi:chevron-down"
            }
            className="text-lg"
          />
        </div>
        {expanded.size && (
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-2 px-3 rounded text-sm font-medium border transition ${
                  localFilters.sizes?.includes(size)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        <Separator className="my-3" />
      </div>

      {/* Gender Filter */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded("gender")}
        >
          <h3 className="font-semibold text-sm">Gender</h3>
          <Icon
            icon={
              expanded.gender
                ? "mdi:chevron-up"
                : "mdi:chevron-down"
            }
            className="text-lg"
          />
        </div>
        {expanded.gender && (
          <div className="space-y-2">
            {GENDERS.map((gender) => (
              <div key={gender.id} className="flex items-center space-x-2">
                <Checkbox
                  id={gender.id}
                  checked={
                    localFilters.genders?.includes(gender.id) || false
                  }
                  onCheckedChange={() =>
                    handleGenderToggle(gender.id)
                  }
                />
                <Label
                  htmlFor={gender.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {gender.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
