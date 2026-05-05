import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  async indexDocument(
    chunkKey: string,
    sourceType: string,
    sourceId: string,
    content: string,
    sourceLabel?: string,
    metadata?: Record<string, unknown>,
  ) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorLiteral = toVectorLiteral(embedding);

      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO "document_embeddings"
        (
          "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES
        (
          ${Prisma.raw("gen_random_uuid()")},
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})} :: jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLabel" = EXCLUDED."sourceLabel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
        `);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async indexSubscriptionsData() {
    try {
      console.log("Fetching subscription data for indexing....");
      const subscriptions = await prisma.subscription.findMany({
        include: {
          student: true,
          plan: true,
          payment: true,
        },
      });

      let indexedCount = 0;

      for (const subscription of subscriptions) {
        const content = `Subscription for student: ${subscription.student?.name || 'Unknown'}\nPlan: ${subscription.plan?.name || 'Unknown'}\nStatus: ${subscription.status}\nPayment Status: ${subscription.paymentStatus}\nStart: ${subscription.startDate || 'N/A'}\nEnd: ${subscription.endDate || 'N/A'}`;

        const metadata = {
          subscriptionId: subscription.id,
          studentId: subscription.studentId,
          planId: subscription.planId,
          studentName: subscription.student?.name,
          planName: subscription.plan?.name,
          status: subscription.status,
          paymentStatus: subscription.paymentStatus,
        };

        const chunkKey = `subscription-${subscription.id}`;

        await this.indexDocument(
          chunkKey,
          "SUBSCRIPTION",
          subscription.id,
          content,
          subscription.student?.name,
          metadata,
        );

        indexedCount++;
      }

      console.log(`Successfully Indexed ${indexedCount} subscriptions.`);

      return {
        success: true,
        message: `Successfully Indexed ${indexedCount} subscriptions.`,
        indexedCount,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
