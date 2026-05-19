export interface AICompletionRequest {
  prompt: string;
  maxTokens?: number;
}

export interface AIModerationRequest {
  content: string;
}

/**
 * AI Service Mock
 * Represents Google Gemini / OpenAI integrations for AI features
 */
export class AIService {
  /**
   * Generates content or answers questions (e.g. for Forum / Quiz generation)
   */
  static async generateCompletion(request: AICompletionRequest): Promise<string> {
    console.log('[AI Mock] Generating completion for prompt:', request.prompt);

    return `[AI Generated Response] Based on your prompt, here is a helpful answer or generated content.`;
  }

  /**
   * Moderates content for forum posts and comments
   */
  static async moderateContent(request: AIModerationRequest): Promise<{ isFlagged: boolean, reason?: string }> {
    console.log('[AI Mock] Moderating content:', request.content.substring(0, 50) + '...');

    // Simple mock logic
    if (request.content.toLowerCase().includes('spam') || request.content.toLowerCase().includes('hate')) {
      return { isFlagged: true, reason: 'Content contains inappropriate language.' };
    }

    return { isFlagged: false };
  }
}
