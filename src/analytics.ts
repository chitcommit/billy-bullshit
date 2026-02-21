/**
 * Analytics Service - Track Billy's usage and performance
 */

export interface AnalyticsEvent {
	endpoint: string;
	timestamp: number;
	language?: string;
	bsScore?: number;
	responseTime: number;
	aiModel: string;
	success: boolean;
	errorType?: string;
	codeSmells?: string[];
	feedback?: 'up' | 'down';
}

export interface AnalyticsMetrics {
	totalCalls: number;
	callsByEndpoint: Record<string, number>;
	languageDistribution: Record<string, number>;
	bsScoreDistribution: Record<string, number>;
	averageResponseTime: number;
	errorRate: number;
	aiModelUsage: Record<string, number>;
	fallbackUsage: number;
	feedbackStats: {
		positive: number;
		negative: number;
		total: number;
	};
	commonCodeSmells: Record<string, number>;
}

export class AnalyticsService {
	private analytics?: AnalyticsEngineDataset;

	constructor(analytics?: AnalyticsEngineDataset) {
		this.analytics = analytics;
	}

	/**
	 * Track an API call event
	 */
	async trackEvent(event: Partial<AnalyticsEvent>): Promise<void> {
		if (!this.analytics) {
			console.warn('Analytics Engine not configured');
			return;
		}

		try {
			const dataPoint = {
				blobs: [
					event.endpoint || 'unknown',
					event.language || 'unknown',
					event.aiModel || 'unknown',
					event.errorType || 'none',
				],
				doubles: [
					event.bsScore || 0,
					event.responseTime || 0,
				],
				indexes: [
					event.endpoint || 'unknown',
				],
			};

			await this.analytics.writeDataPoint(dataPoint);
		} catch (error) {
			console.error('Failed to track event:', error);
		}
	}

	/**
	 * Track a review with detailed metrics
	 */
	async trackReview(data: {
		language?: string;
		bsScore?: number;
		responseTime: number;
		aiModel: string;
		success: boolean;
		codeSmells?: string[];
		errorType?: string;
	}): Promise<void> {
		await this.trackEvent({
			endpoint: '/review',
			timestamp: Date.now(),
			...data,
		});
	}

	/**
	 * Track user feedback
	 */
	async trackFeedback(endpoint: string, feedback: 'up' | 'down', sessionId?: string): Promise<void> {
		await this.trackEvent({
			endpoint,
			timestamp: Date.now(),
			feedback,
			responseTime: 0,
			aiModel: 'feedback',
			success: true,
		});
	}

	/**
	 * Track an error
	 */
	async trackError(endpoint: string, errorType: string, responseTime: number): Promise<void> {
		await this.trackEvent({
			endpoint,
			timestamp: Date.now(),
			errorType,
			responseTime,
			aiModel: 'error',
			success: false,
		});
	}

	/**
	 * Calculate BS score bucket for distribution tracking
	 */
	private getBsScoreBucket(score: number): string {
		if (score <= 2) return '1-2';
		if (score <= 4) return '3-4';
		if (score <= 6) return '5-6';
		if (score <= 8) return '7-8';
		return '9-10';
	}

	/**
	 * Parse BS score from review text (Billy includes it in responses)
	 * Expected format: "BS SCORE: 7/10" or "BS Level: 7/10" or "BS Level: 7"
	 * 
	 * IMPORTANT: This relies on Billy's consistent output format as defined in
	 * billy-agent.ts reviewCode() method (lines 107-131). If the AI model 
	 * changes its output format, this parsing may fail and return undefined.
	 * The review prompt explicitly requests "BS SCORE: Rate 1-10" in the output.
	 * 
	 * @returns BS score (1-10) if found, undefined if not found or invalid
	 */
	parseBsScore(reviewText: string): number | undefined {
		const bsScoreMatch = reviewText.match(/BS\s+(?:SCORE|Level):\s*(\d+)(?:\/10)?/i);
		if (!bsScoreMatch) {
			return undefined;
		}
		
		const score = parseInt(bsScoreMatch[1], 10);
		
		// Validate score is in expected range (1-10)
		if (isNaN(score) || score < 1 || score > 10) {
			console.warn(`Invalid BS score parsed: ${score}`);
			return undefined;
		}
		
		return score;
	}

	/**
	 * Parse code smells from review text
	 * Looks for Billy's structured issue markers as defined in billy-agent.ts
	 * 
	 * IMPORTANT: This relies on Billy's output format including emoji markers
	 * and section headers (CRITICAL ISSUES, MAJOR ISSUES, BS DETECTOR, WTAF MOMENTS)
	 * as specified in the reviewCode() prompt. Changes to that format require
	 * updating these patterns.
	 */
	parseCodeSmells(reviewText: string): string[] {
		const smells: string[] = [];
		
		// Use word boundaries and more specific patterns to avoid false matches
		if (/🚩\s*CRITICAL/i.test(reviewText) || /\bCRITICAL\s+ISSUES\b/i.test(reviewText)) {
			smells.push('critical');
		}
		if (/⚠️\s*MAJOR/i.test(reviewText) || /\bMAJOR\s+ISSUES\b/i.test(reviewText)) {
			smells.push('major');
		}
		if (/💩\s*BS/i.test(reviewText) || /\bBS\s+DETECTOR\b/i.test(reviewText)) {
			smells.push('bs');
		}
		if (/🤦\s*WTAF/i.test(reviewText) || /\bWTAF\s+MOMENTS\b/i.test(reviewText)) {
			smells.push('wtaf');
		}

		return smells;
	}
}
