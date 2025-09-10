import dataProvider from "@refinedev/simple-rest";
import { TOKEN_KEY } from "./authProvider";
import { IS_DEV_MODE } from "./config";

// const API_URL = "https://hub.quanlythuysan.vn/api";
export const API_URL = IS_DEV_MODE
  ? "http://localhost:3002/api"
  : "https://hub.quanlythuysan.vn/api";

// Tạo base dataProvider với headers
const baseDataProvider = dataProvider(API_URL);

// Resource mapping: map refine resource tên sang API endpoint
const resourceMapping = {
  users: "users", // /api/v1/users
  orders: "orders", // /api/v1/orders
  products: "products", // /api/v1/products
  categories: "categories", // /api/v1/categories
  stores: "stores", // /api/v1/stores
  couriers: "couriers", // /api/v1/couriers
  topup: "topup", // /api/topup
  devices: "devices", // /api/devices
  "subscriptions/plans": "subscriptions/plans", // /api/subscriptions/plans
  "ship-notifications": "v1/ship-notifications", // /api/subscriptions\topup:
  ships: "ships/admin", // /api/topup
  feedbacks: "feedbacks",
  reports: "reports",
  agencies: "agencies", // agencies management
} as const;

const resourceMappingShow = {
  "subscriptions/plans": "subscriptions/plans", // /api/subscriptions/plans
  "ship-notifications": "v1/ship-notifications", // /api/subscriptions\topup:
} as const;

// Hàm để map resource name sang API endpoint
const mapResourceToEndpoint = (resource: string, action = ""): string => {
  if (action === "show") {
    const mapped =
      resourceMappingShow[resource as keyof typeof resourceMappingShow];
    return mapped || resource;
  }

  const mapped = resourceMapping[resource as keyof typeof resourceMapping];
  return mapped || resource;
};

// Tạo axios instance với authentication
import { axiosInstance } from "./axiosInstance";

// Override dataProvider để custom resource mapping và authentication
export const customDataProvider = {
  ...baseDataProvider,

  getApiUrl: () => API_URL,

  getList: async ({ resource, pagination, filters, sorters, meta }: any) => {
    const endpoint = mapResourceToEndpoint(resource, "list");
    console.log(`getList: ${resource} -> ${endpoint}`);

    // Build query parameters
    const query = new URLSearchParams();

    // Pagination
    if (pagination) {
      const { current = 1, pageSize = 10 } = pagination;
      query.append("page", current.toString());
      query.append("limit", pageSize.toString());
    }

    // Filters
    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        if ("field" in filter && filter.value !== undefined) {
          query.append(filter.field, filter.value.toString());
        }
      });
    }

    // Sorters
    if (sorters && sorters.length > 0) {
      sorters.forEach((sorter: any) => {
        query.append("sortBy", sorter.field);
        query.append("sortOrder", sorter.order);
      });
    }

    const url = `${API_URL}/${endpoint}?${query.toString()}`;
    console.log("Final API URL:", url);

    try {
      const response = await axiosInstance.get(url);
      console.log("API Response:", response.data);

      // Chuẩn hóa nhiều dạng response khác nhau
      const responseData = response.data;

      let data: any[] = [];
      // data có thể nằm ở: data (array) | data.items (array) | response (array)
      if (Array.isArray(responseData?.data)) {
        data = responseData.data;
      } else if (Array.isArray(responseData?.data?.items)) {
        data = responseData.data.items;
      } else if (Array.isArray(responseData)) {
        data = responseData;
      }

      // total có thể nằm ở: pagination.total | total | meta.total | data.length (fallback)
      const total = Number(
        responseData?.pagination?.total ??
          responseData?.total ??
          responseData?.meta?.total ??
          (Array.isArray(data) ? data.length : 0)
      );

      return {
        data,
        total,
      };
    } catch (error) {
      console.error("API Error in getList:", error);
      throw error;
    }
  },

  getOne: async ({ resource, id, meta }: any) => {
    const endpoint = mapResourceToEndpoint(resource, "show");
    console.log(`getOne: ${resource}/${id} -> ${endpoint}/${id}`);

    const url = `${API_URL}/${endpoint}/${id}`;

    try {
      const response = await axiosInstance.get(url);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("API Error in getOne:", error);
      throw error;
    }
  },

  getMany: async ({ resource, ids, meta }: any) => {
    const endpoint = mapResourceToEndpoint(resource);
    console.log(`getMany: ${resource} -> ${endpoint}`, ids);

    // Gọi getOne cho từng id (fallback approach)
    const promises = ids.map((id: any) =>
      customDataProvider.getOne({ resource, id, meta })
    );

    try {
      const results = await Promise.all(promises);
      return {
        data: results.map((result: any) => result.data),
      };
    } catch (error) {
      console.error("API Error in getMany:", error);
      throw error;
    }
  },

  create: async ({ resource, variables, meta }: any) => {
    const endpoint = mapResourceToEndpoint(resource);
    console.log(`create: ${resource} -> ${endpoint}`, variables);

    // Special handling for topup - uses /topup/create endpoint
    let url = `${API_URL}/${endpoint}`;
    if (resource === "topup") {
      url = `${API_URL}/${endpoint}/create`;
    }

    try {
      const response = await axiosInstance.post(url, variables);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("API Error in create:", error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }: any) => {
    const endpoint = mapResourceToEndpoint(resource);
    console.log(`update: ${resource}/${id} -> ${endpoint}/${id}`, variables);

    const url = `${API_URL}/${endpoint}/${id}`;

    try {
      const response = await axiosInstance.put(url, variables);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("API Error in update:", error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, variables, meta }: any) => {
    const endpoint = mapResourceToEndpoint(resource);
    console.log(`deleteOne: ${resource}/${id} -> ${endpoint}/${id}`);

    const url = `${API_URL}/${endpoint}/${id}`;

    try {
      const response = await axiosInstance.delete(url);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("API Error in deleteOne:", error);
      throw error;
    }
  },

  // Optional: custom endpoint
  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
  }: any) => {
    let fullUrl = url.startsWith("http") ? url : `${API_URL}/${url}`;

    // Add query parameters
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query as any).toString();
      fullUrl += `?${queryString}`;
    }

    const config: any = {
      method: method || "GET",
      headers: {
        ...headers,
      },
    };

    if (payload) {
      config.data = payload;
    }

    try {
      const response = await axiosInstance.request({
        url: fullUrl,
        ...config,
      });

      return {
        data: response.data,
      };
    } catch (error) {
      console.error("API Error in custom:", error);
      throw error;
    }
  },

  // Custom action for creating paid topup
  createPaidTopUp: async (params: {
    imei: string;
    planId: string;
    userId?: string;
    skipPayment?: boolean;
    paymentMethod?: string;
  }) => {
    console.log("createPaidTopUp called with params:", params);

    try {
      const response = await axiosInstance.post(
        `${API_URL}/payments/create-paid`,
        params
      );

      return {
        data: response.data,
      };
    } catch (error) {
      console.error("API Error in createPaidTopUp:", error);
      throw error;
    }
  },
};

export default customDataProvider;
