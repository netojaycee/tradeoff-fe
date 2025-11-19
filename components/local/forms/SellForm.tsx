"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { CustomInput } from "@/components/local/custom/CustomInput";
import { CustomButton } from "@/components/local/custom/CustomButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { productSchema, type ProductFormData } from "@/lib/schema";
import { useGetCategoriesQuery, useCreateProductMutation } from "@/redux/api";

interface SellFormProps {
  onSubmit?: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function SellForm({ onSubmit, isLoading = false }: SellFormProps) {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // RTK Query for categories
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      model: "",
      condition: "New",
      size: "",
      gender: "Unisex",
      quantity: 1,
      price: 0,
      originalPrice: undefined,
      description: "",
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Check max 10 images
    if (uploadedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Process each file
    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB allowed.`);
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPreviewUrls((prev) => [...prev, dataUrl]);
        setUploadedImages((prev) => [...prev, dataUrl]); // In real app, upload to server
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: ProductFormData) => {
    try {
      // Add uploaded images to form data
      const formData = {
        ...values,
        images: uploadedImages,
      };

      if (uploadedImages.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Use RTK mutation if no custom onSubmit
        await createProduct(formData).unwrap();
        toast.success("Product created successfully!");
        router.push("/products");
      }
    } catch (error: any) {
      console.error("Product creation failed:", error);
      const errorMessage = error?.data?.message || "Failed to create product";
      toast.error(errorMessage);
    }
  };

  const categories = categoriesData?.data || [];
  const loading = isLoading || isCreating || categoriesLoading;

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {/* PRODUCT IMAGES SECTION */}
          <div className="rounded border border-[#E5E5E5]">
            <h2 className="text-[#525252] font-semibold mb-2 border-b px-4 py-2">
              Product Images
            </h2>

            <div className="px-4 pb-4">
              {/* Image Upload Area */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-[#525252]">
                  Upload Images
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading || uploadedImages.length >= 10}
                  />
                  <div className="border-2 border-dashed border-[#D5D5D5] rounded-lg p-6 text-center hover:border-[#999] transition-colors">
                    <Icon
                      icon="material-symbols:image-outline"
                      className="w-10 h-10 mx-auto mb-2 text-gray-400"
                    />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB. Max 10 images.
                    </p>
                    <p className="text-xs text-gray-500">
                      {uploadedImages.length}/10 images uploaded
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-[#f5f5f5] border border-[#E5E5E5]"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover absolute inset-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Icon icon="material-symbols:close" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT INFORMATION SECTION */}
          <div className="rounded border border-[#E5E5E5]">
            <h2 className="text-[#525252] font-semibold mb-2 border-b px-4 py-2">
              Product Information
            </h2>

            <div className="space-y-3 px-4 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#525252] font-normal">
                      Product Name *
                    </FormLabel>
                    <FormControl>
                      <CustomInput
                        placeholder="e.g. Vintage Leather Jacket"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Category *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id || category._id} value={category.id || category._id || ""}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Model / Style
                      </FormLabel>
                      <FormControl>
                        <CustomInput
                          placeholder="e.g. Classic Black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Condition *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Gender
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#525252] font-normal">
                      Size
                    </FormLabel>
                    <FormControl>
                      <CustomInput
                        placeholder="e.g. M, L, XL, 42, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* PRICING & QUANTITY SECTION */}
          <div className="rounded border border-[#E5E5E5]">
            <h2 className="text-[#525252] font-semibold mb-2 border-b px-4 py-2">
              Pricing & Quantity
            </h2>

            <div className="space-y-3 px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Selling Price (₦) *
                      </FormLabel>
                      <FormControl>
                        <CustomInput
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Original Price (₦) (Optional)
                      </FormLabel>
                      <FormControl>
                        <CustomInput
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#525252] font-normal">
                      Quantity Available *
                    </FormLabel>
                    <FormControl>
                      <CustomInput
                        type="number"
                        placeholder="1"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="rounded border border-[#E5E5E5]">
            <h2 className="text-[#525252] font-semibold mb-2 border-b px-4 py-2">
              Description
            </h2>

            <div className="px-4 pb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#525252] font-normal">
                      Item Description *
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Describe your product in detail. Include material, brand, size, condition, any defects or damages, etc."
                        className="min-h-[150px] w-full px-3 py-2 border border-[#D5D5D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#404040] focus:border-transparent text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      {field.value?.length || 0}/2000 characters
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex gap-3">
            <CustomButton
              type="submit"
              className="flex-1"
              disabled={loading}
              loading={loading}
            >
              List Product
            </CustomButton>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-[#D5D5D5] rounded-md text-[#404040] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
