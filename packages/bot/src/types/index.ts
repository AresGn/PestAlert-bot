/**
 * Types pour l'intégration OpenEPI
 */

export interface Location {
  lat: number;
  lon: number;
}

export interface FarmerData {
  phone: string;
  location: Location;
  subscription?: 'basic' | 'premium';
}

export interface BinaryAnalysisResult {
  prediction: 'healthy' | 'diseased';
  confidence: number;
  timestamp: string;
  processing_time?: number;
}

export interface MultiClassPrediction {
  disease: string;
  confidence: number;
  risk_level: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface MultiClassAnalysisResult {
  top_prediction: MultiClassPrediction;
  all_predictions: MultiClassPrediction[];
  timestamp: string;
  analysis_type: string;
}

export interface WeatherAnalysis {
  current_risk: number;
  forecast_risk: number;
  alert_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
}

export interface AlertDecision {
  critical: boolean;
  preventive: boolean;
  message: string;
  actions: string[];
}

export interface AlertDecisionWithConfidence extends AlertDecision {
  uncertain: boolean;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  binaryConfidence: number;
  topPredictionConfidence: number;
  reasoning: string;
}

export interface AnalysisResponse {
  analysis: {
    crop_health: {
      binaryResult: BinaryAnalysisResult;
      multiClassResult: MultiClassAnalysisResult;
    };
    weather: WeatherAnalysis;
    alert: AlertDecisionWithConfidence;
  };
  timestamp: string;
}

export interface ImageMetadata {
  location?: Location;
  crop_type?: string;
  filename?: string;
}
