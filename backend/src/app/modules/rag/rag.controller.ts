import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { RAGService } from "./rag.service";
import { redisClient } from "../../../lib/redis";

const ragService = new RAGService();

const normalizeQuery = (query: string) => query.trim().toLowerCase().replace(/\s+/g, " ");

const buildCacheKey = (query: string, limit: number, sourceType?: string) => {
  return `rag:query:${normalizeQuery(query)}:${limit}:${sourceType ?? "all"}`;
};

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.getStats();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "RAG stats retrieved successfully",
    data: result,
  });
});

const ingestSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.ingestSubscriptionsData();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Subscriptions data ingestion completed",
    data: result,
  });
});

const queryRag = catchAsync(async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;

  if (!query) {
    return sendResponse(res, {
      success: false,
      httpStatusCode: status.BAD_REQUEST,
      message: "Query is required",
    });
  }

  const queryLimit = limit ?? 5;
  const cacheKey = buildCacheKey(query, queryLimit, sourceType);

  if (redisClient) {
    try {
      const cachedResult = await redisClient.get(cacheKey);

      if (cachedResult) {
        const parsedResult = JSON.parse(cachedResult) as unknown;

        return sendResponse(res, {
          success: true,
          httpStatusCode: status.OK,
          message: "Answer retrieved from cache",
          data: parsedResult,
        });
      }
    } catch (cacheError) {
      console.warn("Redis cache read failed, falling back to generation:", cacheError);
    }
  }

  const result = await ragService.generateAnswer(query, queryLimit, sourceType, true);

  if (redisClient && result) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(result), "EX", 60 * 30);
    } catch (cacheError) {
      console.warn("Redis cache write failed:", cacheError);
    }
  }

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Answer generated successfully",
    data: result,
  });
});

export const RagController = {
  getStats,
  ingestSubscriptions,
  queryRag,
};
